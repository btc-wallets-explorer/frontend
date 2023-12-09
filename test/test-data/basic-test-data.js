import * as BtcOutDesc from "@blockchainofthings/btc-output-descriptor";
import { toScriptHash } from "../../src/utils/bitcoin";

const settings = {
  "block-explorer-url": "https://mempool.some.domain:8080/tx/",
};

const otherDescriptor =
  "wpkh(xpub6EPyu9pwv6tXVxQrkXjJ2ZBN3Q2ox8Kf1YapGw5kNJ9XMVDroGybQ87ZKLAWhqGeTTwFTYnrC9AV4bFFNUP92ysiKFC4fX9fMjsa6Rcq1Hd)";

const wallets = [
  {
    name: "w1",
    outputDescriptors: [
      {
        name: "main",
        descriptor:
          "wpkh(xpub6ECbUJnkUL9S9MBSpgRAt6rkhyag7Yc8YMqW9GS3ALwNRNkLp5j6iWXs5qEZaFGr77LVhuMDG3pvcCRcVCf5c2QDY6HkAMqczueZq3HYokT/0/*)",
      },
    ],
  },
  {
    name: "w2",
    outputDescriptors: [
      {
        name: "main",
        descriptor:
          "wpkh(xpub6DNfpAxd32MAsg4baYWhjism4628cHsA4tZhehg8VV6GYiWWfkzrYLtd7eQfviCEeAvCqEqeP3ukP8TDXyheJqwRJ92UAPtwQQvyYiNhVkv/0/*)",
      },
    ],
  },
];

const addr = (walletName, startIdx, outputDesc = 0) => {
  const wallet = wallets.find((w) => w.name === walletName);
  const expression = BtcOutDesc.parse(
    wallet.outputDescriptors[outputDesc].descriptor,
    "main",
  );
  expression.keyRange = {
    startIdx,
    count: 1,
  };
  return expression.addresses[0];
};

const otherAddr = (startIdx) => {
  const expression = BtcOutDesc.parse(otherDescriptor, "main");
  expression.keyRange = {
    startIdx,
    count: 1,
  };
  return expression.addresses[0];
};

const sh = toScriptHash;

const transactions = [
  {
    txid: "tx1",
    vin: [
      { txid: "xx1", vout: 0 },
      { txid: "xx1", vout: 1 },
      { txid: "xx2", vout: 2 },
    ],
    vout: [
      { value: 0.1, scriptPubKey: { address: addr("w1", 0) } },
      { value: 0.1, scriptPubKey: { address: addr("w1", 1) } },
      { value: 0.1, scriptPubKey: { address: addr("w2", 0) } },
    ],
    time: 50,
  },
  {
    txid: "tx2",
    vin: [
      { txid: "xx3", vout: 0 },
      { txid: "tx1", vout: 0 },
    ],

    vout: [
      { value: 0.1, scriptPubKey: { address: addr("w2", 1) } },
      { value: 0.1, scriptPubKey: { address: otherAddr(0) } },
    ],
    time: 300,
  },
  {
    txid: "tx3",
    vin: [
      { txid: "tx1", vout: 1 },
      { txid: "tx1", vout: 2 },
    ],

    vout: [{ value: 0.1, scriptPubKey: { address: addr("w2", 2) } }],
    time: 350,
  },
  {
    txid: "tx4",
    vin: [
      { txid: "tx2", vout: 0 },
      { txid: "tx3", vout: 0 },
    ],

    vout: [
      { value: 0.1, scriptPubKey: { address: addr("w2", 3) } },
      { value: 0.1, scriptPubKey: { address: otherAddr(1) } },
    ],
    time: 430,
  },
];

const addrObj = (walletName, index) => ({
  address: addr(walletName, index),
  scriptHash: sh(addr(walletName, index)),
  isChange: 1,
  index,
  wallet: wallets.find((w) => w.name === walletName),
});

const usedAddresses = [
  addrObj("w1", 0),
  addrObj("w1", 1),
  addrObj("w2", 0),
  addrObj("w2", 1),
  addrObj("w2", 2),
  addrObj("w2", 3),
];

const scriptHashes = usedAddresses
  .map((obj) => obj.address)
  .map((address) => ({
    scriptHash: sh(address),
    transactions: transactions
      .filter(
        (tx) =>
          tx.vout.some((vout) => vout.scriptPubKey.address === address) ||
          tx.vin.some((vin) => {
            const vinTx = transactions.find((t) => t.txid === vin.txid);
            return (
              vinTx && vinTx.vout[vin.vout].scriptPubKey.address === address
            );
          }),
      )
      .map((tx) => ({ tx_hash: tx.txid })),
  }));

const utxos = [
  {
    scriptHash: sh(addr("w2", 3)),
    utxos: [{ tx_hash: "tx4", value: 10000000, tx_pos: 0 }],
  },
];

const toMap = (list, selector) =>
  Object.fromEntries(list.map((o) => [selector(o), o]));
const blockchain = {
  transactions: toMap(transactions, (t) => t.txid),
  scriptHashes: toMap(scriptHashes, (h) => h.scriptHash),
  utxos: toMap(utxos, (u) => u.scriptHash),
};

export default {
  settings,
  wallets,
  blockchain,
  usedAddresses,
};
