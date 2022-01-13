import { useState, useEffect } from "react";

export default function FriendButton({ userId, friendship }) {
    const [buttonText, setButtonText] = useState("Add friend");

    // friendbutton should be passed the other userId of ther otherprofile where it is rendered;
    // we need to know this, cause what the button says depends on it

    //Logic
    //useEffect to find out relationship between user and otherprofile
    useEffect(() => {
        fetch(`/friendship-status/${userId}`)
            .then((results) => {
                return results.json();
            })
            .then((results) => {
                if (results.noRelation) {
                    setButtonText("Add friend");
                } else if (results.accepted) {
                    setButtonText("Cancel friendship");
                } else if (results.sender_id == userId) {
                    setButtonText("Accept friend request");
                } else {
                    setButtonText("request pending: cancel request");
                }
                friendship(results);
            });
    }, []);

    const friendshipAction = () => {

        if (buttonText == "Add friend") {
            fetch(`/friend-request/${userId}`, {
                method: "Post",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(() => {
                setButtonText("request pending: cancel request");
            });
        } else if (
            buttonText == "Cancel friendship" ||
            buttonText == "request pending: cancel request"
        ) {
            fetch(`/friend-delete/${userId}`, {
                method: "Post",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(() => {
                setButtonText("Add friend");
            });
        } else if (buttonText == "Accept friend request") {
            fetch(`/friend-accept/${userId}`, {
                method: "Post",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(() => {
                setButtonText("Cancel friendship");
            });
        }
    };

    return (
        <>
            <button className="friend-button" onClick={friendshipAction}>
                {buttonText}
            </button>
        </>
    );
}
