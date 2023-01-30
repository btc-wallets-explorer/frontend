import { getAddress, getAddressForMultisig, toScriptHash } from './utils/bitcoin';
import range from './utils/helpers';
import { getHistories, getTransactions } from './api';

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

  const generateLinks = async (transactionMap, scriptHashes) => {
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
      ...txo, source: txo.vin.txid, target: txo.txid, value: txo.vout.value,
    }));
  };

  const addresses = wallets.flatMap((w) => createAddresses(w));
  const scriptHashes = await toHistories(addresses);

  const txHashes = scriptHashes.flatMap((h) => h.transactions).map((h) => h.tx_hash);

  const transactionMap = await getTxs(txHashes);

  const nodes = Object.values(transactionMap).map(
    (tx) => ({ name: tx.txid.slice(0, 4), id: tx.txid, tx }),
  );
  const links = await generateLinks(transactionMap, scriptHashes);

  const model = { nodes, links };

  return model;
};
