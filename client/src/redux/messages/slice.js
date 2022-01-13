export default function messageReducer(messages = null, action) {
    if (action.type == "messages/chatMessagesReceived") {
        messages = action.payload.messages.map((element) => {
            return (element = {
                ...element,
                created_at: element.created_at
                    .replace("T", " ")
                    .split(".")
                    .shift(),
            });
        });
    }
    if (action.type == "message/chatMessageReceived") {
        console.log("messages before: ", messages);
        console.log("action.payload: ", action.payload);
        const newArr = [];
        const newMessage = action.payload.message;
        messages.map((element) => {
            newArr.push(element);
        });
        newArr.unshift(newMessage);
        messages = newArr.map((element) => {
            return (element = {
                ...element,
                created_at: element.created_at
                    .replace("T", " ")
                    .split(".")
                    .shift(),
            });
        });
        console.log("new messages: ", messages);
    }
    return messages;
}

export function chatMessagesReceived(messages) {
    return {
        type: "messages/chatMessagesReceived",
        payload: { messages },
    };
}

export function chatMessageReceived(message) {
    console.log("chatMessageReceived: ", message);
    return {
        type: "message/chatMessageReceived",
        payload: { message },
    };
}
