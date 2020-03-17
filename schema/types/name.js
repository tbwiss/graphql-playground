const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString
} = require ('graphql');

const UserType = require('./user');

module.exports = new GraphQLObjectType({
  name: 'NameType',

  fields: {
    id: { type: GraphQLID },
    label: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
    createdBy: { type: new GraphQLNonNull(UserType) }
  }
});