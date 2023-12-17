import * as d3 from "d3";
import { transform, uniqueId } from "lodash";
import { observe } from "../../../model/store";
import { addSelection, removeSelection } from "../../../model/ui.reducer";
import {
  generateLinks,
  generateNodes,
  toOverviewModel,
} from "./overview-network";

const WIDTH = 1000;
const HEIGHT = 600;
const RECT_WIDTH = 3;

const createGraph = (store, root, nodes, links, settings) => {
  const query = (q) => root.shadowRoot.querySelector(q);
  const queryAll = (q) => root.shadowRoot.querySelectorAll(q);

  const state = store.getState();
  const uiSettings = {
    transform: { k: 1, x: 0, y: 0 },
    yAxisScale: state.ui.scalars.yAxis,
    valueScalar: 30,
    minValue: 0.001 * 30,
    stackSize: 50,
    highlighted: [],
    selected: [],
  };

  const colorLinks = d3.scaleOrdinal(d3.schemeCategory10);

  const timeScale = d3
    .scaleTime(
      d3.extent(nodes, (n) => new Date(n.time * 1000)),
      [0, WIDTH],
    )
    .range([0, WIDTH])
    .clamp(true);

  const wallets = Array.from(new Set(nodes.map((n) => n.wallet)));

  const tX = (time) => timeScale(new Date(time * 1000));
  const tY = (wallet) =>
    wallets.indexOf(wallet) * uiSettings.stackSize * uiSettings.yAxisScale;

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
    .scaleExtent([1, 100])
    .translateExtent([
      [0, -50],
      [WIDTH, HEIGHT + 50],
    ])
    .on("zoom", zoomed);

  Object.assign(svg.call(zoom).node(), { reset });

  const createNodes = (uiSettings) => {
    const transform = uiSettings.transform;
    const scale = 1.0 / transform.k;

    const rect = g
      .append("g")
      .selectAll()
      .data(nodes)
      .join("rect")
      .attr("class", "node_rect")
      .attr("fill", "white")
      .attr("id", (d) => (d.selectId = `id${uniqueId()}`))
      .attr("stroke", "yellow")
      .attr("stroke-width", (d) =>
        uiSettings.selected.includes(d.name) ? 3 * scale : 0,
      )
      .attr("x", (d) => tX(d.time))
      .attr("y", (d) => tY(d.wallet) - 3)
      .attr("height", (d) => d.value * uiSettings.valueScalar + 3)
      .attr("width", (d) => RECT_WIDTH * scale)
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

    rect.append("title").text((d) => `${new Date(d.time * 1000)}`);
  };

  const createLinks = (uiSettings) => {
    const transform = uiSettings.transform;
    const scale = 1.0 / transform.k;
    const linkIntra = g
      .append("g")
      .selectAll()
      .data(links.filter((l) => l.type === "intra-wallet"))
      .join("line")
      .attr("x1", (d) => tX(d.source.time) + RECT_WIDTH * scale)
      .attr(
        "y1",
        (d) => tY(d.source.wallet) + (d.value * uiSettings.valueScalar) / 2,
      )
      .attr("x2", (d) => tX(d.target.time))
      .attr(
        "y2",
        (d) => tY(d.target.wallet) + (d.value * uiSettings.valueScalar) / 2,
      )
      .attr("stroke", (d) =>
        colorLinks(
          d.type === "intra-wallet" ? d.source.wallet : d.target.wallet,
        ),
      )
      .attr("stroke-opacity", 0.7)
      .attr("stroke-width", (d) =>
        Math.max(d.value * uiSettings.valueScalar, uiSettings.minValue),
      );

    const getSourceOffset = (link) =>
      uiSettings.valueScalar *
      (link.source.value + link.sourceOffset - link.value / 2);
    const getTargetOffset = (link) =>
      uiSettings.valueScalar * (link.target.value - link.value / 2);

    const createPathForInterWalletUTXO = (link) => {
      const startYOffset = getSourceOffset(link);
      const endYOffset = getTargetOffset(link);

      const startX = tX(link.source.time);
      const startY = tY(link.source.wallet) + startYOffset;
      const endX = tX(link.target.time);
      const endY = tY(link.target.wallet) + endYOffset;
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
      .attr("y1", (d) => tY(d.source.wallet) + getSourceOffset(d))
      .attr("y2", (d) => tY(d.target.wallet) + getTargetOffset(d));
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
      .attr("stroke-width", (d) =>
        Math.max(d.value * uiSettings.valueScalar, uiSettings.minValue),
      )
      .attr("fill", "transparent");

    linkIntra
      .append("title")
      .attr("fill", "white")
      .text((d) => `${d.source.wallet} → ${d.target.wallet} - ${d.value}`);
  };

  const createTimeline = (uiSettings) => {
    const transform = uiSettings.transform;
    const scale = 1.0 / transform.k;
    g.append("line")
      .attr("class", "timeline_line")
      .attr("stroke-width", scale)
      .attr("y1", (20 - transform.y) * scale)
      .attr("y2", (HEIGHT - transform.y) * scale);
    g.append("text")
      .attr("class", "timeline_date")
      .attr("font-size", 10 * scale)
      .attr("x", (100 - transform.x) * scale)
      .attr("y", (35 - transform.y) * scale)
      .text("");
  };

  const update = () => {
    g.selectAll("*").remove();

    createNodes(uiSettings);
    createLinks(uiSettings);
    createTimeline(uiSettings);
  };

  update();

  function zoomed(event) {
    const { transform } = event;
    g.attr("transform", transform);
    gX.call(xAxis.scale(transform.rescaleX(timeScale)));

    uiSettings.transform = transform;
    update();
  }

  function reset() {
    svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
  }

  g.on("mousemove", (event) => {
    const mouse = d3.pointer(event);
    const x = mouse[0];
    const y = mouse[1];
    const wallet = wallets.reduce(
      (prev, current) =>
        Math.abs(tY(current) - y) < Math.abs(tY(prev) - y) ? current : prev,
      wallets[0],
    );
    const node = nodes.reduce(
      (prev, current) =>
        current.wallet === wallet &&
        Math.abs(tX(current.time) - x) < Math.abs(tX(prev.time) - x)
          ? current
          : prev,
      nodes[0],
    );

    if (!uiSettings.selected.includes(node.name)) {
      uiSettings.highlighted.forEach((selectId) =>
        g
          .select(`#${selectId}`)
          .attr("stroke", "black")
          .attr("stroke-width", 0),
      );
      g.select(`#${node.selectId}`)
        .attr("stroke", "purple")
        .attr("stroke-width", 3 / uiSettings.transform.k);
      uiSettings.highlighted = [node.selectId];
    }

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
    uiSettings.selected = txIds;
    update(uiSettings);
  });

  observe(store, "ui.scalars", (scalars) => {
    uiSettings.yAxisScale = scalars.yAxis;
    uiSettings.valueScalar = scalars.value;
    update(uiSettings);
  });
};

export const d3OverviewGraph = (root, store, blockchain, wallets) => {
  const model = toOverviewModel(blockchain, wallets);
  const nodes = generateNodes(model);
  const links = generateLinks(nodes, model);

  console.log(nodes, links);

  createGraph(store, root, nodes, links);
};
