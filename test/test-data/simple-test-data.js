import { getAddress, toScriptHash } from '../../src/utils/bitcoin';

const settings = {
  'block-explorer-url': 'https://mempool.some.domain:8080/tx/',
};

const wallets = [
  {
    name: 'wallet1',
    type: 'p2sh-p2wpkh',
    xpub: 'xpub6ECbUJnkUL9S9MBSpgRAt6rkhyag7Yc8YMqW9GS3ALwNRNkLp5j6iWXs5qEZaFGr77LVhuMDG3pvcCRcVCf5c2QDY6HkAMqczueZq3HYokT',
  },
];

const addr = (walletName, number, isChange) => getAddress(
  wallets.find((w) => w.name === walletName).xpub,
  wallets.find((w) => w.name === walletName).type,
  number,
  isChange,
);

const sh = toScriptHash;

const someVout = () => ({
  value: 1,
  scriptPubKey: { address: 'externalAddress' },
});

const vout = (value, walletName, number, isChange) => ({
  value,
  scriptPubKey: { address: addr(walletName, number, isChange) },
});

const transactions = [
  {
    txid: 'tx1',
    vin: [
      { txid: 'xxx', vout: 0 },
    ],
    vout: [
      someVout(),
    ],
    time: 1,
  },
  {
    txid: 'tx2',
    vin: [
      { txid: 'tx1', vout: 0 },
    ],
    vout: [
      vout(0.1, 'wallet1', 0, 0),
    ],
    time: 50,
  },
  {
    txid: 'tx3',
    vin: [
      { txid: 'tx2', vout: 0 },
    ],
    vout: [
      vout(0.1, 'wallet1', 1, 0),
    ],
    time: 300,
  },

];

const histories = [
  {
    scriptHash: sh(addr('wallet1', 0, 0)),
    transactions: [
      { tx_hash: 'tx2' },
      { tx_hash: 'tx3' },
    ],
  },
  {
    scriptHash: sh(addr('wallet1', 1, 0)),
    transactions: [
      { tx_hash: 'tx3' },
    ],
  },
];

const utxos = [
  {
    scriptHash: sh(addr('wallet1', 1, 0)),
    utxos: [
      { tx_hash: 'tx3', value: 10000000 },
    ],
  },
];

export default {
  settings, wallets, histories, transactions, utxos,
};
