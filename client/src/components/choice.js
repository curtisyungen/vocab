import React, { Component } from "react";
import "./choice.css";

class Choice extends Component {
    render() {
        return (
            <div 
                className="choice"
                onClick={(event) => {
                    event.preventDefault();
                    this.props.checkAnswer(this.props.choice);
                }}
            >
                {this.props.choice}
            </div>
        )
    }
}

export default Choice;
