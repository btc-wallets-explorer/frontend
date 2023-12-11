import * as d3 from "d3";
import { addSelection, removeSelection } from "../../../model/ui.reducer";
import { createNetwork } from "../network-generation";
import { toOverviewModel } from "../history-generation";
import _ from "lodash";

const Y_OFFSET = 100;

const generateNodes = (model) => {
  const walletNodes = model.flatMap((obj, index) =>
    obj.walletHistory.map((history) => ({
      id: `${obj.wallet}:${history.txid}`,
      name: history.txid,
      x: history.blockheight,
      y: index * 100 + Y_OFFSET,
      wallet: obj.wallet,
      value: history.utxos.reduce((prev, utxo) => prev + utxo.value, 0),
    })),
  );

  const otherNodes = [
    {
      id: "other",
      name: "other",
      x: 0,
      y: 0,
      wallet: "other",
      value: 1,
    },
  ];

  return [...otherNodes, ...walletNodes];
};

const generateLinks = (nodes, model) => {
  return model.flatMap((obj) => {
    const stateLinks = obj.walletHistory.slice(1).flatMap((history, index) => {
      const source = nodes.find(
        (node) => node.id === `${obj.wallet}:${obj.walletHistory[index].txid}`,
      );
      const target = nodes.find(
        (node) => node.id === `${obj.wallet}:${history.txid}`,
      );

      return {
        source,
        target,
      };
    });
    return [...stateLinks];
  });
};

export const d3OverviewGraph = (root, store, blockchain, settings, wallets) => {
  const valueScalar = 100;
  const rectWidth = 10;

  const query = (q) => root.shadowRoot.querySelector(q);

  const model = toOverviewModel(blockchain, wallets);
  console.log(model);

  const nodes = generateNodes(model);
  console.log(nodes);
  const links = generateLinks(nodes, model);
  console.log(links);

  const colorNodes = d3.scaleOrdinal(d3.schemeCategory10);
  const colorLinks = d3.scaleOrdinal(d3.schemeCategory10);

  // Specify the dimensions of the chart.
  const width = 928;
  const height = 600;
  const format = d3.format(",.0f");

  // Create a SVG container.
  const svg = d3
    .select(query(".graph"))
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

  const handleZoom = (e) => svg.attr("transform", e.transform);
  const zoomBehavior = d3.zoom().on("zoom", handleZoom);
  d3.select(query("svg")).call(zoomBehavior);
  // Applies it to the data. We make a copy of the nodes and links objects
  // so as to avoid mutating the original.

  // Defines a color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Creates the rects that represent the nodes.
  const rect = svg
    .append("g")
    .attr("stroke", "#000")
    .selectAll()
    .data(nodes)
    .join("rect")
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y)
    .attr("height", (d) => d.value * valueScalar)
    .attr("width", (d) => rectWidth)
    .attr("fill", (d) => "white");

  // Adds a title on the nodes.
  rect.append("title").text((d) => `${d.name}\n${d.value}`);

  // Creates the paths that represent the links.
  const link = svg
    .append("g")
    .attr("fill", "red")
    .attr("stroke-opacity", 0.5)
    .selectAll()
    .data(links)
    .join("line")
    .attr("x1", (d) => d.source.x + rectWidth)
    .attr("y1", (d) => d.source.y + (d.source.value * valueScalar) / 2)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y + (d.source.value * valueScalar) / 2)
    .attr("stroke", (d) => colorLinks(d.source.wallet))
    .attr("stroke-width", (d) => d.source.value * valueScalar);

  // .join("g")
  // .style("mix-blend-mode", "multiply");

  // Creates a gradient, if necessary, for the source-target color option.
  // if (linkColor === "source-target") {
  //   const gradient = link
  //     .append("linearGradient")
  //     .attr("id", (d) => (d.uid = DOM.uid("link")).id)
  //     .attr("gradientUnits", "userSpaceOnUse")
  //     .attr("x1", (d) => d.source.x1)
  //     .attr("x2", (d) => d.target.x0);
  //   gradient
  //     .append("stop")
  //     .attr("offset", "0%")
  //     .attr("stop-color", (d) => color(d.source.category));
  //   gradient
  //     .append("stop")
  //     .attr("offset", "100%")
  //     .attr("stop-color", (d) => color(d.target.category));
  // }

  // link
  //   .append("path")
  //   .attr("stroke", (d) => color(d.target.category))
  //   .attr("stroke-width", (d) => Math.max(1, d.value * valueScalar));

  link
    .append("title")
    .attr("fill", "white")
    .text((d) => `${d.source.name} → ${d.target.name}\n${format(d.value)} TWh`);

  // Adds labels on the nodes.
  svg
    .append("g")
    .selectAll()
    .data(nodes)
    .join("text")
    .attr("x", (d) => d.x + rectWidth / 2)
    .attr("y", (d) => d.y - 10)
    .attr("dy", "0.35em")
    .attr("text-anchor", "end")
    .attr("fill", "white")
    .text((d) => d.name);

  console.log(nodes);
  console.log(links);

  return svg.node();
};
