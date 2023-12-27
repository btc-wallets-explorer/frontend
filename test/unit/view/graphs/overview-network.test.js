import { loadBlockchain } from "../../../../src/controller/fetch-data";
import { createNewStore } from "../../../../src/model/store/store";
import { toOverviewModel } from "../../../../src/controller/graph/overview/overview-network";
import basicTestData from "../../../test-data/basic-test-data";
import { createApiMock } from "../../../test-helpers";

describe("overview network generation", () => {
  it("toOverviewModel creates model", async () => {
    const store = createNewStore();
    const api = createApiMock(basicTestData);
    const wallets = await api.getWallets();
    const data = await loadBlockchain(store, api, wallets);
    const model = toOverviewModel(data, wallets);

    expect(model).toEqual([
      {
        wallet: "w1",
        walletHistory: [
          {
            txid: "tx1",
            time: 50,
            in: [
              {
                txid: "xx1",
                vout: 0,
                value: null,
                wallet: null,
              },
              {
                txid: "xx1",
                vout: 1,
                value: null,
                wallet: null,
              },
              {
                txid: "xx2",
                vout: 2,
                value: null,
                wallet: null,
              },
            ],
            out: [
              {
                value: 0.1,
                scriptPubKey: {
                  address: "bc1qmu2wm8hwxtkucmvqzlmy2w2r3kp6h4kfs445xy",
                },
                spendVin: {
                  txid: "tx2",
                  vin: {
                    txid: "tx1",
                    vout: 0,
                  },
                },
                wallet: "w1",
              },
              {
                value: 0.1,
                scriptPubKey: {
                  address: "bc1qvpy05d7qgknpyqxnxgmqg6wxks7apr52a3sdf5",
                },
                spendVin: {
                  txid: "tx3",
                  vin: {
                    txid: "tx1",
                    vout: 1,
                  },
                },
                wallet: "w1",
              },
              {
                value: 0.1,
                scriptPubKey: {
                  address: "bc1qd4vgjkfavje908flm3tzn5cl88f8k8u3vrzppj",
                },
                spendVin: {
                  txid: "tx3",
                  vin: {
                    txid: "tx1",
                    vout: 2,
                  },
                },
                wallet: "w2",
              },
            ],
            utxos: [
              {
                txid: "tx1",
                value: 0.1,
                vout: 0,
              },
              {
                txid: "tx1",
                value: 0.1,
                vout: 1,
              },
            ],
          },
          {
            txid: "tx2",
            time: 300,
            in: [
              {
                txid: "xx3",
                vout: 0,
                value: null,
                wallet: null,
              },
              {
                txid: "tx1",
                vout: 0,
                value: 0.1,
                wallet: "w1",
              },
            ],
            out: [
              {
                value: 0.1,
                scriptPubKey: {
                  address: "bc1qk64lcd08nk2qcf9n0ul2d8l8grmwcz5s7jmtmc",
                },
                spendVin: {
                  txid: "tx4",
                  vin: {
                    txid: "tx2",
                    vout: 0,
                  },
                },
                wallet: "w2",
              },
              {
                value: 0.1,
                scriptPubKey: {
                  address: "bc1qxaggw0xq7rtg2knyxra04whzewpdzzcgkh57nk",
                },
                spendVin: null,
                wallet: null,
              },
            ],
            utxos: [
              {
                txid: "tx1",
                value: 0.1,
                vout: 1,
              },
            ],
          },
          {
            txid: "tx3",
            time: 350,
            in: [
              {
                txid: "tx1",
                vout: 1,
                value: 0.1,
                wallet: "w1",
              },
              {
                txid: "tx1",
                vout: 2,
                value: 0.1,
                wallet: "w2",
              },
            ],
            out: [
              {
                value: 0.2,
                scriptPubKey: {
                  address: "bc1q6hjq9pyyj8dzxza0gynpljpqu98lcjwgamn8yu",
                },
                spendVin: {
                  txid: "tx4",
                  vin: {
                    txid: "tx3",
                    vout: 0,
                  },
                },
                wallet: "w2",
              },
            ],
            utxos: [],
          },
        ],
      },
      {
        wallet: "w2",
        walletHistory: [
          {
            txid: "tx1",
            time: 50,
            in: [
              {
                txid: "xx1",
                vout: 0,
                value: null,
                wallet: null,
              },
              {
                txid: "xx1",
                vout: 1,
                value: null,
                wallet: null,
              },
              {
                txid: "xx2",
                vout: 2,
                value: null,
                wallet: null,
              },
            ],
            out: [
              {
                value: 0.1,
                scriptPubKey: {
                  address: "bc1qmu2wm8hwxtkucmvqzlmy2w2r3kp6h4kfs445xy",
                },
                spendVin: {
                  txid: "tx2",
                  vin: {
                    txid: "tx1",
                    vout: 0,
                  },
                },
                wallet: "w1",
              },
              {
                value: 0.1,
                scriptPubKey: {
                  address: "bc1qvpy05d7qgknpyqxnxgmqg6wxks7apr52a3sdf5",
                },
                spendVin: {
                  txid: "tx3",
                  vin: {
                    txid: "tx1",
                    vout: 1,
                  },
                },
                wallet: "w1",
              },
              {
                value: 0.1,
                scriptPubKey: {
                  address: "bc1qd4vgjkfavje908flm3tzn5cl88f8k8u3vrzppj",
                },
                spendVin: {
                  txid: "tx3",
                  vin: {
                    txid: "tx1",
                    vout: 2,
                  },
                },
                wallet: "w2",
              },
            ],
            utxos: [
              {
                txid: "tx1",
                value: 0.1,
                vout: 2,
              },
            ],
          },
          {
            txid: "tx2",
            time: 300,
            in: [
              {
                txid: "xx3",
                vout: 0,
                value: null,
                wallet: null,
              },
              {
                txid: "tx1",
                vout: 0,
                value: 0.1,
                wallet: "w1",
              },
            ],
            out: [
              {
                value: 0.1,
                scriptPubKey: {
                  address: "bc1qk64lcd08nk2qcf9n0ul2d8l8grmwcz5s7jmtmc",
                },
                spendVin: {
                  txid: "tx4",
                  vin: {
                    txid: "tx2",
                    vout: 0,
                  },
                },
                wallet: "w2",
              },
              {
                value: 0.1,
                scriptPubKey: {
                  address: "bc1qxaggw0xq7rtg2knyxra04whzewpdzzcgkh57nk",
                },
                spendVin: null,
                wallet: null,
              },
            ],
            utxos: [
              {
                txid: "tx1",
                value: 0.1,
                vout: 2,
              },
              {
                txid: "tx2",
                value: 0.1,
                vout: 0,
              },
            ],
          },
          {
            txid: "tx3",
            time: 350,
            in: [
              {
                txid: "tx1",
                vout: 1,
                value: 0.1,
                wallet: "w1",
              },
              {
                txid: "tx1",
                vout: 2,
                value: 0.1,
                wallet: "w2",
              },
            ],
            out: [
              {
                value: 0.2,
                scriptPubKey: {
                  address: "bc1q6hjq9pyyj8dzxza0gynpljpqu98lcjwgamn8yu",
                },
                spendVin: {
                  txid: "tx4",
                  vin: {
                    txid: "tx3",
                    vout: 0,
                  },
                },
                wallet: "w2",
              },
            ],
            utxos: [
              {
                txid: "tx2",
                value: 0.1,
                vout: 0,
              },
              {
                txid: "tx3",
                value: 0.2,
                vout: 0,
              },
            ],
          },
          {
            txid: "tx4",
            time: 430,
            in: [
              {
                txid: "tx2",
                vout: 0,
                value: 0.1,
                wallet: "w2",
              },
              {
                txid: "tx3",
                vout: 0,
                value: 0.2,
                wallet: "w2",
              },
            ],
            out: [
              {
                value: 0.25,
                scriptPubKey: {
                  address: "bc1q56szgukmzphuunh08erevj3feycdegep099rjs",
                },
                spendVin: undefined,
                wallet: "w2",
              },
              {
                value: 0.05,
                scriptPubKey: {
                  address: "bc1qxaggw0xq7rtg2knyxra04whzewpdzzcgkh57nk",
                },
                spendVin: null,
                wallet: null,
              },
            ],
            utxos: [
              {
                txid: "tx4",
                value: 0.25,
                vout: 0,
              },
            ],
          },
        ],
      },
    ]);
  });
});
