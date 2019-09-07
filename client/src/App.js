import React, { Component } from 'react';
import Modal from "react-responsive-modal";
import Word from "./components/Word/word";
import Sentence from "./components/Sentence/sentence";
import Image from "./components/Image/image";
import Hint from "./components/Hint/hint";
import wordsAPI from "./utils/wordsAPI";
import './App.css';

const synth = window.speechSynthesis;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      words: null,
      count: null,
      right: null,
      wrong: null,
      message: "Which is the closest synonym to the bolded word below?",
      prevCorrect: null,
      complete: false,
      showHint: false,
      voice: null,
      unit: "all",
    }
  }

  componentDidMount = () => {
    this.newGame();
    this.getVoice();
    this.getBackground();
  }

  // Sets background of body
  // Images taken from Pexels.com -- all free stock photos
  getBackground = () => {
    let links = [
      "https://images.pexels.com/photos/403575/pexels-photo-403575.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      "https://images.pexels.com/photos/921294/pexels-photo-921294.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      "https://images.pexels.com/photos/1420701/pexels-photo-1420701.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      "https://images.pexels.com/photos/1420702/pexels-photo-1420702.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      "https://images.pexels.com/photos/1031641/pexels-photo-1031641.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      "https://images.pexels.com/photos/1084199/pexels-photo-1084199.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    ];

    let idx = Math.floor(Math.random() * links.length);

    let background = links[idx];

    document.body.style = `background-image: url(${background})`;
  }

  // Sets up a new game
  newGame = () => {
    this.setState({
      count: 0,
      right: 0,
      wrong: 0,
      complete: false,
      showHint: false,
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

  // Gets words for specified Unit
  // Unit can be 1 - 6
  getUnit = (event) => {

    let unit = event.target.value;

    this.setState({
      unit: unit,
    });

    if (unit !== "All") {
      wordsAPI.getUnit(unit)
      .then((res) => {
        let words = res.data; 
        this.shuffleWords(words);
      });
    }
  }

  // Shuffles all words into a random order
  shuffleWords = (words) => {
    let rand;
    let temp;
    for (var i = words.length - 1; i > 0; i--) {
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

  // Computes message to tell user correct answer
  getRightChoice = (word, rightChoice, choice) => {
    let message = "";
    let prevCorrect = false;

    if (rightChoice === choice) {
      message = `Correct! ${word} = ${choice.toLowerCase()}.`
      prevCorrect = true;
    }
    else {
      message = `Incorrect! ${word} = ${rightChoice.toLowerCase()}`
      prevCorrect = false;
    }

    this.setState({
      message: message,
      prevCorrect: prevCorrect,
    });
  }

  // Adds one to total of right answers
  addRight = () => {
    let right = this.state.right;
    right += 1;

    this.setState({
      right: right,
    }, () => {
      this.nextWord();
    });
  }

  // Adds one to total of wrong answers
  addWrong = () => {
    let wrong = this.state.wrong;
    wrong += 1;

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
      showHint: false,
    });
  }

  // Displays hint modal (word type and definition)
  showHint = () => {
    this.setState({
      showHint: true,
    });
  }

  // Closes hint modal
  hideHint = () => {
    this.setState({ 
      showHint: false,
    });
  }

  // Gets list of voices from Speech Synthesis API
  getVoice = () => {
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = this.setVoice;
    }
  }

  // Sets default voice in state
  setVoice = () => {
    let voices = synth.getVoices();

    this.setState({
      voice: voices[0],
    });
  }

  // Reads text using Speech Synthesis API
  speak = (text) => {
    if (synth.speaking) {
      return;
    }

    let speakText;
    if (text && text.length > 0) {
      speakText = new SpeechSynthesisUtterance(text);
    }

    speakText.onerror = (event) => {
      console.error("Something went wrong.");
    }

    speakText.rate = 0.60;
    speakText.voice = this.state.voice;

    synth.speak(speakText);
  }

  render() {
    return (
      <span>
        <div className="home text-center">

          {/* TITLE */}
          <h4 className="mainTitle">
            <img className="logo" src={require(`./images/logo.png`)} alt="GREAT Logo" />
            <span>GRE Argot Tester</span>
            <select
              className="selectUnit"
              onChange={this.getUnit}
              value={this.state.unit}
            >
              <option value="All">All</option>
              <option value="1">Unit 1</option>
              <option value="2">Unit 2</option>
              <option value="3">Unit 3</option>
              <option value="4">Unit 4</option>
              <option value="5">Unit 5</option>
              <option value="6">Unit 6</option>
            </select>
          </h4>

          {/* IMAGE DISPLAY */}
          {this.state.words && this.state.words.length > 0 ? (
            <Image
              word={this.state.words[this.state.count]}
            />
          ) : (
              <></>
            )}

          <div className="mainSection">

            {/* ANSWER */}
            <div className={`message prevCorrect-${this.state.prevCorrect}`}>
              {this.state.message}
            </div>

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
                    right={this.state.right}
                    numWords={this.state.words.length}
                    word={this.state.words[this.state.count]}
                    addRight={this.addRight}
                    addWrong={this.addWrong}
                    getRightChoice={this.getRightChoice}
                    speak={this.speak}
                    showHint={this.showHint}
                  />
                ) : (
                    <p className="text-center">Loading...</p>
                  )
              )}
          </div>

          {/* SENTENCE DISPLAY */}
          {this.state.words && this.state.words.length > 0 ? (
            <Sentence
              word={this.state.words[this.state.count]}
            />
          ) : (
              <></>
            )}

          {/* GET HINT */}
          {this.state.showHint ? (
            <Modal
              open={this.state.showHint}
              onClose={this.hideHint}
            >
              <div className="hintContainer">
                  <Hint
                    word={this.state.words[this.state.count]}
                  />
              </div>
            </Modal>
          ) : (
            <></>
          )}

          {/* CURTIS PORTFOLIO LINK */}
          <div className="curtis text-center">
            <p className={`curtis-text`}>
              This project was created by Curtis Yungen.
              Check out his Web Development Portfolio here:
              <a
                className={`btn btn-warning btn-sm curtis-btn`}
                href="https://curtisyungen.github.io/Portfolio"
                target="_blank"
                rel="noopener noreferrer"
              >
                Hire Curtis!
              </a>
            </p>
          </div>
        </div>
      </span>
    )
  }
}

export default App;
