import React, { Component } from "react";
import wordsAPI from "../../utils/wordsAPI";
import "./image.css";

class Image extends Component {
    constructor(props) {
        super(props);

        this.state = {
            imageURL: null,
            update: false,
            showChangeBtn: false,
        }
    }

    componentDidMount = () => {
        this.setState({
            imageURL: this.props.word.imageURL,
        });
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.word.imageURL !== this.props.word.imageURL) {
            this.setState({
                imageURL: this.props.word.imageURL,
            });
        }
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;

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

                this.setState({
                    update: false,
                });
            });
    }

    showChangeBtn = () => {
        this.setState({
            showChangeBtn: true,
        });
    }

    hideChangeBtn = () => {
        this.setState({
            showChangeBtn: false,
        });
    }

    render() {
        return (
            <span>
                {this.state.update ? (
                    <span>
                        {/* IMAGE URL INPUT */}
                        <input
                            name="imageURL"
                            type="text"
                            className="imageInput"
                            onChange={this.handleInputChange}
                            defaultValue={this.state.imageURL}
                            autoComplete="off"
                        />

                        {/* CANCEL */}
                        <button
                            className="btn btn-danger btn-sm cancelImageBtn"
                            onClick={(event) => {
                                event.preventDefault();
                                this.cancelUpdate();
                            }}
                        >
                            Cancel
                        </button>

                        {/* SAVE */}
                        <button
                            className="btn btn-success btn-sm saveImageBtn"
                            onClick={(event) => {
                                event.preventDefault();
                                this.saveImage();
                            }}
                        >
                            Save
                        </button>
                    </span>
                ) : (
                        <span>
                            <div className="imageContainer">
                                {/* IMAGE */}
                                <img
                                    className="image"
                                    onMouseEnter={this.showChangeBtn}
                                    onMouseExit={this.hideChangeBtn}
                                    src={`${this.state.imageURL}`}
                                    alt="word"
                                />
                            </div>

                            {/* CHANGE BUTTON */}
                            {this.state.showChangeBtn ? (
                                <div 
                                    className="changeImageBtn"
                                    onClick={this.updateImage}
                                >
                                    Change
                                </div>
                            ) : (
                                <></>
                            )}
                        </span>
                    )}
            </span>
        )
    }
}

export default Image;