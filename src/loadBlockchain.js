import { getAddress, getAddressForMultisig, toScriptHash } from './utils/bitcoin';
import range from './utils/helpers';
import { getHistories, getTransactions, getUTXOs } from '../test/mocks/api.mock';
import { setBlockchain } from './model/blockchain.reducer';

export const generateModel = async (store, connection, wallets) => {
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

  const addresses = wallets.flatMap((w) => createAddresses(w));
  const scriptHashes = await toHistories(addresses);

  const txHashes = scriptHashes.flatMap((h) => h.transactions).map((h) => h.tx_hash);

  const transactions = await getTxs(txHashes);

  const utxos = await getUTXOs(connection, scriptHashes.map((h) => h.scriptHash));

  store.dispatch(setBlockchain({
    transactions,
    scriptHashes,
    utxos,
  }));
};
