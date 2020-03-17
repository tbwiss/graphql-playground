const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const UserType = require('./types/user');

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    me: {
      type: UserType,
      description: 'The me type',
      args: {
        key: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (obj, args, { loaders }) => {
        return loaders.usersByApiKeys.load(args.key);
      }
    }
  }
});

const ncSchema = new GraphQLSchema({
  query: RootQueryType,
  // mutation: ...
});

module.exports = ncSchema;