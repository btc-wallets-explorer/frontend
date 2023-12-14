import * as d3 from "d3";
import {
  generateLinks,
  generateNodes,
  toOverviewModel,
} from "./overview-model";

const VALUE_SCALAR = 50;
const RECT_WIDTH = 2;

const MIN_VALUE = 0.001 * VALUE_SCALAR;

const createGraph = (root, nodes, links) => {
  const query = (q) => root.shadowRoot.querySelector(q);

  const margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  };

  const colorLinks = d3.scaleOrdinal(d3.schemeCategory10);

  const timeScale = d3.scaleTime(
    [new Date(2018, 0, 1), new Date(2023, 0, 2)],
    [0, 960],
  );
  // Create a SVG container.
  const svg = d3
    .select(query(".graph"))
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .append("g")
    .call(d3.axisBottom(timeScale));

  svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  const handleZoom = (e) => {
    console.log(e);
    svg.attr("transform", e.transform);
  };
  const zoomBehavior = d3.zoom().on("zoom", handleZoom);
  d3.select(query("svg")).call(zoomBehavior);

  // Creates the rects that represent the nodes.
  const rect = svg
    .append("g")
    .attr("stroke", "#000")
    .attr("stroke-width", 0)
    .attr("fill", (d) => "white")
    .selectAll()
    .data(nodes)
    .join("rect")
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y - 10)
    .attr("height", (d) => d.value * VALUE_SCALAR + 10)
    .attr("width", (d) => RECT_WIDTH);

  // Adds a title on the nodes.
  rect.append("title").text((d) => `${new Date(d.blockheight * 1000)}`);

  // Creates the paths that represent the links.
  const linkIntra = svg
    .append("g")
    .selectAll()
    .data(links.filter((l) => l.type === "intra-wallet"))
    .join("line")
    .attr("x1", (d) => d.source.x + RECT_WIDTH)
    .attr("y1", (d) => d.source.y + (d.value * VALUE_SCALAR) / 2)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y + (d.value * VALUE_SCALAR) / 2)
    .attr("stroke", (d) =>
      colorLinks(d.type === "intra-wallet" ? d.source.wallet : d.target.wallet),
    )
    .attr("stroke-opacity", 0.7)
    .attr("stroke-width", (d) => Math.max(d.value * VALUE_SCALAR, MIN_VALUE));

  const createPathForInterWalletUTXO = (link) => {
    const yOffset =
      link.source.value * VALUE_SCALAR + (link.value * VALUE_SCALAR) / 2;

    const startX = link.source.x;
    const startY = link.source.y + yOffset;
    const endX = link.target.x;
    const endY = link.target.y;
    const halfX = (startX + endX) / 2;
    const halfY = (startY + endY) / 2;

    const controlX = startX + 50;
    const controlY = startY;

    return `M ${startX}, ${startY} Q ${controlX} ${controlY} ${halfX} ${halfY} T ${endX} ${endY}`;
  };

  const linkInter = svg
    .append("g")
    .selectAll()
    .data(links.filter((l) => l.type === "inter-wallet"))
    .join("g");

  const gradient = linkInter
    .append("linearGradient")
    .attr("id", (d) => `${d.source.name}${d.target.name}`)
    .attr("gradientUnits", "userSpaceOnUse")
    .attr("x1", (d) => d.source.x)
    .attr("x2", (d) => d.target.x)
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
  // svg
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

  return svg.node();
};

export const d3OverviewGraph = (root, store, blockchain, settings, wallets) => {
  const model = toOverviewModel(blockchain, wallets);
  const scalars = store.getState().ui.scalars;
  const nodes = generateNodes(model, scalars);
  const links = generateLinks(nodes, model);

  console.log(nodes, links);

  createGraph(root, nodes, links, scalars);
};
