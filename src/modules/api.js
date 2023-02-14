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

  const getTemplate = (requestType) => async (parameters) => {
    const { requestId } = connection;
    connection.requestId += 1;

    connection.ws.send(JSON.stringify({ requestId, requestType, parameters }));
    return new Promise((resolve) => {
      connection.requestQueue[requestId] = resolve;
    });
  };

  return new Promise((resolve) => {
    ws.addEventListener('open', () => resolve({
      connection,
      getWallets: getTemplate('get.wallets'),
      getSettings: getTemplate('get.settings'),

      getHistories: getTemplate('get.histories'),
      getTransactions: getTemplate('get.transactions'),
      getUTXOs: getTemplate('get.utxos'),
    }));
  });
};
