import * as d3 from 'd3';
import watch from 'redux-watch';
import { addSelection, removeSelection } from '../../../../model/ui.reducer';
import { createNetwork } from '../network-generation';

const nodeWidth = 10;
const nodeHeight = 20;

export const d3ForceGraph = (root, store, blockchain, settings) => {
  const query = (q) => root.shadowRoot.querySelector(q);
  const queryAll = (q) => root.shadowRoot.querySelectorAll(q);
  const observe = (path, callback) => store.subscribe(watch(store.getState, path)(callback));

  const network = createNetwork(blockchain);
  console.log(network);

  const margin = {
    top: 10, right: 10, bottom: 10, left: 10,
  };

  const width = 1200 - margin.left - margin.right;

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

  const colorNodes = d3.scaleOrdinal(d3.schemeCategory10);
  const colorLinks = d3.scaleOrdinal(d3.schemeCategory10);

  // load the data
  const times = network.nodes
    .filter((n) => n.type === 'txo')
    .filter((n) => 'time' in n.tx)
    .map((n) => n.tx.time);
  const timeMin = Math.min(...times);
  const timeMax = Math.max(...times);
  const timeInterval = timeMax - timeMin;

  const calcForceX = (node) => {
    switch (node.type) {
      case 'txo': {
        if (!node.tx.time) {
          // mempool transaction
          return width;
        }
        return ((node.tx.time - timeMin) / timeInterval) * width;
      }
      case 'utxo':
        return width;
      default:
        console.error('node type not recognized for', node);

        return 0;
    }
  };

  const forces = {
    link: d3.forceLink().id((d) => d.id),
    charge: d3.forceCollide().radius(15),
    collide: d3.forceManyBody(),
    x: d3.forceX(calcForceX),
    y: d3.forceY(() => 0),
  };

  const simulation = d3.forceSimulation()
    // .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', forces.collide)
    .force('charge', forces.charge)
    .force('link', forces.link)
    .force('x', forces.x)
    .force('y', forces.y);

  ['collide', 'charge', 'link', 'x', 'y'].forEach((force) => observe(`ui.forceStrength.${force}`, (data) => {
    forces[force].strength(data);
    simulation.restart().alpha(1);
  }));

  const nodes = svg.append('g').selectAll('.node')
    .data(network.nodes)
    .enter()
    .append('g');

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

  const drawBlock = (items) => {
    items.attr('class', 'node_block');

    items.append('rect')
      .call(d3.drag().on('drag', (event, d) => {
      // eslint-disable-next-line no-param-reassign
        d.x = event.x;
        // eslint-disable-next-line no-param-reassign
        d.y = event.y;
        simulation.restart().alpha(1);
      }))
      .attr('class', 'node_rect')
      .attr('height', nodeHeight)
      .attr('width', nodeWidth)
      .style('fill', (d) => colorNodes(d.type))
      .on('click', handleNodeClick)
      .style('stroke', (d) => d3.rgb(d.color).brighter(2))
      .append('title')
      .text((d) => `${d.name}`);
  };

  const drawTransactionDetails = (items) => {
    const WIDTH = 5;
    items
      .append((node) => {
        const ns = 'http://www.w3.org/2000/svg';
        const group = document.createElementNS(ns, 'g');

        const createLine = (styleClass, x1, y1, x2, y2) => {
          const line = document.createElementNS(ns, 'line');
          line.setAttribute('class', styleClass);
          line.setAttribute('x1', x1);
          line.setAttribute('y1', y1);
          line.setAttribute('x2', x2);
          line.setAttribute('y2', y2);
          return line;
        };

        if (node.tx.vin.length < 11) {
          const calcVinY = (tx, vin) => (nodeHeight / tx.vin.length)
           * (tx.vin.indexOf(vin) + 0.5);

          node.tx.vin
            .map((vin) => createLine('vin', 0, calcVinY(node.tx, vin), -WIDTH, calcVinY(node.tx, vin)))
            .forEach((l) => group.appendChild(l));
        } else {
          group.appendChild(createLine('vin many', -WIDTH, nodeHeight / 2, 0, nodeHeight / 2));
        }

        if (node.tx.vout.length < 11) {
          const calcVoutY = (tx, vout) => (nodeHeight / tx.vout.length)
           * (tx.vout.indexOf(vout) + 0.5);

          node.tx.vout
            .map((vout) => createLine('vout', nodeWidth, calcVoutY(node.tx, vout), nodeWidth + WIDTH, calcVoutY(node.tx, vout)))
            .forEach((l) => group.appendChild(l));
        } else {
          group.appendChild(createLine('vout many', nodeWidth, nodeHeight / 2, nodeWidth + WIDTH, nodeHeight / 2));
        }

        return group;
      });
  };

  drawBlock(nodes);
  drawTransactionDetails(nodes);

  const link = svg.append('g').selectAll('.link')
    .data(network.links)
    .enter()
    .append('path')
    .attr('stroke-width', (d) => (d.type === 'txo' ? d.value * 30 : (d.value * 30) / 100000000))
    .attr('stroke', (d) => colorLinks(d.info.wallet.name));

  link
    .append('title')
    .text((d) => `${d.info.wallet}  ${JSON.stringify(d.info, null, 1)}  ${d.value}`);

  simulation.nodes(network.nodes);
  simulation.force('link').links(network.links);

  const calcVoutYOffset = (d) => (d.source.type === 'txo'
    ? (nodeHeight / d.source.tx.vout.length) * (d.source.tx.vout.indexOf(d.vout) + 0.5)
    : nodeHeight / 2);

  const calcVinYOffset = (d) => (d.target.type === 'txo'
    ? (nodeHeight / d.target.tx.vin.length) * (d.target.tx.vin.indexOf(d.vin) + 0.5)
    : nodeHeight / 2);

  const linkGen = d3.linkHorizontal()
    .source((d) => ({
      ...d.source,
      x: d.source.x + nodeWidth,
      y: d.source.y + calcVoutYOffset(d),
    }))
    .target((d) => ({
      ...d.target,
      x: d.target.x,
      y: d.target.y + calcVinYOffset(d),
    }))
    .x((d) => d.x)
    .y((d) => d.y);

  simulation.on('tick', () => {
    link.attr('d', linkGen);

    d3.selectAll(queryAll('.node_block'))
      .attr('transform', (d) => `translate(${d.x},${d.y})`);
  });

  observe('ui.selections', (data) => {
    const txIds = data
      .filter((s) => s.type === 'transaction')
      .map((s) => s.id);

    d3
      .selectAll(queryAll('.node_rect'))
      .attr('class', (n) => `node_rect ${txIds.includes(n.tx.txid) ? 'selected' : ''}`);
  });

  simulation.alpha(0.5).restart();
};
