import { getAddress, getAddressForMultisig, toScriptHash } from './utils/bitcoin';
import range from './utils/helpers';
import { getHistories, getTransactions, getUTXOs } from './api';

export default async (connection, wallets) => {
  const createAddresses = (wallet) => {
    const getAddressFn = 'xpub' in wallet ? getAddress : getAddressForMultisig;
    const xpubInfo = 'xpub' in wallet ? wallet.xpub : wallet.xpubs;

    return [0, 1].map((isChange) => range(100).map((index) => ({
      address: getAddressFn(xpubInfo, wallet.type, index, isChange),
      isChange,
      index,
      type: wallet.type,
      wallet: wallet.name,
    }))).flat();
  };

  const toHistories = async (addresses) => {
    const histories = await getHistories(
      connection,
      addresses.map((o) => toScriptHash(o.address)),
    );

    const addressMap = Object.fromEntries(addresses.map((o) => [toScriptHash(o.address), o]));

    return histories
      .map((h) => ({ ...h, info: addressMap[h.scriptHash] }))
      .filter((h) => h.transactions.length > 0);
  };

  const getTxs = async (txHashes) => {
    const transactions = await getTransactions(connection, txHashes);

    return Object.fromEntries(transactions.map((t) => [t.txid, t]));
  };

  const generateUTXOLinks = async (scriptHashes) => {
    const scriptHashMap = Object.fromEntries(scriptHashes.map((obj) => [obj.scriptHash, obj]));
    const unspent = await getUTXOs(connection, scriptHashes.map((h) => h.scriptHash));

    return unspent
      .flatMap((u) => u.utxos.map((utxo) => ({
        type: 'utxo',
        source: `txo:${utxo.tx_hash}`,
        target: `utxo:${u.scriptHash}`,
        utxo,
        value: utxo.value,
        info: scriptHashMap[u.scriptHash],
      })));
  };

  const generateUTXONodes = (links) => links
    .filter((l) => l.type === 'utxo')
    .map((l) => ({
      id: l.target,
      name: l.target.slice(0, 4),
      type: 'utxo',
    }));

  const generateTXONodes = (transactionMap) => Object.values(transactionMap).map((tx) => ({
    type: 'txo',
    name: tx.txid.slice(0, 4),
    id: `txo:${tx.txid}`,
    tx,
  }));

  const generateTXOs = async (transactionMap, scriptHashes) => {
    const histories = scriptHashes.flatMap(
      (v) => v.transactions.map((hist) => ({
        txid: hist.tx_hash, ...v,
      })),
    );

    // load all other transactions
    const otherTransactions = histories.flatMap(
      (h) => transactionMap[h.txid].vin.map((vin) => vin.txid),
    ).filter((h) => !(h in transactionMap));

    const otherTransactionMap = await getTxs(otherTransactions);
    // eslint-disable-next-line no-param-reassign
    Object.entries(otherTransactionMap).forEach(([k, v]) => { transactionMap[k] = v; });

    const incomingTxos = histories.flatMap((h) => transactionMap[h.txid].vin
      .map((vin) => ({ ...h, vin, vout: transactionMap[vin.txid].vout[vin.vout] })))
      .filter((txo) => txo.vout.scriptPubKey.address === txo.info.address);

    return incomingTxos.map((txo) => ({
      type: 'txo',
      ...txo,
      source: `txo:${txo.vin.txid}`,
      target: `txo:${txo.txid}`,
      value: txo.vout.value,
    }));
  };

  const addresses = wallets.flatMap((w) => createAddresses(w));
  const scriptHashes = await toHistories(addresses);

  const txHashes = scriptHashes.flatMap((h) => h.transactions).map((h) => h.tx_hash);

  const transactionMap = await getTxs(txHashes);
  const txoNodes = generateTXONodes(transactionMap);

  const utxoLinks = await generateUTXOLinks(scriptHashes);
  const txoLinks = await generateTXOs(transactionMap, scriptHashes);
  const links = [...txoLinks, ...utxoLinks];

  const utxoNodes = generateUTXONodes(utxoLinks);
  const nodes = [...txoNodes, ...utxoNodes];

  const model = { nodes, links };

  return model;
};
