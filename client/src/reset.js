import React from "react";
import { Link } from "react-router-dom";

export default class Reset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sent: false,
        };
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    submit() {
        console.log("submit new password");
        fetch("/resetPassword.json", {
            method: "Post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code: this.state.code,
                password: this.state.password,
                email: this.state.email,
            }),
        });
    }
    submitEmail() {
        console.log("submit Email");
        fetch("/sendEmail.json", {
            method: "Post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: this.state.email,
            }),
        });
    }
    sent() {
        this.setState({
            sent: true,
        });
    }
    render() {
        return (
            <div className="reset-password">
                {this.state.sent && (
                    <h2>
                        An email with login was sent. Please check your Account
                        and enter code below
                    </h2>
                )}
                <h1 className="start-text">Reset Password</h1>
                <h2>Please enter your email to receive a reset code</h2>
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="email"
                    placeholder="email"
                />
                <button
                    className="loggedout-button"
                    onClick={() => {
                        this.submitEmail;
                        this.sent();
                    }}
                >
                    Submit
                </button>

                <input
                    onChange={(e) => this.handleChange(e)}
                    name="code"
                    placeholder="code"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="password"
                    placeholder="New Password"
                />
                <button
                    className="loggedout-button"
                    onClick={() => this.submit()}
                >
                    Submit new password
                </button>
                <Link to="/">Click here to Register</Link>
            </div>
        );
    }
}
