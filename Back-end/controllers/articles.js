const Article = require("../models/article");

const getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send(articles))
    .catch(next);
};

const createArticle = (req, res, next) => {
  const { keyword, title, text, date, source, link, image } = req.body;

  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => res.status(201).send(article))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: "Validation error: Invalid article data." });
      }
      return next(err);
    });
};

const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;

  Article.findById(articleId)
    .select("+owner")
    .then((article) => {
      if (!article) {
        return res.status(404).send({ message: "Saved article not found." });
      }

      if (article.owner.toString() !== req.user._id) {
        return res
          .status(403)
          .send({
            message:
              "Forbidden: You cannot delete another user's saved article.",
          });
      }

      return article
        .deleteOne()
        .then(() => res.send({ message: "Article successfully removed." }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(400)
          .send({ message: "Invalid article ID provided." });
      }
      return next(err);
    });
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
