import "./NewsCard.css";
import bookmarkIcon from "../../assets/bookmark_icon.png";
import bookmarkClicked from "../../assets/bookmark_clicked.png";
import deleteBtn from "../../assets/Delete_btn.png";
import { useState } from "react";

function NewsCard({
  article,
  isLoggedIn,
  isSaved,
  isSaving,
  isSavedPage = false,
  onToggleSave,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleSaveClick = () => {
    if (!isSaving) {
      onToggleSave(article);
    }
  };

  // Format date for visual presentation
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { month: "long", day: "numeric", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Determine which bookmark icon to display
  const getBookmarkSrc = () => {
    if (isSaved) return bookmarkClicked;
    return bookmarkIcon;
  };

  return (
    <article className="news-card">
      {article.url && (
        <a
          className="news-card__link"
          href={article.url || article.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Read ${article.title} in a new tab`}
        />
      )}
      <div className="news-card__image-wrapper">
        <img
          className="news-card__image"
          src={article.image || article.urlToImage}
          alt={article.title}
        />
        {isSavedPage && article.keyword && (
          <span className="news-card__keyword">{article.keyword}</span>
        )}
        <div
          className={`news-card__save-control ${
            isSavedPage ? "news-card__save-control_remove" : ""
          }`}
        >
          {!isLoggedIn && !isSavedPage && (
            <span className="news-card__action-message">
              Sign in to save articles
            </span>
          )}
          {isSavedPage && (
            <span className="news-card__action-message">Remove from saved</span>
          )}
          <button
            className={`news-card__save-button ${
              isSaved ? "news-card__save-button_saved" : ""
            } ${isSavedPage ? "news-card__save-button_remove" : ""}`}
            type="button"
            aria-label={
              isSavedPage
                ? `Remove ${article.title} from saved articles`
                : `${isSaved ? "Remove" : "Save"} ${article.title}`
            }
            disabled={!isLoggedIn && !isSavedPage}
            onClick={handleSaveClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isSavedPage ? (
              <img
                src={deleteBtn}
                alt="Delete icon"
                className="news-card__remove-icon-img"
              />
            ) : (
              <img
                src={getBookmarkSrc()}
                alt="Save icon"
                className="news-card__save-icon-img"
              />
            )}
          </button>
        </div>
      </div>
      <div className="news-card__content">
        <time className="news-card__date">
          {formatDate(article.date || article.publishedAt)}
        </time>
        <h3 className="news-card__title">{article.title}</h3>
        <p className="news-card__description">
          {article.description || article.text}
        </p>
        <p className="news-card__source">
          {typeof article.source === "object"
            ? article.source?.name
            : article.source}
        </p>
      </div>
    </article>
  );
}

export default NewsCard;
