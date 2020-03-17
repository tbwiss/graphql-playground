const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString
} = require ('graphql');

module.exports = new GraphQLObjectType({
  name: 'NameType',

  fields: () => {
    const UserType = require('./user');

    return {
      id: { type: GraphQLID },
      label: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLString },
      createdAt: { type: new GraphQLNonNull(GraphQLString) },
      createdBy: { 
        type: UserType,
        resolve: (obj, args, { loaders }) => {
          return loaders.usersByIds.load(obj.createdBy);
        }
      }
    }
  }
});