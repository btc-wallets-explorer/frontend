import { toScriptHash } from "../../utils/bitcoin";

export const toOverviewModel = (network, wallets) => {
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

  const valueForVin = (vin) => {
    const tx = network.transactions[vin.txid];
    if (!tx) return null;
    return network.transactions[vin.txid].vout[vin.vout].value;
  };

  const createWalletHistory = (wallet, transactions) => {
    const walletTransactions = transactions
      .filter(
        (t) =>
          t.in.some((vin) => vin.wallet === wallet) ||
          t.out.some((vout) => vout.wallet === wallet),
      )
      .sort((a, b) => a.blockheight - b.blockheight);

    const calcUtxos = (prev, current) => {
      const utxos = prev.length > 0 ? prev[prev.length - 1].utxos : [];

      const updatedUtxos = utxos.filter(
        (utxo) =>
          !current.in.some(
            (vin) => vin.txid === utxo.txid && vin.vout === utxo.vout,
          ),
      );

      const newUtxos = current.out
        .filter((vout) => vout.wallet === wallet)
        .map((vout) => ({
          txid: current.txid,
          value: vout.value,
          vout: current.out.indexOf(vout),
        }));

      return [...updatedUtxos, ...newUtxos];
    };

    const history = walletTransactions.reduce(
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
    in: t.vin.map((vin) => ({
      ...vin,
      value: valueForVin(vin),
      wallet: walletForVin(vin),
    })),
    out: t.vout.map((vout, index) => ({
      ...vout,
      spendVin: getSpendVin(t.txid, index, vout),
      wallet: walletForVout(vout),
    })),
  }));

  const result = wallets
    .map((w) => w.name)
    .map((walletName) => ({
      wallet: walletName,
      walletHistory: createWalletHistory(
        walletName,
        Object.values(transactions),
      ),
    }));

  return result;
};
