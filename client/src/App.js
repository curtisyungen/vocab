import React, { Component } from 'react';
import Word from "./components/Word/word";
import Sentence from "./components/Sentence/sentence";
import Image from "./components/Image/image";
import wordsAPI from "./utils/wordsAPI";
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      words: null,
      count: null,
      right: [],
      wrong: [],
      complete: false,
    }
  }

  componentDidMount = () => {
    this.newGame();
  }

  newGame = () => {
    this.setState({
      count: 0,
      right: [],
      wrong: [],
      complete: false,
    }, () => {
      this.getAllWords();
    });
  }

  // Get all words from database and shuffle them
  getAllWords = () => {
    wordsAPI.getAllWords()
      .then((res) => {
        let words = res.data;
        this.shuffleWords(words);
      });
  }

  // Shuffles all words into a random order
  shuffleWords = (words) => {
    let rand;
    let temp;
    for (var i=words.length - 1; i>0; i--) {
      rand = Math.floor(Math.random() * (i + 1));
      temp = words[i];
      words[i] = words[rand];
      words[rand] = temp;
    }

    this.setState({
      count: 0,
      words: words,
      complete: false,
    });
  }

  // Adds word to array of correct answers
  addRight = (word) => {
    let right = this.state.right;
    right.push(word);

    this.setState({
      right: right,
    }, () => {
      this.nextWord();
    });
  }

  // Adds word to array of wrong answers
  addWrong = (word) => {
    let wrong = this.state.wrong;
    wrong.push(word);

    this.setState({
      wrong: wrong,
    }, () => {
      this.nextWord();
    });
  }

  // Iterates count to display next word in array
  // Stops when all words have been tested
  nextWord = () => {
    let count = this.state.count;
    let words = this.state.words;

    let complete = false;

    if (count < words.length - 1) {
      count += 1;
    }
    else {
      complete = true;
    }

    this.setState({
      count: count,
      complete: complete,
    });
  }

  render() {
    return (
      <div className="home text-center">

        {/* IMAGE DISPLAY */}
        {this.state.words && this.state.words.length > 0 ? (
          <Image
            word={this.state.words[this.state.count]}
          />
        ) : (
          <></>
        )}

        {/* PLAY AGAIN BUTTON */}
        {this.state.complete ? (
          <button
            className="btn btn-warning playAgainBtn"
            onClick={this.newGame}
          >
            Replay
          </button>
        ) : (
          // WORD DISPLAY
          this.state.words && this.state.words.length > 0 ? (
            <Word 
              word={this.state.words[this.state.count]}
              addRight={this.addRight}
              addWrong={this.addWrong}
            />
          ) : (
            <p className="text-center">Loading...</p>
          )
        )}

        {/* SENTENCE DISPLAY */}
        {this.state.words && this.state.words.length > 0 ? (
          <Sentence 
            word={this.state.words[this.state.count]}
          />
        ) : (
          <></>
        )}

        {/* RIGHT ANSWERS */}
        <div className="right">
          {this.state.right && this.state.right.length > 0 ? (
            this.state.right.map(right => (
              <div key={right}>
                {right}
              </div>
            ))
          ) : (
            <></>
          )}
        </div>

        {/* WRONG ANSWERS */}
        <div className="wrong">
          {this.state.wrong && this.state.wrong.length > 0 ? (
            this.state.wrong.map(wrong => (
              <div key={wrong}>
                {wrong}
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    )
  }
}

export default App;
