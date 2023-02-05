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

const addr = (walletName, number, isChange) => getAddress(
  wallets.find((w) => w.name === walletName).xpub,
  wallets.find((w) => w.name === walletName).type,
  number,
  isChange,
);

const sh = toScriptHash;

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
  addr('w1', 0, 0),
  addr('w1', 1, 0),
  addr('w2', 0, 0),
  addr('w2', 1, 0),
  addr('w2', 2, 0),
  addr('w2', 3, 0),
];

const histories = usedAddresses.map((a) => ({
  scriptHash: sh(a),
  transactions: transactions
    .filter(
      (tx) => tx.vout.some((vout) => vout.scriptPubKey.address === a)
    || tx.vin.some((vin) => {
      const vinTx = transactions.find((t) => t.txid === vin.txid);
      return vinTx && vinTx.vout[vin.vout].scriptPubKey.address === a;
    }),
    )
    .map((tx) => ({ tx_hash: tx.txid })),
}));

const utxos = [
  ...usedAddresses.map((a) => ({ scriptHash: sh(a), utxos: [] })),
  {
    scriptHash: sh(addr('w2', 3, 0)),
    utxos: [
      { tx_hash: 'tx4', value: 10000000 },
    ],
  },
];

export default {
  settings, wallets, histories, transactions, utxos,
};
