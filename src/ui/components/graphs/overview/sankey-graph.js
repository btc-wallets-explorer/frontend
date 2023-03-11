import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';
import watch from 'redux-watch';
import { addSelection, removeSelection } from '../../../../model/ui.reducer';
import { createNetwork } from '../network-generation';

const nodeWidth = 10;
const nodeHeight = 20;

export const sankeyGraph = (root, store, blockchain, settings) => {
  const query = (q) => root.shadowRoot.querySelector(q);
  const queryAll = (q) => root.shadowRoot.querySelectorAll(q);
  const observe = (path, callback) => store.subscribe(watch(store.getState, path)(callback));

  const network = createNetwork(blockchain);
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
