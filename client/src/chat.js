import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { socket } from "./socket";

export default function Chat() {
    const chatMessages = useSelector((state) => state?.messages);
    const textareaRef = useRef();

    useEffect(() => {}, [chatMessages]);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            socket.emit("newChatMessage", e.target.value);
            textareaRef.current.value = "";
        }
    };

    return (
        <>
            <div className="chat-room">
                <h2>Chat room</h2>
                <div className="chat-container">
                    {chatMessages &&
                        chatMessages.map((message) => (
                            <div className="message" key={message.message_id}>
                                <div className="message-image-container">
                                    <img
                                        className="message-image"
                                        src={message.image_url}
                                    />
                                </div>
                                <div className="text-and-date">
                                    <p>{message.message}</p>
                                    <p className="created-at">
                                        {message.created_at}
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
                <textarea
                    ref={textareaRef}
                    onKeyDown={keyCheck}
                    placeholder="Write here"
                    rows="10"
                    cols="40"
                />
            </div>
        </>
    );
}
