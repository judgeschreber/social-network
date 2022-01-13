
export default function doodleReducer(doodles = null, action) {
    if (action.type == "doodles/receiveDoodles") {
        doodles = action.payload.doodles;
    }

    return doodles;
}

//action creators:
//receiveFriendsAndWannabes
//unfriend
//acceptFriendRequest

export function receiveDoodles(doodles) {
    return {
        type: "doodles/receiveDoodles",
        payload: { doodles },
    };
}
