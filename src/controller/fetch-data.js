import { chunk, flatten } from "lodash";
import { setBlockchain } from "../model/store/blockchain.reducer";
import { setSettings } from "../model/store/settings.reducer.";
import { sendNotification } from "../model/store/ui.reducer";
import { addWallets } from "../model/store/wallets.reducer";
import { createAddresses, toScriptHash } from "./utils/bitcoin";

export const loadSettings = (api) => async (dispatch) => {
  const settings = await api.getSettings();
  dispatch(setSettings(settings));
};

export const loadWallets = (api) => async (dispatch) => {
  const wallets = await api.getWallets();
  dispatch(addWallets(wallets));
};

export const loadBlockchain = (api) => async (dispatch, getState) => {
  const wallets = getState().wallets;

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
      dispatch(
        sendNotification({
          title: "fetching",
          content: `${isChange ? "change" : ""} adresses for ${
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

  dispatch(
    setBlockchain({
      transactions: transactionMap,
      scriptHashes: scriptHashMap,
      utxos: utxoMap,
    }),
  );
};
