import {
  select, zoom, linkRadial, rgb,
} from 'd3';

const margin = {
  top: 10, right: 10, bottom: 10, left: 10,
};
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

const handleZoom = (e) => g.attr('transform', e.transform);
const zoomBehavior = zoom().on('zoom', handleZoom);
select('svg').call(zoomBehavior);

// load the data
const generate = (graph, settings) => {
  const nodeMap = {};

  const times = graph.nodes.map((n) => n.tx.time);
  const timeMin = Math.min(...times);
  const timeMax = Math.max(...times);
  const timeInterval = timeMax - timeMin;
  console.log(timeMin, timeMax, timeInterval);

  graph.nodes = graph.nodes.map((x) => ({
    ...x,
    x: (x.tx.time - timeMin) / timeInterval * width,
    y: x.tx.confirmations % height,
  }));
  graph.nodes.forEach((x) => { nodeMap[x.name] = x; });
  graph.links = graph.links.map((x) => ({
    source: nodeMap[x.source],
    target: nodeMap[x.target],
    value: x.value,
    wallet: x.wallet,
  }));

  // add in the nodes
  const node = svg.append('g').selectAll('.node')
    .data(graph.nodes)
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', (d) => `translate(${d.x},${d.y})`);

  // add the rectangles for the nodes
  node.append('rect')
    .attr('height', 10)
    .attr('width', 20)
    .style('fill', (d) => 'gray')
    .on('click', (d) => {
      // eslint-disable-next-line no-restricted-globals
      if (event.ctrlKey) {
        window.open(settings['block-explorer-url'] + d.name, '_blank');
      }
    })
    .style('stroke', (d) => rgb(d.color).darker(2))
    .append('title')
    .text((d) => `${d.id}\n${d.value}`);

  const link = linkRadial();

  const links = svg.append('g').selectAll('.link')
    .data(graph.links)
    .join('path')
    .attr('', link);

  // .enter().append('svg:line')
  // .attr("class", "link")
  // .attr("style", "stroke:black")
  // .attr("x1", d => d.source.x)
  // .attr("y1", d => d.source.y)
  // .attr("x2", d => d.target.x)
  // .attr("y2", d => d.target.y)
};

const ws = new WebSocket('ws://localhost:8080');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  generate(data.model, data.settings);
};

ws.onopen = () => {
  ws.send('test');
};
