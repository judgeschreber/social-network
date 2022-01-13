import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveDoodles } from "./redux/doodles/slice.js";

export default function Wall() {
    //const [doodles, setDoodles] = useState(null);
    const dispatch = useDispatch();
    const doodles = useSelector((state) => state.doodles && state.doodles);
    let id;
    id = window.location.pathname.split("/user/")[1];

    //fetch results for logged in user from db
    useEffect(() => {
        fetch(`/doodles/${id || ""}`)
            .then((results) => {
                return results.json();
            })
            .then((results) => {
                dispatch(receiveDoodles(results));
            });
    }, []);

    //store results in state

    //map through results and show in jsx

    return (
        <>
            <div className="wall-comp">
                <div className="all-doodles">
                    <h2>Wall of doodles</h2>
                    {doodles &&
                        doodles.map((doodle) => (
                            <>
                                <div className="doodle-container" key={doodle.id}>
                                    <div className="doodle-img-container">
                                        <img
                                            className="doodle-img"
                                            src={doodle.image_url}
                                        ></img>
                                    </div>

                                    <p>
                                        Drawn by: {doodle.first} {doodle.last}
                                    </p>
                                </div>
                            </>
                        ))}
                </div>
            </div>
        </>
    );
}
