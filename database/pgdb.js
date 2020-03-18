const { orderedFor } = require('../lib/util');

module.exports = pgPool => {
  return {
    getUsersByIds(userIds) {
      return pgPool.query(`
        select * from users 
        where id = ANY($1)
        `, [userIds]).then(res => {
          return orderedFor({ 
            rows: res.rows, 
            collection: userIds,
            field: 'id',
            singleObject: true
          });
      });
    },

    getUsersByApiKeys(apiKeys) {
      return pgPool.query(`
        select * from users 
        where api_key = ANY($1)
        `, [apiKeys]).then(res => {
          return orderedFor({ 
            rows: res.rows, 
            collection: apiKeys,
            field: 'apiKey',
            singleObject: true
          });
      });
    },

    getContestsForUserIds(userIds) {
      return pgPool.query(`
        select * from contests
        where created_by = ANY($1)
        `, [userIds]).then(res => {
          return orderedFor({ 
            rows: res.rows, 
            collection: userIds,
            field: 'createdBy',
            singleObject: false
          });
      });
    },

    getNamesForContestIds(contestIds) {
      return pgPool.query(`
        select * from names
        where contest_id = ANY($1)
        `, [contestIds]).then(res => {
            return orderedFor({ 
              rows: res.rows, 
              collection: contestIds,
              field: 'contestId',
              singleObject: false
            });
      });
    }
  };
}