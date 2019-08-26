const router = require("express").Router();
const WordController = require("../../controllers/WordController");
const controller = new WordController();

router.get("/getAllWords", (req, res) => {
    controller.getAllWords(req, res);
});

router.get("/getWord/:word", (req, res) => {
    controller.getWord(req, res);
});

router.post("/addWord", (req, res) => {
    controller.addWord(req, res);
});

router.put("/updateWord", (req, res) => {
    controller.updateWord(req, res);
});

router.delete("/deleteWord", (req, res) => {
    controller.deleteWord(res, res);
});

module.exports = router;