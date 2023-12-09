import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';
import { addSelection, removeSelection } from '../../../model/ui.reducer';
import { createNetwork } from '../network-generation';
import { toScriptHash } from '../../../utils/bitcoin';

export const toOverviewModel = (network) => {
  console.log(JSON.stringify(network, null, 2));
  const walletForAddress = (address) => {
    const scriptHash = toScriptHash(address);
    const entry = network.scriptHashes[scriptHash];

    return entry ? entry.info.wallet.name : null;
  };

  const walletForVin = (vin) => {
    const tx = network.transactions[vin.txid];
    if (!tx) { return null; }

    return walletForAddress(tx.vout[vin.vout].scriptPubKey.address);
  };

  const transactions = Object.values(network.transactions)
    .map((t) => ({
      time: t.time,
      input: t.vout.map((vout, index) => ({ txid: vout.txid, vout: index, wallet: walletForAddress(vout.scriptPubKey.address) })),
      output: t.vin.map((vin) => ({ ...vin, wallet: walletForVin(vin) })),
    }))
    .flatMap((t) => [
      ...t.input.map((i) => ({ time: t.time, ...i })),
      ...t.output.map((o) => ({ time: t.time, ...o }))])
    .sort((a, b) => a.time < b.time);

  console.log(JSON.stringify(transactions, null, 2));

  return transactions;
};

export const d3OverviewGraph = (root, store, blockchain, settings) => {
  const query = (q) => root.shadowRoot.querySelector(q);

  const model = toOverviewModel(blockchain);

  const network = createNetwork(blockchain);

  if (network.nodes.length === 0) { return; }
  console.log(network);

  const margin = {
    top: 10, right: 10, bottom: 10, left: 10,
  };

  const colorNodes = d3.scaleOrdinal(d3.schemeCategory10);
  const colorLinks = d3.scaleOrdinal(d3.schemeCategory10);

  // append the svg canvas to the page
  const svg = d3.select(query('.graph')).append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .append('g')
    .attr(
      'transform',
      `translate(${margin.left},${margin.top})`,
    );

  const handleZoom = (e) => svg.attr('transform', e.transform);
  const zoomBehavior = d3.zoom().on('zoom', handleZoom);
  d3.select(query('svg')).call(zoomBehavior);

  const data = network;
  const sankey = d3Sankey
    .sankey()
    .size([1000, 1000])
    .nodeId((d) => d.id)
    .nodeWidth(20)
    .nodePadding(10)
    .nodeAlign(d3Sankey.sankeyCenter);
  const graph = sankey(data);
  const link = svg
    .append('g')
    .classed('links', true)
    .selectAll('path')
    .data(graph.links)
    .enter()
    .append('path')
    .classed('link', true)
    .attr('d', d3Sankey.sankeyLinkHorizontal())
    .attr('fill', 'none')
    .attr('stroke', (d) => colorLinks(d.info.wallet.name))
    .attr('stroke-width', (d) => d.width)
    .attr('stoke-opacity', 0.5);

  const handleNodeClick = (event, node) => {
    if (event.ctrlKey) {
      window.open(settings['block-explorer-url'] + node.id.slice(4), '_blank');
    } else {
      const txIds = store.getState().ui.selections
        .filter((s) => s.type === 'transaction')
        .map((s) => s.id);

      const selection = { type: 'transaction', id: node.tx.txid };
      if (txIds.includes(node.tx.txid)) {
        store.dispatch(removeSelection(selection));
      } else {
        store.dispatch(addSelection(selection));
      }
    }
  };

  const node = svg
    .append('g')
    .classed('nodes', true)
    .selectAll('rect')
    .data(graph.nodes)
    .enter()
    .append('rect')
    .classed('node', true)
    .attr('x', (d) => d.x0)
    .attr('y', (d) => d.y0)
    .attr('width', (d) => d.x1 - d.x0)
    .attr('height', (d) => d.y1 - d.y0)
    .style('fill', (d) => colorNodes(d.type))
    .attr('opacity', 0.8)
    .on('click', handleNodeClick);

  node
    .append('title')
    .text((d) => `${d.name}`);

  link
    .append('title')
    .text((d) => `${d.info.wallet}  ${JSON.stringify(d.info, null, 1)}  ${d.value}`);
};
