const { nodeEnv } = require('./util');
const ncSchema = require('../schema');
const graphqlHTTP = require('express-graphql');
const pg = require('pg');
const app = require('express')();

console.log(`Running in ${nodeEnv} mode..`);

const pqConfig = require('../config/pg')[nodeEnv];
const pgPool = new pg.Pool(pqConfig);

const { MongoClient } = require('mongodb');
const assert = require('assert');
const mConfig = require('../config/mongo')[nodeEnv];

MongoClient.connect(mConfig.url, (err, mPool) => {
  assert.equal(err, null);

  app.use('/graphql', graphqlHTTP({
    schema: ncSchema,
    graphiql: true,
    context: { pgPool, mPool }
  }));
  
  
  const PORT = process.env.PORT || 3210;
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
