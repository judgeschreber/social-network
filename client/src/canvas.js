import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    receiveDoodles,
} from "./redux/doodles/slice.js";


export default function Canvas() {
    const bigCanvas = useRef(null);
    const contextRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [color, setColor] = useState("black");

    const dispatch = useDispatch();
    

    useEffect(() => {
        const canvas = bigCanvas.current;
        canvas.width = 500;
        canvas.height = 600;
        canvas.style.border = "2px solid black";
        canvas.style.marginLeft = "20px";
    }, []);

    const mouseDown = ({ nativeEvent }) => {
        //let xPos = nativeEvent.clientX - bigCanvas.current.offsetLeft;
        //let yPos = nativeEvent.clientY - bigCanvas.current.offsetTop;
        const context = bigCanvas.current.getContext("2d");
        //context.scale(2, 2);
        context.lineCap = "round";
        context.strokeStyle = color;
        context.lineWidth = 2;
        contextRef.current = context;
        const { offsetX, offsetY } = nativeEvent;

        contextRef.current.moveTo(offsetX, offsetY);
        setDrawing(true);

        //contextRef.current.stroke();
    };

    const mouseMove = ({ nativeEvent }) => {
        if (!drawing) {
            return;
        }
        const { offsetX, offsetY } = nativeEvent;

        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    const mouseUp = () => {
        contextRef.current.stroke();
        setDrawing(false);
    };

    const submitDoodle = () => {
        let dataUrl = bigCanvas.current.toDataURL();
        let reveiverId = window.location.pathname.split("/user/")[1];
        contextRef.current.clearRect(
            0,
            0,
            bigCanvas.current.width,
            bigCanvas.current.height
        );
        fetch(`/send-doodle/${reveiverId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                imageUrl: dataUrl,
            }),
        })
            .then((results) => {
                return results.json();
            })
            .then((doodles) => {
                dispatch(receiveDoodles(doodles));
            });
    };

    const setRed = () => {
        setColor("red");
    };

    return (
        <>
            <canvas
                ref={bigCanvas}
                onMouseDown={mouseDown}
                onMouseUp={mouseUp}
                onMouseMove={mouseMove}
            />
            <div className="red-button" onClick={setRed}></div>
            <br></br>

            <button onClick={submitDoodle} className="doodle-button">
                Doodle
            </button>
        </>
    );
}
