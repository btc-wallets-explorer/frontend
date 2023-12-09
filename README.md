# Build
## Run Tests
```
npm run test
KARMA_SPEC='**/d3-overview-graph.test.js' npm run test:single
```

# Architecture

Redux base model:

```
{
    blockchain: {
        transactions: [],
        utxos: [],
    }
}
```

# Testing

There is the possibility of using test data. 
One way is filling the redux store directly with the test data.

Another way is mocking the 'api' to provide the test data objects.

```
const api = createApiMock(basicTestData);
```