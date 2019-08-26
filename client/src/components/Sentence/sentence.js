import React, { Component } from "react";
import wordsAPI from "../../utils/wordsAPI";
import "./sentence.css";

class Sentence extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sentence: null,
            update: false,
        }
    }

    componentDidMount = () => {
        this.setState({
            sentence: this.props.word.sentence,
        });
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.word.sentence !== this.props.word.sentence) {
            this.setState({
                sentence: this.props.word.sentence,
            });
        }
    }

    handleInputChange = (event) => {
        const {name, value} = event.target;

        this.setState({
            [name]: value,
        });
    }

    updateSentence = () => {
        this.setState({
            update: true,
        });
    }

    cancelUpdate = () => {
        this.setState({
            update: false,
        });
    }

    saveSentence = () => {
        let word = this.props.word.word;
        let sentence = this.state.sentence;

        wordsAPI.updateSentence(word, sentence)
            .then((res) => {
                console.log(res);
            });

        this.setState({
            update: false,
        });
    }

    render() {
        return (
            <div className="sentenceContainer">
                {/* UPDATE SENTENCE */}
                {this.state.update ? (
                    <span>
                        <form>
                            {/* INPUT */}
                            <div className="form-group">
                                <input 
                                    name="sentence"
                                    type="text"
                                    className="form-control sentenceInput"
                                    onChange={this.handleInputChange}
                                    defaultValue={this.state.sentence}
                                    autoComplete="off"
                                />
                            </div>
                            <div className="form-group">
                                {/* SAVE */}
                                <button
                                    className="btn btn-success btn-sm saveSentenceBtn"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        this.saveSentence();
                                    }}
                                >
                                    Save
                                </button>

                                {/* CANCEL */}
                                <button
                                    className="btn btn-danger btn-sm cancelSentenceBtn"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        this.cancelUpdate();
                                    }}
                               >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </span>
                ) : (
                    <span>
                        {/* SENTENCE */}
                        <div className="sentence">
                            {this.state.sentence}

                            {/* CHANGE */}
                            <button
                                className="btn btn-outline-dark btn-sm changeSentenceBtn"
                                onClick={this.updateSentence}
                            >
                                Change
                            </button>
                        </div>
                    </span>
                )}
            </div>
        )
    }
}

export default Sentence;