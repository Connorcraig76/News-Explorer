require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const routes = require("./routes");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { DEV_MONGO_URL } = require("./utils/config");

const { PORT = 3000, MONGO_URL } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

mongoose
  .connect(MONGO_URL || DEV_MONGO_URL)
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(helmet());
app.use(limiter);
app.use(cors());
app.use(express.json());

// Request Logger
app.use(requestLogger);

// Main Application Routes
app.use(routes);

// Error Logger
app.use(errorLogger);

// Centralized Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server." : message,
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`App running on http://localhost:${PORT}`);
});
