const { nodeEnv } = require('./util');
const ncSchema = require('../schema');
const graphqlHTTP = require('express-graphql');
const pg = require('pg');
const app = require('express')();

console.log(`Running in ${nodeEnv} mode..`);

const DataLoader = require('dataloader');
const pqConfig = require('../config/pg')[nodeEnv];
const pgPool = new pg.Pool(pqConfig);
const pgdb = require('../database/pgdb')(pgPool);

const { MongoClient } = require('mongodb');
const assert = require('assert');
const mConfig = require('../config/mongo')[nodeEnv];


MongoClient.connect(mConfig.url, (err, mPool) => {
  assert.equal(err, null);

  const mdb = require('../database/mdb')(mPool);

  app.use('/graphql', (req, res) => {
    const loaders = {
      usersByIds: new DataLoader(pgdb.getUsersByIds),
      usersByApiKeys: new DataLoader(pgdb.getUsersByApiKeys),
      contestsForUserIds: new DataLoader(pgdb.getContestsForUserIds),
      namesForContestIds: new DataLoader(pgdb.getNamesForContestIds),
      mdb: {
        usersByIds: new DataLoader(mdb.getUsersByIds)
      }
    };

    graphqlHTTP({
      schema: ncSchema,
      graphiql: true,
      context: { pgPool, mPool, loaders }
    })(req, res)
  });
  
  
  const PORT = process.env.PORT || 3210;
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
});
