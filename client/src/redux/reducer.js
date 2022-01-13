//create the root reducer and user combineReducer to combine the reducer imported from redux/friends/slice.js

import { combineReducers } from "redux";
import friendsReducer from "./friends/slice.js";
import messagesReducer from "./messages/slice.js";
import doodleReducer from "./doodles/slice.js";

const rootReducer = combineReducers({
    friendsAndWannabes: friendsReducer,
    messages: messagesReducer,
    doodles: doodleReducer,
});

export default rootReducer;
