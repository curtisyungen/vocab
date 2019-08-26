import React, { Component } from "react";
import wordsAPI from "../../utils/wordsAPI";
import "./image.css";

class Image extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imageURL: null,
            update: false,
        }
    }

    componentDidMount = () => {
        this.setState({
            imageURL: this.props.word.imageURL,
        });
    }

    handleInputChange = (event) => {
        const {name, value} = event.target;

        this.setState({
            [name]: value,
        });
    }

    updateImage = () => {
        this.setState({
            update: true,
        });
    }

    cancelUpdate = () => {
        this.setState({
            update: false,
        });
    }

    saveImage = () => {
        let imageURL = this.state.imageURL;
        let word = this.props.word.word;

        wordsAPI.updateImage(word, imageURL)
            .then((res) => {
                console.log(res);
            });
    }

    render() {
        return (
            <span>
                {this.state.update ? (
                    <input
                        name="imageURL"
                        type="text"
                        className="imageInput"
                        onChange={this.handleInputChange}
                        defaultValue={this.state.imageURL}
                        autoComplete="off"
                    />
                ) : (
                        <span>
                            <div className="image">
                                <img
                                    src=""
                                    alt="word"
                                />
                                <button 
                                    className="btn btn-outline-dark btn-sm changeImageBtn"
                                    onClick={this.updateImage}
                                >
                                    Change
                                </button>
                            </div>
                        </span>
                    )}
            </span>
        )
    }
}

export default Image;