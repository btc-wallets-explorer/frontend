import { getAddress, toScriptHash } from '../../src/utils/bitcoin';

const settings = {
  'block-explorer-url': 'https://mempool.some.domain:8080/tx/',
};

const wallets = [
  {
    name: 'w1',
    type: 'p2sh-p2wpkh',
    xpub: 'xpub6ECbUJnkUL9S9MBSpgRAt6rkhyag7Yc8YMqW9GS3ALwNRNkLp5j6iWXs5qEZaFGr77LVhuMDG3pvcCRcVCf5c2QDY6HkAMqczueZq3HYokT',
  },
  {
    name: 'w2',
    type: 'p2sh-p2wpkh',
    xpub: 'xpub6DNfpAxd32MAsg4baYWhjism4628cHsA4tZhehg8VV6GYiWWfkzrYLtd7eQfviCEeAvCqEqeP3ukP8TDXyheJqwRJ92UAPtwQQvyYiNhVkv',
  },
];

const addr = (walletName, index, isChange) => getAddress(
  wallets.find((w) => w.name === walletName).xpub,
  wallets.find((w) => w.name === walletName).type,
  index,
  isChange,
);

const sh = toScriptHash;

const shObj = (walletName, index, isChange) => {
  const address = addr(walletName, index, isChange);
  const wallet = wallets.find((w) => w.name === walletName);

  return {
    address,
    scriptHash: sh(address),
    isChange,
    index,
    wallet: {
      name: wallet.name,
      type: wallet.type,
    },
  };
};

const transactions = [
  {
    txid: 'tx1',
    vin: [
      { txid: 'xx1', vout: 0 },
      { txid: 'xx2', vout: 1 },
      { txid: 'xx3', vout: 2 },
    ],
    vout: [
      { value: 0.1, scriptPubKey: { address: addr('w1', 0, 0) } },
      { value: 0.1, scriptPubKey: { address: addr('w1', 1, 0) } },
      { value: 0.1, scriptPubKey: { address: addr('w2', 0, 0) } },
    ],
    time: 50,
  },
  {
    txid: 'tx2',
    vin: [
      { txid: 'xxx1', vout: 0 },
      { txid: 'tx1', vout: 0 },
    ],

    vout: [
      { value: 0.1, scriptPubKey: { address: addr('w2', 1, 0) } },
      { value: 0.1, scriptPubKey: { address: 'out1' } },
    ],
    time: 300,
  },
  {
    txid: 'tx3',
    vin: [
      { txid: 'tx1', vout: 1 },
      { txid: 'tx1', vout: 2 },
    ],

    vout: [
      { value: 0.1, scriptPubKey: { address: addr('w2', 2, 0) } },
    ],
    time: 350,
  },
  {
    txid: 'tx4',
    vin: [
      { txid: 'tx2', vout: 0 },
      { txid: 'tx3', vout: 0 },
    ],

    vout: [
      { value: 0.1, scriptPubKey: { address: addr('w2', 3, 0) } },
      { value: 0.1, scriptPubKey: { address: 'out2' } },
    ],
    time: 430,
  },

];

const usedAddresses = [
  shObj('w1', 0, 0),
  shObj('w1', 1, 0),
  shObj('w2', 0, 0),
  shObj('w2', 1, 0),
  shObj('w2', 2, 0),
  shObj('w2', 3, 0),
];

const scriptHashes = usedAddresses.map((obj) => ({
  scriptHash: sh(obj.address),
  transactions: transactions
    .filter(
      (tx) => tx.vout.some((vout) => vout.scriptPubKey.address === obj.address)
    || tx.vin.some((vin) => {
      const vinTx = transactions.find((t) => t.txid === vin.txid);
      return vinTx && vinTx.vout[vin.vout].scriptPubKey.address === obj.address;
    }),
    )
    .map((tx) => ({ tx_hash: tx.txid })),
  info: obj,
}));

const utxos = [
  {
    scriptHash: sh(addr('w2', 3, 0)),
    utxos: [
      { tx_hash: 'tx4', value: 10000000, tx_pos: 0 },
    ],
  },
];

const toMap = (list, selector) => Object.fromEntries(list.map((o) => [selector(o), o]));
const blockchain = {
  transactions: toMap(transactions, (t) => t.txid),
  scriptHashes: toMap(scriptHashes, (h) => h.scriptHash),
  utxos: toMap(utxos, (u) => u.scriptHash),
};

export default {
  settings, wallets, blockchain,
};
