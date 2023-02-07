export const createConnection = (url = 'ws://localhost:8080') => {
  const ws = new WebSocket(url);

  const connection = {
    requestId: 1,
    requestQueue: [],
    ws,
  };

  ws.addEventListener('message', (message) => {
    const data = JSON.parse(message.data);
    if ('requestId' in data) {
      connection.requestQueue[data.requestId](data.result);
    }
  });

  return new Promise((resolve) => {
    ws.addEventListener('open', () => resolve(connection));
  });
};

const getTemplate = (requestType) => async (conn, parameters) => {
  const { requestId } = conn;
  conn.requestId += 1;

  conn.ws.send(JSON.stringify({ requestId, requestType, parameters }));
  return new Promise((resolve) => {
    conn.requestQueue[requestId] = resolve;
  });
};

export const getWallets = getTemplate('get.wallets');
export const getSettings = getTemplate('get.settings');

export const getHistories = getTemplate('get.histories');
export const getTransactions = getTemplate('get.transactions');
export const getUTXOs = getTemplate('get.utxos');
