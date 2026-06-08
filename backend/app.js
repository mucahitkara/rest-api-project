const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const mainRouter = require("./routes");
const { apiLimiter } = require("./middlewares/rateLimiter.middleware");

const app = express();

// Trust the reverse proxy (Render/Vercel run behind 1 proxy hop).
// Required so express-rate-limit reads the real client IP from X-Forwarded-For
// instead of keying every request to the proxy IP.
app.set("trust proxy", 1);

// Security middleware
app.use(helmet()); // Security headers

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : ["http://localhost:3000"];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === "development") {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const status = err.status || 500;
  const message = process.env.NODE_ENV === "production" 
    ? "Internal Server Error" 
    : err.message;
    
  res.status(status).json({
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
});

module.exports = app;
