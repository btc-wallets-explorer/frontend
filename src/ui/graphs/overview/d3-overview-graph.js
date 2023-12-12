import * as d3 from "d3";
import { toOverviewModel } from "../history-generation";
import _ from "lodash";

const Y_OFFSET = 100;
const X_OFFSET = 50;
const VALUE_SCALAR = 50;
const RECT_WIDTH = 2;
const WIDTH = 2000;
const HEIGHT = 1000;

const MIN_VALUE = 0.0001 * VALUE_SCALAR;

const generateNodes = (model) => {
  const blockheights = model.flatMap((obj) =>
    obj.walletHistory.map((history) => history.blockheight),
  );
  const timeScale = d3
    .scaleLinear()
    .domain([Math.min(...blockheights), Math.max(...blockheights)])
    .range([0, 1800]);

  const walletNodes = model.flatMap((obj, index) =>
    obj.walletHistory.map((history) => ({
      id: `${obj.wallet}:${history.txid}`,
      name: history.txid,
      blockheight: history.blockheight,
      x: timeScale(history.blockheight) + X_OFFSET,
      y: index * 50 + Y_OFFSET,
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

  return [...walletNodes];
};

const generateLinks = (nodes, model) => {
  return model.flatMap((obj) => {
    const stateLinks = obj.walletHistory
      .slice(1)
      .flatMap((history, index) => {
        const source = nodes.find(
          (node) =>
            node.id === `${obj.wallet}:${obj.walletHistory[index].txid}`,
        );
        const target = nodes.find(
          (node) => node.id === `${obj.wallet}:${history.txid}`,
        );

        return {
          source,
          target,
        };
      })
      .filter((l) => l.source.blockheight !== l.target.blockheight);
    return [...stateLinks];
  });
};

const createGraph = (root, nodes, links) => {
  const query = (q) => root.shadowRoot.querySelector(q);

  const colorNodes = d3.scaleOrdinal(d3.schemeCategory10);
  const colorLinks = d3.scaleOrdinal(d3.schemeCategory10);

  // Specify the dimensions of the chart.
  const format = d3.format(",.0f");

  // Create a SVG container.
  const svg = d3
    .select(query(".graph"))
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .attr("viewBox", [0, 0, WIDTH, HEIGHT])
    .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

  const handleZoom = (e) => svg.attr("transform", e.transform);
  const zoomBehavior = d3.zoom().on("zoom", handleZoom);
  d3.select(query("svg")).call(zoomBehavior);

  // Creates the rects that represent the nodes.
  const rect = svg
    .append("g")
    .attr("stroke", "#000")
    .selectAll()
    .data(nodes)
    .join("rect")
    .attr("x", (d) => d.x)
    .attr("y", (d) => d.y)
    .attr("height", (d) => d.value * VALUE_SCALAR)
    .attr("width", (d) => RECT_WIDTH)
    .attr("fill", (d) => "white");

  // Adds a title on the nodes.
  rect.append("title").text((d) => `${d.name.slice(4)}\n${d.value}`);

  // Creates the paths that represent the links.
  const link = svg
    .append("g")
    .selectAll()
    .data(links)
    .join("line")
    .attr("x1", (d) => d.source.x + RECT_WIDTH)
    .attr("y1", (d) => d.source.y + (d.source.value * VALUE_SCALAR) / 2)
    .attr("x2", (d) => d.target.x)
    .attr("y2", (d) => d.target.y + (d.source.value * VALUE_SCALAR) / 2)
    .attr("stroke", (d) => colorLinks(d.source.wallet))
    .attr("stroke-opacity", 0.5)
    .attr("stroke-width", (d) =>
      Math.max(d.source.value * VALUE_SCALAR, MIN_VALUE),
    );

  link
    .append("title")
    .attr("fill", "white")
    .text((d) => `${d.source.name.slice(0, 4)} → ${d.target.name.slice(0, 4)}`);

  // Adds labels on the nodes.
  // svg
  //   .append("g")
  //   .selectAll()
  //   .data(nodes)
  //   .join("text")
  //   .attr("x", (d) => d.x + rectWidth / 2)
  //   .attr("y", (d) => d.y - 10)
  //   .attr("dy", "0.35em")
  //   .attr("text-anchor", "end")
  //   .attr("fill", "white")
  //   .text((d) => d.name.slice(4));

  console.log(nodes);
  console.log(links);

  return svg.node();
};

export const d3OverviewGraph = (root, store, blockchain, settings, wallets) => {
  const model = toOverviewModel(blockchain, wallets);
  console.log(model);

  const scalars = store.getState().ui.scalars;

  const nodes = generateNodes(model, scalars);
  console.log(nodes);
  const links = generateLinks(nodes, model);
  console.log(links);

  createGraph(root, nodes, links, scalars);
};
