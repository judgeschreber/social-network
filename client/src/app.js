import { Component } from "react";
import Uploader from "./uploader";
import ProfilePic from "./profilepic";
import Profile from "./profile";
import { BrowserRouter, Route } from "react-router-dom";
import Findpeople from "./findpeople";
import OtherProfile from "./otherprofile";
import Friends from "./friends";
import Logo from "./logo";
import Chat from "./chat";
import Wall from "./thewall";

export default class app extends Component {
    constructor() {
        super();
        this.state = {
            showUploader: false,
            showNavBar: false,
        };
        this.toggleNavBar = this.toggleNavBar.bind(this);
        this.toggleUploader = this.toggleUploader.bind(this);
        this.getImageUrl = this.getImageUrl.bind(this);
        this.updateBio = this.updateBio.bind(this);
    }
    componentDidMount() {
        //make a fetch request, the server will get data with id from cookie
        fetch("/getUserData")
            .then((result) => result.json())
            .then((result) => {
                this.setState({
                    imageUrl: result.image_url,
                    first: result.first,
                    last: result.last,
                    bio: result.bio,
                });
            });
    }
    toggleUploader() {
        this.setState({
            showUploader: !this.state.showUploader,
        });
    }
    toggleNavBar() {
        this.setState({
            showNavBar: !this.state.showNavBar,
        });
    }
    getImageUrl(val) {
        this.setState({
            imageUrl: val,
        });
    }
    logout() {
        fetch("/logout");
        location.replace("/");
    }
    updateBio(val) {
        this.setState({
            bio: val,
        });
    }
    render() {
        return (
            <>
                <header className="header">
                    <div className="header-left">
                        <Logo />
                    </div>
                    <div className="header-right">
                        <div
                            className="nav-button"
                            onClick={() => this.logout()}
                        >
                            {" "}
                            Logout
                        </div>

                        <a href="/find" className="nav-button">
                            Find
                        </a>
                        <a href="/friends" className="nav-button">
                            Friends
                        </a>
                        <div
                            className="small-image-container"
                            onClick={this.toggleNavBar}
                        >
                            <ProfilePic
                                first="myName"
                                last="myLast"
                                imageUrl={this.state.imageUrl}
                                //showUploader={this.toggleUploader}
                            />
                        </div>
                    </div>
                </header>
                {this.state.showNavBar && (
                    <div>
                        <div className="triangle"></div>
                        <div className="dropdown">
                            <a href="/" className="dropdown-text">
                                <p>My profile</p>
                            </a>
                            <p
                                className="dropdown-text"
                                onClick={this.toggleUploader}
                            >
                                Upload photo
                            </p>
                        </div>
                    </div>
                )}
                <BrowserRouter>
                    <div className="app-input">
                        <Route path="/find">
                            <Findpeople />
                        </Route>
                        <Route path="/friends">
                            <Friends />
                        </Route>
                        <Route exact path="/">
                            <div className="my-profile-view">
                                <Profile
                                    first={this.state.first}
                                    last={this.state.last}
                                    imageUrl={this.state.imageUrl}
                                    bio={this.state.bio}
                                    updateBio={this.updateBio}
                                />
                                <Wall />
                                <Chat />
                            </div>
                        </Route>
                        <Route path="/user/:id">
                            <OtherProfile />
                        </Route>
                    </div>
                </BrowserRouter>
                {this.state.showUploader && (
                    <Uploader
                        showUploader={this.toggleUploader}
                        getImageUrl={this.getImageUrl}
                    />
                )}
            </>
        );
    }
}
