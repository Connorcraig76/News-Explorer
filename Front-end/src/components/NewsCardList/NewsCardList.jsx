import "./NewsCardList.css";
import NewsCard from "../NewsCard/NewsCard.jsx";

function NewsCardList({
  articles,
  isLoggedIn = false,
  savedArticles = [],
  pendingArticleUrls = [],
  onToggleSave,
  isSavedPage = false,
}) {
  return (
    <ul className="news-card-list">
      {articles.map((article, index) => {
        const articleKey = article._id || article.id || article.url || index;
        const isSaved = savedArticles.some(
          (savedArticle) =>
            savedArticle.link === article.url ||
            savedArticle.url === article.url ||
            savedArticle._id === article._id,
        );

        return (
          <li className="news-card-list__item" key={articleKey}>
            <NewsCard
              article={article}
              isLoggedIn={isLoggedIn}
              isSaved={isSaved}
              isSaving={pendingArticleUrls.includes(
                article.url || article.link,
              )}
              isSavedPage={isSavedPage}
              onToggleSave={onToggleSave}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default NewsCardList;
