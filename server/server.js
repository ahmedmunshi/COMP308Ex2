// server.js is the entry point for the GraphQL server.
// It connects to MongoDB, creates an Apollo Server, and starts
// the server on port 4000.
require("dotenv").config(); // Load environment variables
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const connectDB = require("./config/mongoose");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

// Initialize the application
const startServer = async () => {
  // Step 1: Connect to MongoDB
  await connectDB();

  // Step 2: Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Step 3: Start Apollo Server
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req, res }) => ({ req, res }),
  });

  console.log(`🚀 GraphQL server ready at ${url}`);
};

// Start the server
startServer();
