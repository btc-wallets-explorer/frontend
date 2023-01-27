import * as d3 from 'd3';

export default async (model, settings) => {
  const margin = {
    top: 10, right: 10, bottom: 10, left: 10,
  };

  const nodeWidth = 20;
  const nodeHeight = 20;

  const width = 1200 - margin.left - margin.right;

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
  const times = model.nodes.map((n) => n.tx.time);
  const timeMin = Math.min(...times);
  const timeMax = Math.max(...times);
  const timeInterval = timeMax - timeMin;

  const simulation = d3.forceSimulation()
    // .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide().radius(15))
    .force('charge', d3.forceManyBody())
    .force('link', d3.forceLink().id((d) => d.id))
    .force('x', d3.forceX((n) => ((n.tx.time - timeMin) / timeInterval) * width).strength(0.1))
    .force('y', d3.forceY(() => 0).strength(0.02));

  const nodes = svg.append('g').selectAll('.node')
    .data(model.nodes)
    .enter()
    .append('g');

  nodes.append('rect')
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
    .style('fill', () => 'gray')
    .on('click', (event, node) => {
      if (event.ctrlKey) {
        window.open(settings['block-explorer-url'] + node.id, '_blank');
      }
    })
    .style('stroke', (d) => d3.rgb(d.color).brighter(2))
    .append('title')
    .text((d) => `${d.name}`);

  const linkGen = d3.linkHorizontal()
    .source((d) => ({ ...d.source, x: d.source.x + nodeWidth, y: d.source.y + nodeHeight / 2 }))
    .target((d) => ({ ...d.target, x: d.target.x, y: d.target.y + nodeHeight / 2 }))
    .x((d) => d.x)
    .y((d) => d.y);

  const link = svg.append('g').selectAll('.link')
    .data(model.links)
    .enter()
    // .append('line')
    .append('path')
    .attr('stroke-width', (d) => d.value * 30)
    .attr('stroke', (d) => color(d.wallet));

  link
    .append('title')
    .text((d) => `${d.wallet}  ${JSON.stringify(d.info, null, 1)}  ${d.value}`);

  simulation.nodes(model.nodes);
  simulation.force('link').links(model.links);

  simulation.on('tick', () => {
    link.attr('d', linkGen);

    d3.selectAll('.node_rect')
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y);
  });
  simulation.alpha(0.3).restart();
};
