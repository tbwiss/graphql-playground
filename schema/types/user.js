const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt
} = require('graphql');
const ContestType = require('./contest');

module.exports = new GraphQLObjectType({
  name: 'UserType',

  fields: {
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    fullName: { 
      type: GraphQLString,
      resolve: obj => `${obj.firstName} ${obj.lastName}`
    },
    email: { type: new GraphQLNonNull(GraphQLString) },
    createdAt: { type: GraphQLString },
    contests: {
      type: new GraphQLList(ContestType),
      resolve(obj, args, { loaders }) {
        return loaders.contestsForUserIds.load(obj.id);
      }
    },
    contestsCount: {
      type: GraphQLInt,
      resolve(obj, args, { loaders }, { fieldName }) {
        return loaders.mdb.usersByIds.load(obj.id)
          .then(res => res[fieldName])
      }
    },
    namesCount: {
      type: GraphQLInt,
      resolve(obj, args, { loaders }, { fieldName }) {
        return loaders.mdb.usersByIds.load(obj.id)
          .then(res => res[fieldName])
      }
    },
    votesCount: {
      type: GraphQLInt,
      resolve(obj, args, { loaders }, { fieldName }) {
        return loaders.mdb.usersByIds.load(obj.id)
          .then(res => res[fieldName])
      }
    }
  }
});