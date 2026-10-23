const router = require("express").Router();
const auth = require("../middlewares/auth");
const userRoutes = require("./users");
const articleRoutes = require("./articles");
const { createUser, login } = require("../controllers/users");

router.post("/signup", createUser);
router.post("/signin", login);

router.use(auth);

router.use("/users", userRoutes);
router.use("/articles", articleRoutes);

router.use((req, res, next) => {
  res.status(404).send({ message: "Requested resource not found." });
});

module.exports = router;
