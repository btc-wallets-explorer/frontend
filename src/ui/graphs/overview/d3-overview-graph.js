import * as d3 from "d3";
import {
  generateLinks,
  generateNodes,
  toOverviewModel,
} from "./overview-network";

const WIDHT = 4000;
const HEIGHT = 3000;
const VALUE_SCALAR = 100;
const RECT_WIDTH = 2;

const MIN_VALUE = 0.001 * VALUE_SCALAR;

const createGraph = (root, nodes, links) => {
  const query = (q) => root.shadowRoot.querySelector(q);

  const colorLinks = d3.scaleOrdinal(d3.schemeCategory10);

  const blockheights = nodes.map((n) => n.blockheight);
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(blockheights), d3.max(blockheights)])
    .range([0, WIDHT]);

  const timeScale = d3.scaleTime(
    [
      new Date(d3.min(blockheights) * 1000),
      new Date(d3.max(blockheights) * 1000),
    ],
    [0, WIDHT],
  );

  const xAxis = d3.axisBottom(timeScale);

  // Create a SVG container.
  const svg = d3
    .select(query(".graph"))
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("preserveAspectRatio", "xMaxYMin slice")
    .attr("viewBox", [0, 0, WIDHT, HEIGHT]);

  const g = svg.append("g");

  const gX = svg
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + 50 + ")")
    .call(xAxis);

  const zoom = d3
    .zoom()
    .scaleExtent([1, 40])
    .translateExtent([
      [-100, -100],
      [WIDHT + 90, HEIGHT + 100],
    ])
    .on("zoom", zoomed);

  Object.assign(svg.call(zoom).node(), { reset });

  function zoomed({ transform }) {
    g.attr("transform", transform);
    gX.call(xAxis.scale(transform.rescaleX(timeScale)));
  }

  function reset() {
    svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
  }

  // Creates the rects that represent the nodes.
  const rect = g
    .append("g")
    .attr("stroke", "#000")
    .attr("stroke-width", 0)
    .attr("fill", (d) => "white")
    .selectAll()
    .data(nodes)
    .join("rect")
    .attr("x", (d) => xScale(d.x))
    .attr("y", (d) => d.y - 10)
    .attr("height", (d) => d.value * VALUE_SCALAR + 10)
    .attr("width", (d) => RECT_WIDTH);

  // Adds a title on the nodes.
  rect.append("title").text((d) => `${new Date(d.blockheight * 1000)}`);

  // Creates the paths that represent the links.
  const linkIntra = g
    .append("g")
    .selectAll()
    .data(links.filter((l) => l.type === "intra-wallet"))
    .join("line")
    .attr("x1", (d) => xScale(d.source.x) + RECT_WIDTH)
    .attr("y1", (d) => d.source.y + (d.value * VALUE_SCALAR) / 2)
    .attr("x2", (d) => xScale(d.target.x))
    .attr("y2", (d) => d.target.y + (d.value * VALUE_SCALAR) / 2)
    .attr("stroke", (d) =>
      colorLinks(d.type === "intra-wallet" ? d.source.wallet : d.target.wallet),
    )
    .attr("stroke-opacity", 0.7)
    .attr("stroke-width", (d) => Math.max(d.value * VALUE_SCALAR, MIN_VALUE));

  const createPathForInterWalletUTXO = (link) => {
    const yOffset =
      link.source.value * VALUE_SCALAR + (link.value * VALUE_SCALAR) / 2;

    const startX = xScale(link.source.x);
    const startY = link.source.y + yOffset;
    const endX = xScale(link.target.x);
    const endY = link.target.y;
    const halfX = (startX + endX) / 2;
    const halfY = (startY + endY) / 2;

    const controlX = startX + 50;
    const controlY = startY;

    return `M ${startX}, ${startY} Q ${controlX} ${controlY} ${halfX} ${halfY} T ${endX} ${endY}`;
  };

  const linkInter = g
    .append("g")
    .selectAll()
    .data(links.filter((l) => l.type === "inter-wallet"))
    .join("g");

  const gradient = linkInter
    .append("linearGradient")
    .attr("id", (d) => `${d.source.name}${d.target.name}`)
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", (d) => xScale(d.source.x))
    .attr("x2", (d) => xScale(d.target.x))
    .attr("y1", (d) => d.source.y)
    .attr("y2", (d) => d.target.y);
  gradient
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", (d) => colorLinks(d.source.wallet));
  gradient
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", (d) => colorLinks(d.target.wallet));

  linkInter
    .append("path")
    .attr("d", createPathForInterWalletUTXO)
    .attr("stroke", (d) =>
      d.type === "inter-wallet"
        ? `url(#${d.source.name}${d.target.name})`
        : colorLinks(d.source.wallet),
    )
    .attr("stroke-opacity", 0.7)
    .attr("stroke-width", (d) => Math.max(d.value * VALUE_SCALAR, MIN_VALUE))
    .attr("fill", "transparent");

  linkIntra
    .append("title")
    .attr("fill", "white")
    .text((d) => `${d.source.wallet} → ${d.target.wallet} - ${d.value}`);

  // Adds labels on the nodes.
  //  view
  //   .append("g")
  //   .selectAll()
  //   .data(nodes)
  //   .join("text")
  //   .attr("x", (d) => d.x + RECT_WIDTH / 2)
  //   .attr("y", (d) => d.y - 10)
  //   .attr("dy", "0.35em")
  //   .attr("text-anchor", "end")
  //   .attr("fill", "white")
  //   .text((d) => d.name.slice(0, 4));
};

export const d3OverviewGraph = (root, store, blockchain, settings, wallets) => {
  const model = toOverviewModel(blockchain, wallets);
  const scalars = store.getState().ui.scalars;
  const nodes = generateNodes(model, scalars);
  const links = generateLinks(nodes, model);

  console.log(nodes, links);

  createGraph(root, nodes, links, scalars);
};
