const generateUTXOLinks = (unspentMap, transactionMap, scriptHashesMap) => Object.values(unspentMap)
  .flatMap((u) => u.utxos.map((utxo) => ({
    type: 'utxo',
    source: `txo:${utxo.tx_hash}`,
    target: `utxo:${u.scriptHash}`,
    utxo,
    vout: transactionMap[utxo.tx_hash].vout[utxo.tx_pos],
    value: utxo.value,
    info: scriptHashesMap[u.scriptHash].info,
  })));

const generateUTXONodes = (links) => links
  .filter((l) => l.type === 'utxo')
  .map((l) => ({
    id: l.target,
    name: l.target.slice(0, 4),
    type: 'utxo',
  }));

const generateTXOs = (transactionMap, scriptHashesMap) => {
  const histories = Object.values(scriptHashesMap).flatMap(
    (v) => v.transactions.map((hist) => ({
      txid: hist.tx_hash, ...v,
    })),
  );

  const incomingTxos = histories.flatMap((h) => transactionMap[h.txid].vin
    .filter((vin) => vin.txid in transactionMap)
    .map((vin) => ({ ...h, vin, vout: transactionMap[vin.txid].vout[vin.vout] })))
    .filter((txo) => txo.vout.scriptPubKey.address === txo.info.address);

  return incomingTxos.map((txo) => ({
    type: 'txo',
    ...txo,
    source: `txo:${txo.vin.txid}`,
    target: `txo:${txo.txid}`,
    value: txo.vout.value,
  }));
};

const generateTXONodes = (transactionMap) => Object.values(transactionMap).map((tx) => ({
  type: 'txo',
  name: tx.txid.slice(0, 4),
  id: `txo:${tx.txid}`,
  tx,
}));

export const createNetwork = (chain) => {
  const utxoLinks = generateUTXOLinks(chain.utxos, chain.transactions, chain.scriptHashes);
  const txoLinks = generateTXOs(chain.transactions, chain.scriptHashes);
  const utxoNodes = generateUTXONodes(utxoLinks);
  const txoNodes = generateTXONodes(chain.transactions);

  const links = [...txoLinks, ...utxoLinks];

  const nodes = [...txoNodes, ...utxoNodes];

  return { nodes, links };
};
