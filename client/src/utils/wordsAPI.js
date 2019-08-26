import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export default {

    getAllWords: function() {
        return axios.get("/api/words/getAllWords");
    },

    getWord: function(word) {
        return axios.get("/api/words/getWord/" + word);
    },

    addWord: function(word) {
        return axios.post("/api/words/addWord", {word: word});
    },

    updateImage: function(word, imageURL) {
        return axios.put("/api/words/updateImage", {word: word, imageURL: imageURL})
    },

    updateSentence: function(word, sentence) {
        return axios.put("/api/words/updateSentence", {word: word, sentence: sentence});
    },

    deleteWord: function(word) {
        return axios.delete("/api/words/deleteWord", {word: word});
    },

    // loginUser: function(email, password) {
    //     return axios.get("/api/users/loginUser", { params: {email: email, password: password}});
    // },

    // updateWeight: function(userId, weight) {
    //     return axios.put("/api/users/updateWeight", {userId: userId, weight: weight});
    // },
}