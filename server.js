const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { GraphQLSchema, GraphQLObjectType, GraphQLString } = require("graphql");

const app = express();

const authors = [
  { id: 1, name: "Agatha Christie" },
  { id: 2, name: "Sidney Sheldon" },
  { id: 3, name: "Dale Carnegie" },
];

const books = [
  {
    id: 1,
    name: "And Then There Were None",
    authorId: 1,
  },
  { id: 2, name: "And Then There Were None", authorId: 1 },
  { id: 3, name: "Murder of Roger Ackroyd", authorId: 1 },
  { id: 4, name: "Master of the Game", authorId: 2 },
  { id: 5, name: "Stop Worrying and Start Living", authorId: 3 },
  { id: 6, name: "The Art of Public Speaking", authorId: 3 },
  { id: 7, name: "Death on the Nile", authorId: 1 },
  { id: 8, name: "If Tomorrow Comes", authorId: 2 },
  { id: 9, name: "The Sky is Falling", authorId: 2 },
  { id: 10, name: "How to win friends and influence people", authorId: 3 },
];

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "HelloWorld",
    fields: () => ({
      message: { type: GraphQLString, resolve: () => "Hello world" },
    }),
  }),
});

app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));

const port = 5000 || process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
