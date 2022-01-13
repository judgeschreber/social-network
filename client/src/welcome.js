import Registration from "./registration";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./Login";
import Reset from "./reset";
import Animate from "./animate.js";

export default function Welcome() {
    return (
        <div className="welcome">
            <div className="logo">
                <Animate />
            </div>
            <BrowserRouter>
                <div className="welcome-input">
                    <Route exact path="/">
                        <Registration />
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/email">
                        <Reset />
                    </Route>
                </div>
            </BrowserRouter>
        </div>
    );
}
