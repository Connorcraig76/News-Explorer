# News Explorer — Back-End API

This is the RESTful API server for the **News Explorer** application. It handles user authentication, data validation, and interaction with MongoDB to store user profiles and saved news articles.

## 🌟 Features & Functionality

- **User Authentication:** Registration (`/signup`) and direct login (`/signin`) using hashed passwords (`bcryptjs`) and JSON Web Tokens (`jsonwebtoken`).
- **User Management:** Authenticated endpoint (`GET /users/me`) to retrieve the current user's profile.
- **Article Management:** Endpoints to fetch (`GET /articles`), save (`POST /articles`), and delete (`DELETE /articles/:articleId`) news articles.
- **Security & Rate Limiting:**
  - Express Middleware authentication (`auth.js`).
  - CORS header handling.
  - Security headers using `helmet`.
  - Rate limiting with `express-rate-limit` to protect against DDoS/brute-force attacks.
- **Centralized Error Handling:** Uniform HTTP status response handling with custom error loggers (`winston`).

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose ORM
- **Security & Auth:** `bcryptjs`, `jsonwebtoken`, `helmet`, `cors`, `express-rate-limit`
- **Logging & Utilities:** `winston`, `express-winston`, `dotenv`

DEMO VIDEO - https://www.loom.com/share/3cf9e2d5e55741bc85a92d396d8797b6S
