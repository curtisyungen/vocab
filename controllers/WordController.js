const db = require("../models/index.js");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

class WordController {

    getAllWords(req, res) {
        db.Words.findAll({})
        .then((words) => {
            res.json(words);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    getUnit(req, res) {
        db.Words.findAll({
            where: {
                unit: req.params.unit,
            }
        })
        .then((words) => {
            res.json(words);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    getWord(req, res) {
        db.Words.findOne({
            where: {
                word: req.params.word,
            }
        })
        .then((word) => {
            res.json(word);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    addWord(req, res) {
        db.Words.create({
            word: req.body.word,
            definition: req.body.definition,
            type: req.body.type,
            synonyms: req.body.synonyms,
            noun: req.body.noun,
            verb: req.body.verb,
            adjective: req.body.adjective,
            nounSentence: req.body.nounSentence,
            verbSentence: req.body.verbSentence,
            adjSentence: req.body.adjSentence,            
        })
        .then((word) => {
            res.json(word);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    updateImage(req, res) {
        db.Words.update(
            {imageURL: req.body.imageURL},
            {where: {
                word: req.body.word
            }})
            .then((word) => {
                res.json(word);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    updateSentence(req, res) {
        db.Words.update(
            {sentence: req.body.sentence},
            {where: {
                word: req.body.word,
            }})
            .then((word) => {
                res.json(word);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    deleteWord(req, res) {
        db.Words.destroy({
            where: {
                word: req.body.word,
            }})
            .then((word) => {
                res.json(word);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

module.exports = WordController;
