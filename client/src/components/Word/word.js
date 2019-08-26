import React, { Component } from "react";
// import wordsAPI from "../../utils/wordsAPI";
import Choice from "../Choice/choice";
import "./word.css";

class Word extends Component {
    constructor(props) {
        super(props);

        this.state = {
            choices: null,
            rightChoice: null,
        }
    }

    componentDidMount = () => {
        this.getChoices();
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.word !== this.props.word) {
            this.getChoices();
        }
    }

    // Randomly chooses a synonym and sets as correct answer
    getChoices = () => {

        let choices = [];
        
        // Get Right Choice
        let synonyms = JSON.parse(this.props.word.synonyms);
        let randIdx = Math.floor(Math.random() * synonyms.length);

        let rightChoice = synonyms[randIdx];

        choices.push(rightChoice);

        // Get Wrong Choices
        let wrong = JSON.parse(this.props.word.wrong);
        for (var i=0; i<3; i++) {
            randIdx=Math.floor(Math.random() * wrong.length);
            choices.push(wrong[randIdx]);
            wrong.splice(randIdx, 1);
        }

        this.shuffleChoices(choices);
    }

    shuffleChoices = (choices) => {
        let rand;
        let temp;
        for (var i=choices.length - 1; i>0; i--) {
          rand = Math.floor(Math.random() * (i + 1));
          temp = choices[i];
          choices[i] = choices[rand];
          choices[rand] = temp;
        }

        this.setState({
            choices: choices,
        });
    }

    // Checks chosen answer against correct answer
    // Calls appropriate function according to answer's correctness
    checkAnswer = (choice) => {
        let word = this.props.word.word;
        let rightChoice = this.state.rightChoice;

        if (rightChoice === choice) {
            this.props.addRight(word);
        }
        else {
            this.props.addWrong(word);
        }
    }

    render() {
        return (
            <div className="wordContainer">

                {/* WORD */}
                <div className="word">
                    {this.props.word.word}
                </div>

                {/* CHOICES */}
                {this.state.choices && this.state.choices.length > 0 ? (
                    this.state.choices.map(choice => (
                        <Choice 
                            key={choice}
                            choice={choice}
                            checkAnswer={this.checkAnswer}
                        />
                    ))
                ) : (
                    <></>
                )}
            </div>
        )
    }
}

export default Word;