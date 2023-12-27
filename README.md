# Build

## Run Tests

```
npm run test
KARMA_SPEC='**/d3-overview-graph.test.js' npm run test:single
```

# Architecture

Model, View, Controller

## Model

Redux base model (`model/store`):

```
{
    blockchain: {
        transactions: [],
        utxos: [],
        scriptHashes: []
    }
    ...
}
```

Global properties are stored in redux:

- blockchain
- settings
- ui global settings

TypeScript type definitions in `model/domain`.

## Controller

For controlling the model, redux actions (reducers) are being used.

## View

The user interface is ipmlemented as WebComponents using the _lit_ library.
For the graphs D3 is used.

# Testing

There is the possibility of using test data.
One way is filling the redux store directly with the test data.

Another way is mocking the 'api' to provide the test data objects.

```
const api = createApiMock(basicTestData);
```
