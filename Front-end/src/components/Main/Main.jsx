import { useState, useEffect } from "react";
import "./Main.css";
import SearchForm from "../SearchForm/SearchForm.jsx";
import NewsCardList from "../NewsCardList/NewsCardList.jsx";
import Preloader from "../Preloader/Preloader.jsx";
import About from "../About/About.jsx";
import notFoundIcon from "../../assets/not-found.png";

const ARTICLES_PER_PAGE = 3;

function Main({
  articles,
  isLoading,
  hasSearched,
  searchError,
  isLoggedIn,
  savedArticles,
  pendingArticleUrls,
  onToggleSave,
  onSearch,
}) {
  const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_PAGE);

  useEffect(() => {
    setVisibleCount(ARTICLES_PER_PAGE);
  }, [articles]);

  const visibleArticles = articles.slice(0, visibleCount);
  const hasMoreArticles = visibleCount < articles.length;

  const handleShowMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + ARTICLES_PER_PAGE, articles.length),
    );
  };

  return (
    <main className="main">
      <SearchForm onSearch={onSearch} />

      {isLoading && <Preloader />}

      {searchError && (
        <section className="main__status" role="alert">
          <p className="main__error">{searchError}</p>
        </section>
      )}

      {!isLoading && hasSearched && !searchError && articles.length === 0 && (
        <section className="main__status" aria-labelledby="nothing-found-title">
          <img className="main__status-icon" src={notFoundIcon} alt="" />
          <h2 className="main__status-title" id="nothing-found-title">
            Nothing found
          </h2>
          <p className="main__status-text">
            Sorry, but nothing matched your search terms.
          </p>
        </section>
      )}

      {!isLoading && articles.length > 0 && (
        <section
          className="main__results"
          aria-labelledby="search-results-title"
        >
          <div className="main__content">
            <h2 className="main__title" id="search-results-title">
              Search results
            </h2>
            <NewsCardList
              articles={visibleArticles}
              isLoggedIn={isLoggedIn}
              savedArticles={savedArticles}
              pendingArticleUrls={pendingArticleUrls}
              onToggleSave={onToggleSave}
            />
            {hasMoreArticles && (
              <button
                className="main__show-more"
                type="button"
                onClick={handleShowMore}
              >
                Show more
              </button>
            )}
          </div>
        </section>
      )}

      <About />
    </main>
  );
}

export default Main;
