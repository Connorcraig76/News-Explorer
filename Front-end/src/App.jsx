import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";

import CurrentUserContext from "./contexts/CurrentUserContext.js";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import Header from "./components/Header/Header.jsx";
import Main from "./components/Main/Main.jsx";
import SavedNews from "./components/SavedNews/SavedNews.jsx";
import Footer from "./components/Footer/Footer.jsx";
import LoginModal from "./components/LoginModal/LoginModal.jsx";
import RegisterModal from "./components/RegisterModal/RegisterModal.jsx";
import RegistrationSuccessModal from "./components/RegistrationSuccessModal/RegistrationSuccessModal.jsx";

import newsApi from "./utils/newsApi.js";
import mainApi from "./utils/mainApi.js";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [savedArticles, setSavedArticles] = useState([]);
  const [pendingArticleUrls, setPendingArticleUrls] = useState([]);

  // Search States
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [currentKeyword, setCurrentKeyword] = useState("");

  // Modal States
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const navigate = useNavigate();

  // Close all modals
  const closeAllPopups = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setIsSuccessOpen(false);
  };

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      mainApi
        .getUserInfo(token)
        .then((user) => {
          setIsLoggedIn(true);
          setCurrentUser(user);
          return mainApi.getSavedArticles(token);
        })
        .then((data) => {
          setSavedArticles(data);
        })
        .catch((err) => {
          console.error("Token validation error:", err);
          localStorage.removeItem("jwt");
        });
    }
  }, []);

  // Handle Search Submission
  const handleSearch = (keyword) => {
    setIsLoading(true);
    setHasSearched(true);
    setSearchError(false);
    setCurrentKeyword(keyword);
    setVisibleCount(99);

    newsApi
      .getArticles(keyword)
      .then((data) => {
        setArticles(data.articles || []);
      })
      .catch((err) => {
        console.error("News search error:", err);
        setSearchError(true);
        setArticles([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Handle Login
  const handleLogin = ({ email, password }) => {
    return mainApi
      .signin({ email, password })
      .then((res) => {
        localStorage.setItem("jwt", res.token);
        return mainApi.getUserInfo(res.token);
      })
      .then((user) => {
        setIsLoggedIn(true);
        setCurrentUser(user);
        return mainApi.getSavedArticles(localStorage.getItem("jwt"));
      })
      .then((data) => {
        setSavedArticles(data);
        closeAllPopups();
      });
  };

  // Handle Registration
  const handleRegister = ({ email, password, name }) => {
    return mainApi.signup({ email, password, name }).then(() => {
      closeAllPopups();
      setIsSuccessOpen(true);
    });
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    setCurrentUser({});
    setSavedArticles([]);
    navigate("/");
  };

  // Handle Save / Unsave Article Toggle
  const handleToggleSaveArticle = (article) => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    const existingSaved = savedArticles.find(
      (item) =>
        item.link === article.url ||
        item.url === article.url ||
        item.link === article.link,
    );

    if (existingSaved) {
      // Remove article
      mainApi
        .removeArticle(existingSaved._id, token)
        .then(() => {
          setSavedArticles((state) =>
            state.filter((item) => item._id !== existingSaved._id),
          );
        })
        .catch((err) => console.error("Error removing article:", err));
    } else {
      // Save article
      const articleData = {
        keyword: currentKeyword || article.keyword || "General",
        title: article.title,
        text: article.description || article.text,
        date: article.publishedAt || article.date,
        source: article.source?.name || article.source,
        link: article.url || article.link,
        image: article.urlToImage || article.image,
      };

      setPendingArticleUrls((prev) => [...prev, articleData.link]);

      mainApi
        .saveArticle(articleData, token)
        .then((newArticle) => {
          setSavedArticles((state) => [newArticle, ...state]);
        })
        .catch((err) => console.error("Error saving article:", err))
        .finally(() => {
          setPendingArticleUrls((prev) =>
            prev.filter((url) => url !== articleData.link),
          );
        });
    }
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header
                  theme="dark"
                  isLoggedIn={isLoggedIn}
                  onSignInClick={() => setIsLoginOpen(true)}
                  onLogout={handleLogout}
                />
                <Main
                  articles={articles.slice(0, visibleCount)}
                  totalArticlesCount={articles.length}
                  isLoading={isLoading}
                  hasSearched={hasSearched}
                  searchError={searchError}
                  onSearch={handleSearch}
                  onShowMore={() => setVisibleCount((prev) => prev + 3)}
                  isLoggedIn={isLoggedIn}
                  savedArticles={savedArticles}
                  pendingArticleUrls={pendingArticleUrls}
                  onToggleSave={handleToggleSaveArticle}
                />
                <Footer />
              </>
            }
          />
          <Route
            path="/saved-news"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <SavedNews
                  currentUser={currentUser}
                  onSignInClick={() => setIsLoginOpen(true)}
                  onLogout={handleLogout}
                  savedArticles={savedArticles}
                  pendingArticleUrls={pendingArticleUrls}
                  onToggleSave={handleToggleSaveArticle}
                />
              </ProtectedRoute>
            }
          />
        </Routes>

        <LoginModal
          isOpen={isLoginOpen}
          onClose={closeAllPopups}
          onRegisterClick={() => {
            closeAllPopups();
            setIsRegisterOpen(true);
          }}
          onLogin={handleLogin}
        />

        <RegisterModal
          isOpen={isRegisterOpen}
          onClose={closeAllPopups}
          onLoginClick={() => {
            closeAllPopups();
            setIsLoginOpen(true);
          }}
          onRegister={handleRegister}
        />

        <RegistrationSuccessModal
          isOpen={isSuccessOpen}
          onClose={closeAllPopups}
          onSignInClick={() => setIsLoginOpen(true)}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
