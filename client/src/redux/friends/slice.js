//reducer:
//A conditional for handling the action created by receiveFriendsAndWannabes
//A conditional for handling the action created by unfriend
//A conditional for handling the action created by acceptFriendRequest

export default function friendsReducer(friends = null, action) {
    if (action.type == "friends/receiveFriendsAndWannabes") {
        friends = action.payload.friends;
    }

    if (action.type == "friends/unmatchFriend") {
        friends = friends.filter(
            (friend) => friend.id != action.payload.userId
        );
    }

    if (action.type == "friends/acceptFriend") {
        friends = friends.map((friend) => {
            if (friend.id != action.payload.userId) {
                return friend;
            } else {
                return friend = {
                    ...friend,
                    accepted: true,
                };
            }
        });
    }

    return friends;
}

//action creators:
//receiveFriendsAndWannabes
//unfriend
//acceptFriendRequest

export function receiveFriendsAndWannabes(friends) {
    console.log("receiveFriendsAndWannabes is called");
    return {
        type: "friends/receiveFriendsAndWannabes",
        payload: { friends },
    };
}

export function unmatchFriend(userId) {
    console.log("unmatch is called");
    return {
        type: "friends/unmatchFriend",
        payload: { userId },
    };
}

export function acceptFriend(userId) {
    console.log("accept Friend is called");
    return {
        type: "friends/acceptFriend",
        payload: { userId },
    };
}
