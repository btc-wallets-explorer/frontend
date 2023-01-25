import * as d3 from 'd3';

const margin = {
  top: 10, right: 10, bottom: 10, left: 10,
};

const nodeWidth = 20;

const width = 1200 - margin.left - margin.right;
const height = 740 - margin.top - margin.bottom;

// append the svg canvas to the page
const svg = d3.select('#chart').append('svg')
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

const color = d3.scaleOrdinal(d3.schemeCategory10);

// load the data
const generate = (model, settings) => {
  console.log(model);

  const times = model.nodes.map((n) => n.tx.time);
  const timeMin = Math.min(...times);
  const timeMax = Math.max(...times);
  const timeInterval = timeMax - timeMin;

  const simulation = d3.forceSimulation()
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('charge', d3.forceManyBody())
    .force('link', d3.forceLink().id((d) => d.id));
  simulation.stop();

  const nodes = svg.append('g').selectAll('.node')
    .data(model.nodes)
    .enter()
    .append('g');
    // .attr('transform', (d) => `translate(${d.x},${d.y})`);

  // add the rectangles for the nodes
  nodes.append('rect')
    .attr('class', 'node_rect')
    .attr('height', 10)
    .attr('width', nodeWidth)
    .style('fill', () => 'gray')
    .on('click', (event, node) => {
      if (event.ctrlKey) {
        window.open(settings['block-explorer-url'] + node.name, '_blank');
      }
    })
    .style('stroke', (d) => d3.rgb(d.color).darker(2))
    .append('title')
    .text((d) => `${d.name}`);

  svg.append('g').selectAll('.link')
    .data(model.links)
    .enter()
    .append('line')
    .attr('class', 'link_line')
    .attr('stroke-width', (d) => d.value * 20)
    .attr('stroke', (d) => color(d.wallet))
    .append('title')
    .text((d) => `${d.wallet}  ${JSON.stringify(d.info, null, 1)}  ${d.value}`);

  simulation.nodes(model.nodes);
  simulation.force('link').links(model.links);

  simulation.on('tick', () => {
  // position links
    d3.selectAll('.link_line')
      .attr('x1', (d) => d.source.x)
      .attr('x2', (d) => d.target.x)
      .attr('y1', (d) => d.source.y)
      .attr('y2', (d) => d.target.y);

    // position nodes
    d3.selectAll('.node_rect')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y);
  });
  simulation.alpha(1).restart();
};

const ws = new WebSocket('ws://localhost:8080');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);

  generate(data.model, data.settings);
};

ws.onopen = () => {
  ws.send('test');
};
