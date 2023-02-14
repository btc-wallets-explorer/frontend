export const createApiMock = (data) => ({
  getWallets: () => data.wallets,
  getSettings: () => data.settings,
  getTransactions: (txs) => txs.map((t) => data.blockchain.transactions[t]),
  getHistories: (hashes) => hashes.map(
    (h) => (h in data.blockchain.scriptHashes
      ? data.blockchain.scriptHashes[h]
      : { scriptHash: h, transactions: [] }),
  ),
  getUTXOs: (hashes) => hashes.map(
    (h) => (h in data.blockchain.utxos
      ? data.blockchain.utxos[h]
      : { scriptHash: h, utxos: [] }),
  ),
});
