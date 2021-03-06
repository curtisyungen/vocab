const path = require("path");
const router = require("express").Router();
const wordRoutes = require("./wordRoutes");

// Word routes
router.use("/words", wordRoutes);

// For anything else, render the html page
router.use((req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

module.exports = router;
