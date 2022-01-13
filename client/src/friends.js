import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    receiveFriendsAndWannabes,
    unmatchFriend,
} from "./redux/friends/slice.js";

export default function Friends() {
    const dispatch = useDispatch();
    const friends = useSelector(
        (state) =>
            state.friendsAndWannabes &&
            state.friendsAndWannabes.filter((fw) => fw.accepted)
    );
    const wannabes = useSelector(
        (state) =>
            state.friendsAndWannabes &&
            state.friendsAndWannabes.filter((fw) => !fw.accepted)
    );

    useEffect(() => {
        fetch("/friendsAndWannabes")
            .then((res) => {
                return res.json();
            })
            .then((friends) => {
                dispatch(receiveFriendsAndWannabes(friends));
            });
    }, []);


    const unFriend = (target) => {
        fetch(`/friend-delete/${target}`, {
            method: "Post",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then(() => {
                dispatch(unmatchFriend(target));
            });
    };

    const acceptFriend = (target) => {
        fetch(`/friend-accept/${target}`, {
            method: "Post",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                return res.json();
            })
            .then(() => {
                dispatch(unmatchFriend(target));
            });
    };

    return (
        <>
            <div className="friends-and-wannabes">
                <div className="my-friends">
                    <h2 className="friends-text">My friends</h2>
                    <div className="friends">
                        {friends &&
                            friends.map((friends) => (
                                <div className="friend" key={friends.id}>
                                    <a
                                        className="person-photo-name"
                                        href={`/user/${friends.id}`}
                                    >
                                        <div className="find-person-img-container">
                                            <img
                                                className="profile-pic"
                                                src={friends.image_url}
                                            />
                                        </div>
                                        <div key={friends.id}>
                                            {friends.first} {friends.last}
                                        </div>
                                    </a>
                                    <button
                                        className="friend-button"
                                        id={friends.id}
                                        onClick={(e) => unFriend(e.target.id)}
                                    >
                                        unfriend
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
                <div className="my-wannabes">
                    <h2 className="wannabe-text">Friend requests</h2>
                    <div className="wannabes">
                        {friends &&
                            wannabes.map((wannabes) => (
                                <div className="wannabe" key={wannabes.id}>
                                    <a
                                        href={`/user/${wannabes.id}`}
                                        className="person-photo-name"
                                    >
                                        <div className="find-person-img-container">
                                            <img
                                                className="profile-pic"
                                                src={wannabes.image_url}
                                            />
                                        </div>
                                        <div key={wannabes.id}>
                                            {wannabes.first} {wannabes.last}
                                        </div>
                                    </a>
                                    <button
                                        className="friend-button"
                                        id={wannabes.id}
                                        onClick={(e) =>
                                            acceptFriend(e.target.id)
                                        }
                                    >
                                        accept friendrequest
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </>
    );
}
