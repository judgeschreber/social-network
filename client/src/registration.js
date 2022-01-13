import React from "react";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    submit() {
        fetch("/registration.json", {
            method: "Post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                test: "test",
                first: this.state.first,
                last: this.state.last,
                email: this.state.email,
                password: this.state.password,
            }),
        }).then((resp) => {
            if (resp.error) {
                this.setState({
                    error: true,
                });
            } else {
                location.replace("");
            }
        });
    }
    render() {
        return (
            <div className="register">
                <h2 className="start-text">Register</h2>

                <input
                    onChange={(e) => this.handleChange(e)}
                    name="first"
                    placeholder="First name"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="last"
                    placeholder="Last name"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="email"
                    placeholder="email"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="password"
                    type="password"
                    placeholder="password"
                />
                <button
                    className="loggedout-button"
                    onClick={() => this.submit()}
                >
                    Submit
                </button>
                <Link to="/login" className="link-to-text">
                    Click here to log in
                </Link>
                {this.state.error && (
                    <h2 className="error">Ooops please try again</h2>
                )}
            </div>
        );
    }
}
