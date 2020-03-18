const { orderedFor, slug } = require('../lib/util');
const humps = require('humps');

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
    },

    getTotalVotesByNameIds(nameIds) {
      return pgPool.query(`
        select name_id, up, down from total_votes_by_name
        where name_id = ANY($1)
      `, [nameIds]).then(res => {
        return orderedFor({
          rows: res.rows, 
          collection: nameIds,
          field: 'nameId',
          singleObject: true
        })
      });
    },

    getActivitesForUserIds(userIds) {
      return pgPool.query(`
          select created_by, created_at, label, '' as title,
                'name' as activity_type
          from names
          where created_by = ANY($1)
          union
          select created_by, created_at, '' as label, title,
                'contest' as activity_type
          from contests
          where created_by = ANY($1)
      `, [userIds]).then(res => {
        return orderedFor({
          rows: res.rows, 
          collection: userIds,
          field: 'createdBy',
          singleObject: false
        })
      });
    },

    addNewContest({ apiKey, title, description }) {
      return pgPool.query(`
        insert into contests(code, title, description, created_by)
        values ($1, $2, $3,
          (select id from users where api_key = $4))
        returning *
        `, [slug(title), title, description, apiKey]).then(res => {
          return humps.camelizeKeys(res.rows[0]);
      });
    },

    addNewName({ apiKey, contestId, label, description }) {
      return pgPool.query(`
        insert into names(contest_id, label, normalized_label, 
          description, created_by)
        values ($1, $2, $3, $4,
          (select id from users where api_key = $5))
        returning *
        `, [contestId, label, slug(label), 
              description, apiKey])
          .then(res => {
            return humps.camelizeKeys(res.rows[0]);
      });
    }
  };
}