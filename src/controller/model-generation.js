import { chunk, flatten } from "lodash";
import { sendNotification } from "../model/store/ui.reducer";
import { createAddresses, toScriptHash } from "./utils/bitcoin";

export const loadBlockchainState = async (store, api, wallets) => {
  const toHistories = async (addressObjs) => {
    const hashes = addressObjs.map((o) => toScriptHash(o.address));
    const histories = await api.getHistories(hashes);

    const addressMap = Object.fromEntries(
      addressObjs.map((o) => [toScriptHash(o.address), o]),
    );

    return histories
      .map((h) => ({ ...h, info: addressMap[h.scriptHash] }))
      .filter((h) => h.transactions.length > 0);
  };

  const getTxs = async (txHashes) => {
    const transactions = flatten(
      await Promise.all(
        chunk(txHashes, 100).map(async (batch) => api.getTransactions(batch)),
      ),
    );

    return Object.fromEntries(transactions.map((t) => [t.txid, t]));
  };

  const fetchAllScriptHashes = async (wallet) => {
    const fetch = async (isChange, start, limit) => {
      store.dispatch(
        sendNotification({
          title: "fetching",
          content: `${isChange ? "change" : ""} addresses for ${
            wallet.name
          } - ${start}-${start + limit}`,
        }),
      );

      const addresses = createAddresses(wallet, isChange, start, limit);
      const histories = await toHistories(addresses);
      return histories.length > 0
        ? [...histories, ...(await fetch(isChange, start + limit, limit))]
        : histories;
    };

    const gapLimit = 50;
    const scriptHashes = [
      ...(await fetch(0, 0, gapLimit)),
      ...(await fetch(1, 0, gapLimit)),
    ];

    return scriptHashes;
  };

  const scriptHashes = (
    await Promise.all(wallets.flatMap(async (w) => fetchAllScriptHashes(w)))
  ).flat();
  const txHashes = scriptHashes
    .flatMap((h) => h.transactions)
    .map((h) => h.tx_hash);
  const transactionMap = await getTxs(txHashes);
  const utxos = await api.getUTXOs(scriptHashes.map((h) => h.scriptHash));
  const utxoMap = Object.fromEntries(
    utxos
      .filter((entry) => entry.utxos.length > 0)
      .map((entry) => [entry.scriptHash, entry]),
  );
  const scriptHashMap = Object.fromEntries(
    scriptHashes.map((h) => [h.scriptHash, h]),
  );

  return {
    transactions: transactionMap,
    scriptHashes: scriptHashMap,
    utxos: utxoMap,
  };
};
