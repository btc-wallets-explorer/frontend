import {
  linkHorizontal, rgb, scaleOrdinal, schemeCategory10, select, zoom,
} from 'd3';

const margin = {
  top: 10, right: 10, bottom: 10, left: 10,
};

const nodeWidth = 20;

const width = 1200 - margin.left - margin.right;
const height = 740 - margin.top - margin.bottom;

// append the svg canvas to the page
const svg = select('#chart').append('svg')
  .attr('width', '100%')
  .attr('height', '100%')
  .append('g')
  .attr(
    'transform',
    `translate(${margin.left},${margin.top})`,
  );

const handleZoom = (e) => svg.attr('transform', e.transform);
const zoomBehavior = zoom().on('zoom', handleZoom);
select('svg').call(zoomBehavior);

const color = scaleOrdinal(schemeCategory10);

// load the data
const generate = (model, settings) => {
  const nodeMap = {};

  const times = model.nodes.map((n) => n.tx.time);
  const timeMin = Math.min(...times);
  const timeMax = Math.max(...times);
  const timeInterval = timeMax - timeMin;

  const graph = { nodes: {}, links: {} };
  graph.nodes = model.nodes.map((n) => ({
    ...n,
    x: ((n.tx.time - timeMin) / timeInterval) * width,
    y: n.tx.size % height,
  }));
  graph.nodes.forEach((x) => { nodeMap[x.name] = x; });
  graph.links = model.links.map((x) => ({
    source: nodeMap[x.source],
    target: nodeMap[x.target],
    value: x.value,
    wallet: x.wallet,
    info: x.info,
  }));

  // add in the nodes
  const nodes = svg.append('g').selectAll('.node')
    .data(graph.nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', (d) => `translate(${d.x},${d.y})`);

  // add the rectangles for the nodes
  nodes.append('rect')
    .attr('height', 10)
    .attr('width', nodeWidth)
    .style('fill', () => 'gray')
    .on('click', (event, node) => {
      if (event.ctrlKey) {
        window.open(settings['block-explorer-url'] + node.name, '_blank');
      }
    })
    .style('stroke', (d) => rgb(d.color).darker(2))
    .append('title')
    .text((d) => `${d.id}`);

  const link = linkHorizontal()
    .source((d) => ({
      ...d.source,
      x: d.source.x + nodeWidth,
      y: d.source.y + 5,
    }));

  svg.append('g').selectAll('.link')
    .data(graph.links)
    .join('path')
    .attr('d', link
      .x((d) => d.x)
      .y((d) => d.y))
    .attr('fill', 'none')
    .attr('stroke-width', (d) => d.value * 20)
    .attr('stroke', (d) => color(d.wallet))
    .append('title')
    .text((d) => `${d.wallet}  ${JSON.stringify(d.info, null, 1)}  ${d.value}`);
};

const ws = new WebSocket('ws://localhost:8080');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  generate(data.model, data.settings);
};

ws.onopen = () => {
  ws.send('test');
};
