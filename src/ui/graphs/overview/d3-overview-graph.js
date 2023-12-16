import * as d3 from "d3";
import { uniqueId } from "lodash";
import { observe } from "../../../model/store";
import { addSelection, removeSelection } from "../../../model/ui.reducer";
import {
  generateLinks,
  generateNodes,
  toOverviewModel,
} from "./overview-network";

const WIDTH = 1000;
const HEIGHT = 600;
const VALUE_SCALAR = 30;
const RECT_WIDTH = 1;

const MIN_VALUE = 0.001 * VALUE_SCALAR;

const createGraph = (store, root, nodes, links) => {
  const query = (q) => root.shadowRoot.querySelector(q);
  const queryAll = (q) => root.shadowRoot.querySelectorAll(q);

  const colorLinks = d3.scaleOrdinal(d3.schemeCategory10);

  const timeScale = d3
    .scaleTime(
      d3.extent(nodes, (n) => new Date(n.time * 1000)),
      [0, WIDTH],
    )
    .range([0, WIDTH])
    .clamp(true);

  const tX = (time) => timeScale(new Date(time * 1000));

  const xAxis = d3.axisTop(timeScale);

  // Create a SVG container.
  const svg = d3
    .select(query(".graph"))
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("preserveAspectRatio", "xMaxYMin slice")
    .attr("viewBox", [0, 0, WIDTH, HEIGHT]);

  const g = svg.append("g");

  const gX = svg
    .append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + 20 + ")")
    .call(xAxis);

  const zoom = d3
    .zoom()
    .scaleExtent([1, 40])
    .translateExtent([
      [0, 0],
      [WIDTH, HEIGHT],
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
    .attr("stroke", "white")
    .attr("stroke-width", 0)
    .attr("fill", (d) => "white")
    .selectAll()
    .data(nodes)
    .join("rect")
    .attr("class", "node_rect")
    .attr("id", (d) => (d.selectId = "id" + uniqueId()))
    .attr("x", (d) => tX(d.time))
    .attr("y", (d) => d.y - 3)
    .attr("height", (d) => d.value * VALUE_SCALAR + 3)
    .attr("width", (d) => RECT_WIDTH)
    .on("click", (event, d) => {
      if (event.ctrlKey) {
        window.open(
          settings["block-explorer-url"] + node.id.slice(4),
          "_blank",
        );
      } else {
        const txIds = store
          .getState()
          .ui.selections.filter((s) => s.type === "transaction")
          .map((s) => s.id);

        const selection = { type: "transaction", id: d.name };
        if (txIds.includes(d.name)) {
          store.dispatch(removeSelection(selection));
        } else {
          store.dispatch(addSelection(selection));
        }
      }
    });

  // Adds a title on the nodes.
  rect.append("title").text((d) => `${new Date(d.time * 1000)}`);

  // Creates the paths that represent the links.
  const linkIntra = g
    .append("g")
    .selectAll()
    .data(links.filter((l) => l.type === "intra-wallet"))
    .join("line")
    .attr("x1", (d) => tX(d.source.time) + RECT_WIDTH)
    .attr("y1", (d) => d.source.y + (d.value * VALUE_SCALAR) / 2)
    .attr("x2", (d) => tX(d.target.time))
    .attr("y2", (d) => d.target.y + (d.value * VALUE_SCALAR) / 2)
    .attr("stroke", (d) =>
      colorLinks(d.type === "intra-wallet" ? d.source.wallet : d.target.wallet),
    )
    .attr("stroke-opacity", 0.7)
    .attr("stroke-width", (d) => Math.max(d.value * VALUE_SCALAR, MIN_VALUE));

  const createPathForInterWalletUTXO = (link) => {
    const startYOffset =
      VALUE_SCALAR * (link.source.value + link.sourceOffset - link.value / 2);

    const endYOffset = VALUE_SCALAR * (link.target.value - link.value / 2);

    const startX = tX(link.source.time);
    const startY = link.source.y + startYOffset;
    const endX = tX(link.target.time);
    const endY = link.target.y + endYOffset;
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
    .attr("x1", (d) => tX(d.source.time))
    .attr("x2", (d) => tX(d.target.time))
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

  g.append("line")
    .attr("class", "timeline_line")
    .attr("x1", -100)
    .attr("x2", -100)
    .attr("y1", 20)
    .attr("y2", HEIGHT + 100);
  g.append("text")
    .attr("class", "timeline_date")
    .attr("x", 100)
    .attr("y", 35)
    .text("");

  const highlighted = [];
  g.on("mousemove", (event) => {
    const mouse = d3.pointer(event);
    const x = mouse[0];
    const y = mouse[1];
    const node = nodes.reduce(
      (prev, current) =>
        Math.abs(tX(current.time) - x) < Math.abs(tX(prev.time) - x)
          ? current
          : prev,
      nodes[0],
    );

    const element = g.select(`#${node.selectId}`);
    highlighted.forEach((e) => e.classed("highlighted", false));
    element.classed("highlighted", true);
    highlighted.pop();
    highlighted.push(element);
    g.select(".timeline_line")
      .attr("x1", tX(node.time))
      .attr("x2", tX(node.time));
    g.select(".timeline_date")
      .text(new Date(node.time * 1000).toLocaleDateString())
      .attr("x", tX(node.time));

    event.preventDefault();
  });

  observe(store, "ui.selections", (data) => {
    const txIds = data.filter((s) => s.type === "transaction").map((s) => s.id);

    d3.selectAll(queryAll(".node_rect")).attr(
      "class",
      (d) => `node_rect ${txIds.includes(d.name) ? "selected" : ""}`,
    );
  });
};

export const d3OverviewGraph = (root, store, blockchain, settings, wallets) => {
  const model = toOverviewModel(blockchain, wallets);
  const scalars = store.getState().ui.scalars;
  const nodes = generateNodes(model, scalars);
  const links = generateLinks(nodes, model);

  console.log(nodes, links);

  createGraph(store, root, nodes, links, scalars);
};
