import { toScriptHash } from "../../utils/bitcoin";

export const toOverviewModel = (network) => {
  console.log(JSON.stringify(network, null, 2));

  const getSpendVin = (txid, index, vout) => {
    const scriptHash =
      network.scriptHashes[toScriptHash(vout.scriptPubKey.address)];

    const result = scriptHash
      ? scriptHash.transactions
          .map((st) => network.transactions[st.tx_hash])
          .flatMap((tx) => tx.vin.map((vin) => ({ txid: tx.txid, vin })))
          .find(
            (vin_obj) =>
              vin_obj.vin.txid === txid && vin_obj.vin.vout === index,
          )
      : null;

    return result;
  };
  const walletForVout = (vout) => {
    const address = vout.scriptPubKey.address;
    const scriptHash = toScriptHash(address);
    const entry = network.scriptHashes[scriptHash];

    return entry ? entry.info.wallet.name : null;
  };

  const walletForVin = (vin) => {
    const tx = network.transactions[vin.txid];
    if (!tx) {
      return null;
    }

    return walletForVout(tx.vout[vin.vout]);
  };

  const createWalletHistory = (wallet, transactions) => {
    const walletTransactions = transactions.filter(
      (t) =>
        t.vin.some((vin) => vin.wallet === wallet) ||
        t.vout.some((vout) => vout.wallet === wallet),
    );

    const calcUtxos = (prev, current) => {
      if (prev.length === 0) return [];

      const utxos = prev[prev.length - 1].utxos;

      return utxos;
    };

    const history = walletTransactions
      .sort((a, b) => a.blockheight < b.blockheight)
      .reduce(
        (prev, current) => [
          ...prev,
          { ...current, utxos: calcUtxos(prev, current) },
        ],
        [],
      );

    return history;
  };

  const transactions = Object.values(network.transactions).map((t) => ({
    txid: t.txid,
    blockheight: t.time,
    vin: t.vin.map((vin) => ({ ...vin, wallet: walletForVin(vin) })),
    vout: t.vout.map((vout, index) => ({
      ...vout,
      spendVin: getSpendVin(t.txid, index, vout),
      wallet: walletForVout(vout),
    })),
  }));
  console.log(JSON.stringify(transactions, null, 2));

  const walletHistory = createWalletHistory("w1", Object.values(transactions));
  const result = { wallet: "w1", history: walletHistory };
  console.log(JSON.stringify(result, null, 2));

  return result;
};
