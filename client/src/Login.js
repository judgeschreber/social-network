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
        fetch("/login.json", {
            method: "Post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                success: true,
                error: false,
            }),
        })
            .then((resp) => {
                return resp.json();
            })
            .then((resp) => {
                if (resp.error == true) {
                    this.setState({
                        error: true,
                    });
                } else {
                    location.replace("/");
                }
            });
    }
    render() {
        return (
            <div className="login">
                <h2 className="start-text">Login</h2>
                {this.state.error && <div className="error">Ooops</div>}
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="email"
                    placeholder="email"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    type="password"
                    name="password"
                    placeholder="password"
                />
                <button
                    className="loggedout-button"
                    onClick={() => this.submit()}
                >
                    Submit
                </button>
                <Link to="/" className="link-to-text">
                    Click here to Register
                </Link>
                <Link to="/email" className="link-to-text">
                    Forgot password
                </Link>
            </div>
        );
    }
}
