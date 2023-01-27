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

const getTemplate = (requestType) => async (conn, params) => {
  const { requestId } = conn;
  // eslint-disable-next-line no-param-reassign
  conn.requestId += 1;

  conn.ws.send(JSON.stringify({ requestId, requestType, ...params }));
  return new Promise((resolve) => {
  // eslint-disable-next-line no-param-reassign
    conn.requestQueue[requestId] = resolve;
  });
};

export const getWallets = getTemplate('get.wallets');
export const getSettings = getTemplate('get.settings');

export const getHistories = getTemplate('get.histories');
export const getTransactions = getTemplate('get.transactions');
