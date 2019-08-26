import React, { Component } from "react";
import Modal from "react-responsive-modal";
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
        this.getImageURL();
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.word.imageURL !== this.props.word.imageURL) {
            this.getImageURL();
        }
    }

    getImageURL = () => {
        let imageURL = this.props.word.imageURL;

        if (imageURL === null || imageURL === "") {
            imageURL = "https://via.placeholder.com/150";
        }

        this.setState({
            imageURL: imageURL,
        });
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
                    <Modal
                        open={this.state.update}
                        onClose={this.cancelUpdate}
                    >
                        <div className="imageModal">
                            <p>Paste Image URL below.</p>

                            {/* IMAGE URL INPUT */}
                            <input
                                name="imageURL"
                                type="text"
                                className="imageInput"
                                onChange={this.handleInputChange}
                                defaultValue={this.state.imageURL}
                                autoComplete="off"
                            />

                            {/* SAVE & CANCEL BUTTONS */}
                            <div className="imageModalBtns">
                                <button
                                    className="btn btn-success btn-sm saveImageBtn"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        this.saveImage();
                                    }}
                                >
                                    Save
                                </button>

                                <button
                                    className="btn btn-danger btn-sm cancelImageBtn"
                                    onClick={(event) => {
                                        event.preventDefault();
                                        this.cancelUpdate();
                                    }}
                                >
                                    Cancel
                                </button>

                            </div>
                        </div>
                    </Modal>
                ) : (
                    <></>
                )}

                <div
                    className="imageContainer"
                    onMouseEnter={this.showChangeBtn}
                    onMouseLeave={this.hideChangeBtn}
                >
                    {/* IMAGE */}
                    <img
                        className="image"
                        src={`${this.state.imageURL}`}
                        alt="word"
                    />

                    {/* CHANGE BUTTON */}
                    {this.state.showChangeBtn ? (
                        <span
                            className="changeImageBtn"
                            onClick={this.updateImage}
                        >
                            Change
                        </span>
                    ) : (
                        <></>
                    )}
                </div>
            </span>
        )
    }
}

export default Image;