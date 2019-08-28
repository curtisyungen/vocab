import React, { Component } from 'react';
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
    }
  }

  componentDidMount = () => {
    this.newGame();
    this.getVoice();
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

  // Displays hint (word type and definition)
  showHint = () => {
    this.setState({
      showHint: true,
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
      
      <h4 className="mainTitle">
        <img className="logo" src={require(`./images/logo.png`)} alt="GREAT Logo" />
        <span>GRE Argot Tester</span>
        {this.state.words ? (
          <div className="counter">
            <div>{this.state.right} / {this.state.words.length} right</div>
            {/* <div>{this.state.right} right</div> */}
          </div>
        ) : (
          <></>
        )}
      </h4>
      
      <div className="home text-center">
  
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
                word={this.state.words[this.state.count]}
                addRight={this.addRight}
                addWrong={this.addWrong}
                getRightChoice={this.getRightChoice}
                speak={this.speak}
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
        <div className="hintContainer">
          {this.state.showHint ? (
            <Hint
              word={this.state.words[this.state.count]}
            />
          ) : (
            <button
              className="btn btn-outline-dark btn-sm getHintBtn"
              onClick={this.showHint}
            >
              Get Hint
            </button>
          )}
        </div>
      </div>

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
    </span>
    )
  }
}

export default App;
