import { createNewStore } from "../../../../../src/model/store";
import { generateModel } from "../../../../../src/modules/model-generation";
import { toOverviewModel } from "../../../../../src/ui/graphs/overview/d3-overview-graph";
import basicTestData from "../../../../test-data/basic-test-data";
import { createApiMock } from "../../../../test-helpers";

describe("d3-overview-graph", () => {
  it("toOverviewModel creates model", async () => {
    const store = createNewStore();
    const api = createApiMock(basicTestData);
    const wallets = await api.getWallets();
    const data = await generateModel(store, api, wallets);
    const model = toOverviewModel(data);

    expect(model.sort()).toEqual(
      [
        { time: 50, txid: "xx1", vout: 0 },
        { time: 50, txid: "xx1", vout: 1 },
        { time: 50, txid: "xx2", vout: 2 },
        { time: 300, txid: "tx2", vout: 1 },
        { time: 300, txid: "xx3", vin: 2 },
        { time: 430, txid: "tx4", vout: 1 },
        {
          time: 50,
          wallet: "w1",
          txid: "tx1",
          vout: 0,
        },
        {
          time: 50,
          wallet: "w1",
          txid: "tx1",
          vout: 1,
        },
        {
          time: 300,
          wallet: "w1",
          txid: "tx2",
          vin: 1,
        },
        {
          time: 350,
          wallet: "w1",
          txid: "tx3",
          vin: 0,
        },
        {
          time: 50,
          wallet: "w2",
          txid: "tx1",
          vout: 2,
        },
        {
          time: 300,
          wallet: "w2",
          txid: "tx2",
          vout: 0,
        },
        {
          time: 350,
          wallet: "w2",
          txid: "tx3",
          vout: 0,
        },
        {
          time: 350,
          wallet: "w2",
          txid: "tx3",
          vin: 1,
        },
        {
          time: 430,
          wallet: "w2",
          txid: "tx4",
          vout: 0,
        },
        {
          time: 430,
          wallet: "w2",
          tx: "tx4",
          vin: 0,
        },
        {
          time: 430,
          wallet: "w2",
          tx: "tx4",
          vin: 1,
        },
      ].sort(),
    );
  });
});
