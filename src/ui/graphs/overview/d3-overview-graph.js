import * as d3 from "d3";
import { toOverviewModel } from "../history-generation";
import _ from "lodash";

const Y_OFFSET = 100;
const X_OFFSET = 50;
const VALUE_SCALAR = 50;
const RECT_WIDTH = 2;
const WIDTH = 3000;
const HEIGHT = 1000;
const STACKING_SIZE = 100;

const MIN_VALUE = 0.001 * VALUE_SCALAR;

const generateNodes = (model) => {
  const blockheights = model.flatMap((obj) =>
    obj.walletHistory.map((history) => history.blockheight),
  );
  const timeScale = d3
    .scaleLinear()
    .domain([Math.min(...blockheights), Math.max(...blockheights)])
    .range([0, WIDTH - Y_OFFSET * 2]);

  const walletNodes = model.flatMap((obj, index) =>
    obj.walletHistory.map((history) => ({
      id: `${obj.wallet}:${history.txid}`,
      name: history.txid,
      blockheight: history.blockheight,
      x: timeScale(history.blockheight) + X_OFFSET,
      y: index * STACKING_SIZE + Y_OFFSET,
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
    const intraWalletLinks = obj.walletHistory
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
          type: "intra-wallet",
          source,
          target,
          value: source.value,
        };
      })
      .filter((l) => l.source.blockheight !== l.target.blockheight);

    const interWalletLinks = obj.walletHistory.slice(1).flatMap((history) =>
      history.out
        .filter((vout) => vout.wallet && vout.wallet !== obj.wallet)
        .map((vout) => {
          const source = nodes.find(
            (node) => node.id === `${obj.wallet}:${history.txid}`,
          );
          const target = nodes.find(
            (node) => node.id === `${vout.wallet}:${history.txid}`,
          );

          return {
            type: "inter-wallet",
            source,
            target,
            value: vout.value,
          };
        }),
    );

    return [...interWalletLinks, ...intraWalletLinks];
  });
};

const createGraph = (root, nodes, links) => {
  const query = (q) => root.shadowRoot.querySelector(q);

  const margin = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  };

  const colorNodes = d3.scaleOrdinal(d3.schemeCategory10);
  const colorLinks = d3.scaleOrdinal(d3.schemeCategory10);

  // Create a SVG container.
  const svg = d3
    .select(query(".graph"))
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const handleZoom = (e) => svg.attr("transform", e.transform);
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
  console.log(model);

  const scalars = store.getState().ui.scalars;

  const nodes = generateNodes(model, scalars);
  console.log(nodes);
  const links = generateLinks(nodes, model);
  console.log(links);

  createGraph(root, nodes, links, scalars);
};
