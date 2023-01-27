import { getAddress, getAddressForMultisig, toScriptHash } from './utils/bitcoin';
import range from './utils/helpers';
import { getHistories, getTransactions } from './api';

export default async (connection, wallets) => {
  const getAddresses = (wallet) => {
    const getAddressFn = 'xpub' in wallet ? getAddress : getAddressForMultisig;
    const xpubInfo = 'xpub' in wallet ? wallet.xpub : wallet.xpubs;

    const objs = [0, 1].map((isChange) => range(100).map((index) => ({
      address: getAddressFn(xpubInfo, wallet.type, index, isChange),
      isChange,
      index,
      type: wallet.type,
    }))).flat();

    return Object.fromEntries(objs.map((o) => [o.address, o]));
  };

  const getHists = async (addressObjs) => {
    const histories = await Promise.all(
      addressObjs.map(async (o) => ({
        hash: toScriptHash(o.address),
        info: o,
        histories: (await getHistories(connection, { scriptHashes: [toScriptHash(o.address)] }))[0]
          .transactions,
      })),
    );

    return Object.fromEntries(
      histories
        .filter((h) => h.histories.length > 0)
        .map((h) => [h.hash, h]),
    );
  };

  const getTxs = async (txHashes) => {
    const transactions = await Promise.all(
      txHashes.map(async (h) => (await getTransactions(connection, { transactions: [h] }))[0]),
    );

    return Object.fromEntries(transactions.map((t) => [t.txid, t]));
  };

  const getTransaction = async (transactionMap, txHash) => {
    if (!(txHash in transactionMap)) {
    // eslint-disable-next-line no-param-reassign, prefer-destructuring
      transactionMap[txHash] = (await getTransactions(connection, { transactions: [txHash] }))[0];
    }

    return transactionMap[txHash];
  };

  const getScriptHashMapForWallet = async (wallet) => {
    const addressMap = getAddresses(wallet);
    return getHists(Object.values(addressMap));
  };

  const generateLinks = async (transactionMap, walletScriptHashMap) => {
    const histories = Object.entries(walletScriptHashMap)
      .flatMap(([wallet, o]) => Object.entries(o).flatMap(
        ([scriptHash, v]) => v.histories.map((hist) => ({
          wallet, scriptHash, info: v.info, txid: hist.tx_hash,
        })),
      ));

    // load all other transactions
    const otherTransactions = histories.flatMap(
      (h) => transactionMap[h.txid].vin.map((vin) => vin.txid),
    );
    await Promise.all(otherTransactions.map(
      async (txid) => getTransaction(transactionMap, txid),
    ));

    const incomingTxos = histories.flatMap((h) => transactionMap[h.txid].vin
      .map((vin) => ({ ...h, vin, vout: transactionMap[vin.txid].vout[vin.vout] })))
      .filter((txo) => txo.vout.scriptPubKey.address === txo.info.address);

    return incomingTxos.map((txo) => ({
      ...txo, source: txo.vin.txid, target: txo.txid, value: txo.vout.value,
    }));
  };

  const walletScriptHashMap = Object.fromEntries(await Promise.all(
    Object.keys(wallets).map(async (w) => [w, await getScriptHashMapForWallet(wallets[w])]),
  ));

  const txHashes = Object.values(walletScriptHashMap)
    .flatMap((walletMap) => Object.values(walletMap).flatMap((h) => h.histories))
    .map((h) => h.tx_hash);

  const transactionMap = await getTxs(txHashes);

  const nodes = Object.values(transactionMap).map(
    (tx) => ({ name: tx.txid.slice(0, 4), id: tx.txid, tx }),
  );
  const links = await generateLinks(transactionMap, walletScriptHashMap);

  const model = { nodes, links };

  return model;
};
