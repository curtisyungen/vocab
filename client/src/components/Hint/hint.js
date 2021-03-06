import React, { Component } from "react";
import "./hint.css";

class Hint extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hint: null,
            type: null,
        }
    }

    componentDidMount = () => {
        this.getHint();
    }

    getHint = () => {
        let word = this.props.word;
        let hint = word.definition;
        let type = word.type;

        this.setState({
            hint: hint,
            type: type,
        });
    }

    render() {
        return (
            <span>
                <h4>Definition</h4>
                <div className="hint">
                    [{this.state.type}]&nbsp;{this.state.hint}
                </div>
            </span>
        )
    }
}

export default Hint;