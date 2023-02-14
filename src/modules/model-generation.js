import { createAddresses, toScriptHash } from '../utils/bitcoin';

export const generateModel = async (api, wallets) => {
  const toHistories = async (addressObjs) => {
    const hashes = addressObjs.map((o) => toScriptHash(o.address));
    const histories = await api.getHistories(hashes);

    const addressMap = Object.fromEntries(addressObjs.map((o) => [toScriptHash(o.address), o]));

    return histories
      .map((h) => ({ ...h, info: addressMap[h.scriptHash] }))
      .filter((h) => h.transactions.length > 0);
  };

  const getTxs = async (txHashes) => {
    const transactions = await api.getTransactions(txHashes);

    return Object.fromEntries(transactions.map((t) => [t.txid, t]));
  };

  const fetchAllScriptHashes = async (wallet) => {
    const limit = 100;
    const start = 0;

    const addresses = [
      ...createAddresses(wallet, 0, start, limit),
      ...createAddresses(wallet, 1, start, limit),
    ];
    const scriptHashes = await toHistories(addresses);
    // store.dispatch(sendNotification({ title: 'addresses', content: wallet }));
    return scriptHashes;
  };

  const scriptHashes = (await Promise.all(
    wallets.flatMap(async (w) => fetchAllScriptHashes(w)),
  )).flat();
  const txHashes = scriptHashes.flatMap((h) => h.transactions).map((h) => h.tx_hash);
  const transactionMap = await getTxs(txHashes);
  const utxos = await api.getUTXOs(scriptHashes.map((h) => h.scriptHash));
  const utxoMap = Object.fromEntries(utxos
    .filter((entry) => entry.utxos.length > 0)
    .map((entry) => [entry.scriptHash, entry]));
  const scriptHashMap = Object.fromEntries(
    scriptHashes.map((h) => [h.scriptHash, h]),
  );

  return {
    transactions: transactionMap,
    scriptHashes: scriptHashMap,
    utxos: utxoMap,
  };
};
