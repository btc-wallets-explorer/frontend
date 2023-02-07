import data from './test-data/basic-test-data';

export const createConnection = () => ('api-mock');

export const getWallets = () => data.wallets;

export const getSettings = () => data.settings;

export const getHistories = (_, hashes) => data.histories
  .filter((o) => hashes.includes(o.scriptHash));
export const getTransactions = (_, txIds) => data.transactions
  .filter((tx) => txIds.includes(tx.txid));
export const getUTXOs = (_, hashes) => data.utxos
  .filter((utxo) => hashes.includes(utxo.scriptHash));
