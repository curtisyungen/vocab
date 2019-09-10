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
      right: [],
      wrong: [],
      message: "Which is the closest synonym to the bolded word below?",
      prevCorrect: null,
      complete: false,
      showHint: false,
      showReview: false,
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
      right: [],
      wrong: [],
      complete: false,
      showHint: false,
      showReview: false,
    }, () => {
      let unit = this.state.unit;

      if (unit === "all") {
        this.getAllWords();
      }
      else {
        this.getUnit(unit);
      }
    });
  }

  // Opens review modal that shows right/wrong answers from last game
  review = () => {
    let right = this.state.right;
    let wrong = this.state.wrong;

    right.sort(this.alphabetize);
    wrong.sort(this.alphabetize);

    this.setState({
      right: right,
      wrong: wrong,
      showReview: true,
    });
  }

  // Used to sort words in alphabetical order
  alphabetize = (a, b) => {
    if (a === b) {
        return 0;
    }
    else {
        return (a < b) ? -1 : 1;
    }
  }

  // Gets definition for individual word
  getDefinition = (word) => {
    wordsAPI.getWord(word)
      .then((res) => {
        console.log(res);
      });
  }

  // Closes reivew modal
  hideReview = () => {
    this.setState({
      showReview: false,
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

  // Sets unit based on unit selected in dropdown menu
  setUnit = (event) => {
    let unit = event.target.value;
    this.setState({
      unit: unit,
    }, () => {
      this.getUnit(unit);
    });
  }

  // Gets words for specified Unit
  // Unit can be 1 - 6
  getUnit = (unit) => {
    this.setState({
      unit: unit,
      complete: false,
      right: [],
    });

    if (unit !== "all") {
      wordsAPI.getUnit(unit)
      .then((res) => {
        let words = res.data; 
        this.shuffleWords(words);
      });
    }
    else {
      this.getAllWords();
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
  addRight = (word) => {
    let right = this.state.right;
    right.push(word);

    this.setState({
      right: right,
    }, () => {
      this.nextWord();
    });
  }

  // Adds one to total of wrong answers
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
              onChange={this.setUnit}
              value={this.state.unit}
            >
              <option value="all">All</option>
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
              <span>
                <button
                  className="btn btn-warning playAgainBtn"
                  onClick={this.newGame}
                >
                  Replay
                </button>

                <button
                  className="btn btn-success reviewBtn"
                  onClick={this.review}
                >
                  Review
                </button>
              </span>
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

          {/* REVIEW */}
          {this.state.showReview ? (
            <Modal 
              open={this.state.showReview}
              onClose={this.hideReview}
            >
              <div className="reviewDefinition">

              </div>
              <div className="reviewContainer">
                {/* RIGHT */}
                <div className="rightWords">
                  <p className="rightLabel">Right</p>
                  {this.state.right ? (
                    this.state.right.map(right => (
                      <div 
                        className="right"
                        onClick={this.getDefinition.bind(null, right)}
                      >
                        {right}
                      </div>
                    ))
                  ) : (
                    <></>
                  )}
                </div>
                {/* WRONG */}
                <div className="wrongWords">
                  <p className="wrongLabel">Wrong</p>
                  {this.state.wrong ? (
                    this.state.wrong.map(wrong => (
                      <div 
                        className="wrong"
                        onClick={this.getDefinition.bind(null, wrong)}
                      >
                        {wrong}
                      </div>
                    ))
                  ) : (
                    <></>
                  )}
                </div>
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
