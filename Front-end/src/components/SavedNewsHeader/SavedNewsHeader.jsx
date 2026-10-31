import "./SavedNewsHeader.css";

function getKeywordSummary(articles = []) {
  const keywords = [
    ...new Set(articles.map((item) => item.keyword).filter(Boolean)),
  ];

  if (keywords.length === 0) {
    return "No saved keywords yet.";
  }

  if (keywords.length <= 3) {
    return `By keywords: ${keywords.join(", ")}`;
  }

  const remaining = keywords.length - 2;
  return `By keywords: ${keywords.slice(0, 2).join(", ")}, and ${remaining} other${
    remaining > 1 ? "s" : ""
  }`;
}

function SavedNewsHeader({ currentUser, savedArticles = [] }) {
  const count = savedArticles.length;

  return (
    <section className="saved-news-header">
      <p className="saved-news-header__subtitle">Saved articles</p>
      <h1 className="saved-news-header__title">
        {currentUser?.name || "User"}, you have {count} saved{" "}
        {count === 1 ? "article" : "articles"}
      </h1>
      <p className="saved-news-header__keywords">
        {getKeywordSummary(savedArticles)}
      </p>
    </section>
  );
}

export default SavedNewsHeader;
