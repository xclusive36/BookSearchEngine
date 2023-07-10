const express = require("express"); // import express server
const { ApolloServer } = require("apollo-server-express"); // import ApolloServer
const path = require("path"); // import path
const { authMiddleware } = require("./utils/auth"); // import authMiddleware
const { typeDefs, resolvers } = require("./schemas"); // import typeDefs and resolvers
const db = require("./config/connection"); // import connection to database

const PORT = process.env.PORT || 3001; // set port to 3001 for local development and to process.env.PORT for deployment
const app = express(); // instantiate express server
const server = new ApolloServer({
  // instantiate Apollo server
  typeDefs, // pass in typeDefs
  resolvers, // pass in resolvers
  context: authMiddleware, // pass in authMiddleware to context
});

app.use(express.urlencoded({ extended: false })); // add middleware to parse incoming JSON data
app.use(express.json()); // add middleware to parse incoming JSON data

if (process.env.NODE_ENV === "production") {
  // if in production environment
  app.use(express.static(path.join(__dirname, "../client/build"))); // serve up static assets
}

app.get("/", (req, res) => {
  // add route handler for homepage
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

const startApolloServer = async () => {
  // create async function to start Apollo server and connect to database
  await server.start(); // start Apollo server
  server.applyMiddleware({ app }); // integrate Apollo server with Express application

  db.once("open", () => {
    // connect to database
    app.listen(PORT, () => {
      // start Express server
      console.log(`API server running on port ${PORT}!`); // log port server is running on
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      ); // log GraphQL path
    });
  });
};

startApolloServer(); // call function to start Apollo server and connect to database
