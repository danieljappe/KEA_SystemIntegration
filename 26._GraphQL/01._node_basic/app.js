import express from 'express';
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql';
import { createHandler } from 'graphql-http/lib/use/express';

const app = express();

app.use(express.static('public'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


/**
 * Construct a GraphQL schema and define the necessary resolvers.
 *
 * type Query {
 *   hello: String
 * }
 */
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'world',
      },
    },
  }),
});

app.all('/graphql', createHandler({ schema }));