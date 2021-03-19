const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");

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

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "Tis a book",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => {
        return authors.find((author) => author.id === book.authorId);
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "Author who wrote the book",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },

    books: {
      type: GraphQLList(BookType),
      resolve: (author) => {
        return books.filter((book) => book.authorId === author.id);
      },
    },
  }),
});

const rootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root query",
  fields: () => ({
    books: {
      type: new GraphQLList(BookType),
      description: "List of Books",
      resolve: () => books,
    },
    book: {
      type: BookType,
      description: "Single Book",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => books.find((book) => book.id === args.id),
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of Authors",
      resolve: () => authors,
    },
    author: {
      type: AuthorType,
      description: "Author",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) =>
        authors.find((author) => author.id === args.id),
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root mutation",
  fields: () => ({
    addBook: {
      type: BookType,
      description: "Add a book",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const book = {
          id: books.length + 1,
          name: args.name,
          authorId: args.authorId,
        };
        books.push(book);
        return book;
      },
    },
    addAuthor: {
      type: AuthorType,
      description: "Add an author",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        // id: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const author = {
          id: authors.length + 1,
          name: args.name,
          // authorId: args.authorId,
        };
        authors.push(author);
        return author;
      },
    }
  }),
});

const schema = new GraphQLSchema({
  query: rootQueryType,
  mutation: RootMutationType,
});

app.use("/graphql", graphqlHTTP({ schema, graphiql: true }));

const port = 5000 || process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
