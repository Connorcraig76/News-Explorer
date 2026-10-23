const { PORT = 3000, JWT_SECRET, MONGO_URI, NODE_ENV } = process.env;

const DEV_JWT_SECRET = JWT_SECRET || "super-secret-dev-key-news-explorer";
const DEV_MONGO_URL = MONGO_URI || "mongodb://127.0.0.1:27017/news-explorer-db";

module.exports = {
  PORT,
  NODE_ENV,
  DEV_JWT_SECRET,
  DEV_MONGO_URL,
};
