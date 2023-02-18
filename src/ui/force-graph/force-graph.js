import * as d3 from 'd3';
import watch from 'redux-watch';
import { createNetwork } from './network-generation';

const nodeWidth = 10;
const nodeHeight = 20;

export const d3ForceGraph = (store, blockchain, settings) => {
  const observe = (path, callback) => store.subscribe(watch(store.getState, path)(callback));

  const network = createNetwork(blockchain);
  console.log(network);

  const margin = {
    top: 10, right: 10, bottom: 10, left: 10,
  };

  const width = 1200 - margin.left - margin.right;

  // append the svg canvas to the page
  const svg = d3.select('#graph').append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .append('g')
    .attr(
      'transform',
      `translate(${margin.left},${margin.top})`,
    );

  const handleZoom = (e) => svg.attr('transform', e.transform);
  const zoomBehavior = d3.zoom().on('zoom', handleZoom);
  d3.select('svg').call(zoomBehavior);

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
      .on('click', (event, node) => {
        if (event.ctrlKey) {
          window.open(settings['block-explorer-url'] + node.id.slice(4), '_blank');
        }
      })
      .style('stroke', (d) => d3.rgb(d.color).brighter(2))
      .append('title')
      .text((d) => `${d.name}`);
  };

  const drawTransactionDetails = (items) => {
    items
      .append((node) => {
        const ns = 'http://www.w3.org/2000/svg';
        const group = document.createElementNS(ns, 'g');
        group.setAttribute('classes', 'vin');

        const calcVinY = (tx, vin) => (nodeHeight / tx.vin.length)
        * (tx.vin.indexOf(vin) + 0.5);
        const vinLines = node.tx.vin.map((vin) => {
          const line = document.createElementNS(ns, 'line');
          line.setAttribute('class', 'vin');
          line.setAttribute('x1', 0);
          line.setAttribute('y1', calcVinY(node.tx, vin));
          line.setAttribute('x2', -5);
          line.setAttribute('y2', calcVinY(node.tx, vin));
          return line;
        });

        const calcVoutY = (tx, vout) => (nodeHeight / tx.vout.length)
        * (tx.vout.indexOf(vout) + 0.5);
        const voutLines = node.tx.vout.map((vout) => {
          const line = document.createElementNS(ns, 'line');
          line.setAttribute('class', 'vout');
          line.setAttribute('x1', nodeWidth);
          line.setAttribute('y1', calcVoutY(node.tx, vout));
          line.setAttribute('x2', nodeWidth + 5);
          line.setAttribute('y2', calcVoutY(node.tx, vout));
          return line;
        });

        vinLines.forEach((l) => group.appendChild(l));
        voutLines.forEach((l) => group.appendChild(l));

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

    d3.selectAll('.node_block')
      .attr('transform', (d) => `translate(${d.x},${d.y})`);
  });
  simulation.alpha(0.5).restart();
};
