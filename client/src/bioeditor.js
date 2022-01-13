import { Component } from "react";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorIsVisible: false,
            draftbio: this.props.bio,
            biotext: this.props.bio,
        };
    }
    
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    textareaToggle() {
        this.setState({
            editorIsVisible: !this.state.editorIsVisible,
        });
       
    }
    submitBio() {
        if (this.state.draftbio) {
            fetch("/bio.json", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bio: this.state.draftbio,
                }),
            })
                .then((result) => {
                    return result.json();
                })
                .then((result) => {
                    this.setState({
                        biotext: result[0].bio,
                    });
                    this.props.updateBio(result[0].bio);
                });
        } else {
            return;
        }
    }

    render() {
        return (
            <div className="bio-section">
                {this.state.editorIsVisible && (
                    <textarea
                        defaultValue={this.props.bio}
                        name="draftbio"
                        onChange={(e) => this.handleChange(e)}
                    />
                )}
                {!this.state.editorIsVisible && !this.props.bio && (
                    <button
                        className="bio-button"
                        onClick={() => this.textareaToggle()}
                    >
                        Create Bio
                    </button>
                )}
                {!this.state.editorIsVisible && this.props.bio && (
                    <button
                        className="bio-button"
                        onClick={() => this.textareaToggle()}
                    >
                        Edit Bio
                    </button>
                )}
                {this.state.editorIsVisible && (
                    <button
                        className="bio-button"
                        onClick={() => {
                            this.submitBio();
                            this.textareaToggle();
                        }}
                    >
                        Save
                    </button>
                )}
            </div>
        );
    }
}
