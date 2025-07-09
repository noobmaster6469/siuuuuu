// Load environment variables from .env
require("dotenv").config();

// Import MongoDB connection logic
const connectToMongoDB = require("./src/config/mongodb.config");

// (Next step) Import Express app (we'll create this later)
const app = require("./src/config/express.config");

// Define port
const PORT = process.env.PORT || 8000;

// Connect to MongoDB first, then start the server
(async () => {
  await connectToMongoDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})();
