# Build
## Run Tests
```
npm run test
MATCH='control-panel.test.js npm run test:single'
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
