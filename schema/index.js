const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const UserType = require('./types/user');

const RootQueryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
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
  })
});

const AddContestMutation = require('./mutations/add-contest');
const AddNameMutation = require('./mutations/add-name');

const RootMutationType = new GraphQLObjectType({
  name: 'RootMutation',

  fields: () => ({
    AddContest: AddContestMutation,
    AddName: AddNameMutation
  })
});

const ncSchema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});

module.exports = ncSchema;