// server.js is the entry point for the GraphQL server.
// It connects to MongoDB, creates an Apollo Server, and starts
// the server on port 4000.
require("dotenv").config(); // Load environment variables
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { ApolloServerPluginDrainHttpServer } = require("@apollo/server/plugin/drainHttpServer");
const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/mongoose");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

// Initialize the application
const startServer = async () => {
  // Step 1: Connect to MongoDB
  await connectDB();

  // Step 2: Create Express server and Apollo Server
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  // Step 3: Start Apollo Server
  await server.start();

  // Step 4: Configure middleware
  app.use(
    "/graphql",
    cors({
      origin: "http://localhost:3000", // Your React app's URL
      credentials: true,
    }),
    express.json(),
    cookieParser(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res }),
    })
  );

  // Step 5: Start the HTTP server
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

  console.log(`🚀 GraphQL server ready at http://localhost:4000/graphql`);
};

// Start the server
startServer();
