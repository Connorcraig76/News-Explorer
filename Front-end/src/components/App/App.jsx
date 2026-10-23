import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";

import Header from "../Header/Header.jsx";
import Main from "../Main.jsx";
import SavedNews from "../SavedNews/SavedNews.jsx";
import Footer from "../Footer/Footer.jsx";
import LoginModal from "../LoginModal/LoginModal.jsx";
import RegisterModal from "../RegisterModal/RegisterModal.jsx";
import RegistrationSuccessModal from "../RegistrationSuccessModal/RegistrationSuccessModal.jsx";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute.jsx";

import { fetchNewsArticles } from "../../utils/newsApi.js";
import { mainApi } from "../../utils/mainApi.js";
import { CurrentUserContext } from "../../contexts/CurrentUserContext.js";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Articles & Search State
  const [articles, setArticles] = useState([]);
  const [savedArticles, setSavedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [pendingArticleUrls, setPendingArticleUrls] = useState([]);

  // Modal State ('login' | 'register' | 'success' | null)
  const [activeModal, setActiveModal] = useState(null);

  const navigate = useNavigate();

  // Initialize token validation and load previous search results on mount
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const savedSearch = localStorage.getItem("news_explorer_search_results");
    const savedQueryState = localStorage.getItem("news_explorer_has_searched");

    if (savedSearch && savedQueryState === "true") {
      try {
        setArticles(JSON.parse(savedSearch));
        setHasSearched(true);
      } catch (err) {
        console.error("Failed to parse saved search results", err);
      }
    }

    if (token) {
      mainApi
        .getUserProfile(token)
        .then((userData) => {
          setCurrentUser(userData);
          return mainApi.getSavedArticles(token);
        })
        .then((userSavedArticles) => {
          setSavedArticles(userSavedArticles);
        })
        .catch((err) => {
          console.error("Token validation failed:", err);
          localStorage.removeItem("jwt");
        })
        .finally(() => {
          setIsAuthChecking(false);
        });
    } else {
      setIsAuthChecking(false);
    }
  }, []);

  const handleSearch = (query) => {
    setIsLoading(true);
    setSearchError("");
    setHasSearched(true);

    return fetchNewsArticles(query)
      .then((fetchedArticles) => {
        setArticles(fetchedArticles);
        localStorage.setItem(
          "news_explorer_search_results",
          JSON.stringify(fetchedArticles),
        );
        localStorage.setItem("news_explorer_has_searched", "true");
      })
      .catch((err) => {
        setSearchError(
          err.message || "Sorry, something went wrong during the request.",
        );
        setArticles([]);
        localStorage.removeItem("news_explorer_search_results");
        localStorage.setItem("news_explorer_has_searched", "false");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleLogin = ({ email, password }) => {
    return mainApi
      .loginUser({ email, password })
      .then((data) => {
        if (!data.token) {
          throw new Error("No token returned from server");
        }
        localStorage.setItem("jwt", data.token);
        return mainApi.getUserProfile(data.token);
      })
      .then((userData) => {
        setCurrentUser(userData);
        return mainApi.getSavedArticles(localStorage.getItem("jwt"));
      })
      .then((userSavedArticles) => {
        setSavedArticles(userSavedArticles);
        setActiveModal(null);
      });
  };

  const handleRegister = ({ email, password, name }) => {
    return mainApi.registerUser({ email, password, name }).then(() => {
      setActiveModal("success");
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setCurrentUser(null);
    setSavedArticles([]);
    navigate("/");
  };

  const handleToggleArticleSave = (article) => {
    const token = localStorage.getItem("jwt");
    if (!token || !currentUser) {
      setActiveModal("login");
      return;
    }

    const alreadySaved = savedArticles.find(
      (item) => item.link === article.url || item.url === article.url,
    );

    if (alreadySaved) {
      const articleId = alreadySaved._id || alreadySaved.id;
      setPendingArticleUrls((prev) => [...prev, article.url]);

      mainApi
        .deleteArticle(token, articleId)
        .then(() => {
          setSavedArticles((prev) =>
            prev.filter((item) => (item._id || item.id) !== articleId),
          );
        })
        .catch((err) => console.error("Failed to delete article:", err))
        .finally(() => {
          setPendingArticleUrls((prev) =>
            prev.filter((url) => url !== article.url),
          );
        });
    } else {
      setPendingArticleUrls((prev) => [...prev, article.url]);

      mainApi
        .saveArticle(token, article)
        .then((savedArticleResponse) => {
          setSavedArticles((prev) => [savedArticleResponse, ...prev]);
        })
        .catch((err) => console.error("Failed to save article:", err))
        .finally(() => {
          setPendingArticleUrls((prev) =>
            prev.filter((url) => url !== article.url),
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
                  onSignInClick={() => setActiveModal("login")}
                  onLogout={handleLogout}
                  isLoggedIn={Boolean(currentUser)}
                />
                <Main
                  articles={articles}
                  isLoading={isLoading}
                  hasSearched={hasSearched}
                  searchError={searchError}
                  isLoggedIn={Boolean(currentUser)}
                  savedArticles={savedArticles}
                  pendingArticleUrls={pendingArticleUrls}
                  onToggleSave={handleToggleArticleSave}
                  onSearch={handleSearch}
                />
                <Footer />
              </>
            }
          />
          <Route
            path="/saved-news"
            element={
              <ProtectedRoute
                isLoggedIn={Boolean(currentUser)}
                isAuthChecking={isAuthChecking}
              >
                <SavedNews
                  currentUser={currentUser}
                  onSignInClick={() => setActiveModal("login")}
                  onLogout={handleLogout}
                  savedArticles={savedArticles}
                  pendingArticleUrls={pendingArticleUrls}
                  onToggleSave={handleToggleArticleSave}
                />
              </ProtectedRoute>
            }
          />
        </Routes>

        <LoginModal
          isOpen={activeModal === "login"}
          onClose={() => setActiveModal(null)}
          onRegisterClick={() => setActiveModal("register")}
          onLogin={handleLogin}
        />
        <RegisterModal
          isOpen={activeModal === "register"}
          onClose={() => setActiveModal(null)}
          onLoginClick={() => setActiveModal("login")}
          onRegister={handleRegister}
        />
        <RegistrationSuccessModal
          isOpen={activeModal === "success"}
          onClose={() => setActiveModal(null)}
          onSignInClick={() => setActiveModal("login")}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
