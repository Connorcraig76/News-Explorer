# News Explorer — Front-End Application

**News Explorer** is a React-based web application that lets users search for world news using the NewsAPI, register/login, and save their favorite articles to a personal reading list stored in a MongoDB database.

## 🌟 Features & Functionality

- **Live News Search:** Query third-party news services with search keywords and view card results formatted according to Figma specifications.
- **Interactive Modals:** Modal popups for user Sign Up, Sign In, and Registration Confirmation.
- **User Authentication:** Persistent auth state powered by JWT token verification stored in `localStorage`.
- **Saved Articles Page:** Protected route (`/saved-news`) displaying user-saved news cards with category/keyword filters and delete functionality.
- **Responsive Layout:** Pixel-perfect adaptive layout matching Figma designs across mobile, tablet, and desktop viewports.

## 🛠️ Tech Stack

- **UI Framework:** React (Vite / Create React App)
- **Routing:** `react-router-dom`
- **State Management:** React Context API (`CurrentUserContext`)
- **HTTP Client:** Native `fetch` API (`MainApi` and `NewsApi`)

DEMO VIDEO - https://www.loom.com/share/3cf9e2d5e55741bc85a92d396d8797b6

LINK - https://www.explorebignews.ldtp.com
