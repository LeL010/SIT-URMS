// Load environment variables, this have to be loaded first
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./models");
const addressRoutes = require("./routes/address");
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile")

const app = express();
const PORT = process.env.PORT || 3000;

// Parse CORS origins from environment variable
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://localhost:3001"]; // Default fallback

// CORS middleware with configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);

      // Check if the origin is in the allowed list
      if (corsOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
        return callback(new Error(msg), false);
      }

      return callback(null, true);
    },
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/", profileRoutes);

// Root route for API health check
app.get("/", (req, res) => {
  res.json({ message: "Address API is running" });
});

// Sync database and start server
db.sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });

module.exports = app; // Export for testing purposes
