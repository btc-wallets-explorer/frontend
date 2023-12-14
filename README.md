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

# Project structure

## 'src/model`

Redux model of application - global state

## 'src/modules'

Processing modules:

- API.
- Generation of the redux model.

## 'src/ui'

User Interface:

- Graphs (overview, detailed)
- Widgets

## 'src/utils'

Utility files
