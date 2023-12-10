import { createNewStore } from "../../../../src/model/store";
import { generateModel } from "../../../../src/modules/model-generation";
import { toOverviewModel } from "../../../../src/ui/graphs/history-generation";
import basicTestData from "../../../test-data/basic-test-data";
import { createApiMock } from "../../../test-helpers";

describe("history generation", () => {
  it("toOverviewModel creates model", async () => {
    const store = createNewStore();
    const api = createApiMock(basicTestData);
    const wallets = await api.getWallets();
    const data = await generateModel(store, api, wallets);
    const model = toOverviewModel(data);

    expect(model).toEqual([
      {
        wallet: "w1",
        history: [
          {
            blockheight: 50,
            txid: "tx1",
            utxos: [
              { txid: "tx1", vout: 0, value: 0.1 },
              { txid: "tx1", vout: 1, value: 0.1 },
            ],
            in: [
              { wallet: null, txid: "xx1", vout: 0, value: 0.1 },
              { wallet: null, txid: "xx1", vout: 1, value: 0.1 },
              { wallet: null, txid: "xx2", vout: 0, value: 0.1 },
            ],
            out: [{ wallet: "w2", vout: 2, value: 0.1 }],
          },
          {
            blockheight: 300,
            txid: "tx2",
            utxos: [{ txid: "tx1", vout: 1, value: 0.1 }],
            in: [{ wallet: null, txid: "xx3", vout: 0, value: 0.1 }],
            out: [
              { wallet: "w2", vout: 0, value: 0.1 },
              { wallet: null, vout: 1, value: 0.1 },
            ],
          },
          {
            blockheight: 350,
            txid: "tx3",
            utxos: [],
            in: [{ wallet: "w2", txid: "tx1", vout: 2, value: 0.1 }],
            out: [{ wallet: "w2", vout: 2, value: 0.2 }],
          },
        ],
      },
    ]);
    // expect(model).toEqual([
    //   {
    //     wallet: "w1",
    //     history: [
    //       {
    //         blockheight: 50,
    //         txid: "tx1",
    //         utxos: [
    //           { txid: "tx1", vout: 0, value: 0.1 },
    //           { txid: "tx1", vout: 1, value: 0.1 },
    //         ],
    //         in: [
    //           { wallet: null, txid: "xx1", vout: 0, value: 0.1 },
    //           { wallet: null, txid: "xx1", vout: 1, value: 0.1 },
    //           { wallet: null, txid: "xx2", vout: 0, value: 0.1 },
    //         ],
    //         out: [{ wallet: "w2", vout: 2, value: 0.1 }],
    //       },
    //       {
    //         blockheight: 300,
    //         txid: "tx2",
    //         utxos: [{ txid: "tx1", vout: 1, value: 0.1 }],
    //         in: [{ wallet: null, txid: "xx3", vout: 0, value: 0.1 }],
    //         out: [
    //           { wallet: "w2", vout: 0, value: 0.1 },
    //           { wallet: null, vout: 1, value: 0.1 },
    //         ],
    //       },
    //       {
    //         blockheight: 350,
    //         txid: "tx3",
    //         utxos: [],
    //         in: [{ wallet: "w2", txid: "tx1", vout: 2, value: 0.1 }],
    //         out: [{ wallet: "w2", vout: 2, value: 0.2 }],
    //       },
    //     ],
    //   },
    //   {
    //     wallet: "w2",
    //     history: [
    //       {
    //         blockheight: 50,
    //         txid: "tx1",
    //         utxos: [{ txid: "tx1", vout: 2, value: 0.1 }],
    //         in: [
    //           { wallet: null, txid: "xx1", vout: 0, value: 0.1 },
    //           { wallet: null, txid: "xx1", vout: 1, value: 0.1 },
    //           { wallet: null, txid: "xx2", vout: 1, value: 0.1 },
    //         ],
    //         out: [
    //           { wallet: "w1", vout: 0, value: 0.1 },
    //           { wallet: "w1", vout: 1, value: 0.1 },
    //         ],
    //       },
    //       {
    //         blockheight: 300,
    //         txid: "tx2",
    //         utxos: [
    //           { txid: "tx1", vout: 2, value: 0.1 },
    //           { txid: "tx2", vout: 0, value: 0.1 },
    //         ],
    //         in: [{ wallet: null, txid: "xx3", vout: 0, value: 0.1 }],
    //         out: [{ wallet: null, vout: 1, value: 0.1 }],
    //       },
    //       {
    //         blockheight: 350,
    //         txid: "tx3",
    //         utxos: [
    //           { txid: "tx2", vout: 0, value: 0.1 },
    //           { txid: "tx3", vout: 0, value: 0.2 },
    //         ],
    //         in: [{ wallet: "w1", txid: "tx1", vout: 1, value: 0.1 }],
    //         out: [],
    //       },
    //       {
    //         blockheight: 430,
    //         txid: "tx4",
    //         utxos: [{ txid: "tx4", vout: 0, value: 0.25 }],
    //         in: [{ wallet: "w1", txid: "tx1", vout: 1, value: 0.1 }],
    //         out: [{ wallet: null, vout: 1, value: 0.05 }],
    //       },
    //     ],
    //   },
    // ]);
  });
});
