const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const mainRouter = require("./routes");
const { apiLimiter } = require("./middlewares/rateLimiter.middleware");

const app = express();

// Security middleware
app.use(helmet()); // Security headers

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
}));

// Logging
app.use(morgan("combined")); // Log all requests

// Body parsing
app.use(express.json());

// Sanitize data to prevent NoSQL injection
app.use(mongoSanitize());

// Rate limiting for all API routes
app.use("/api/v1", apiLimiter);

// Routes
app.use("/api/v1", mainRouter);

module.exports = app;
