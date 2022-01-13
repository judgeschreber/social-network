import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import ProfilePic from "./profilepic";
import FriendButton from "./friendbutton";
import Canvas from "./canvas";
import Wall from "./thewall";

export default function OtherProfile() {
    const [user, setUsers] = useState();
    const { id } = useParams();
    console.log("id: ", id);
    const history = useHistory();
    const [friendstatus, setFriendstatus] = useState(null);

    useEffect(() => {
        //fetch the other users data
        fetch(`/otheruser/${id}`)
            .then((res) => {
                return res.json();
            })
            .then((results) => {
                console.log("we got results from otheruser: ", results);
                if (results.redirect) {
                    history.push("/");
                } else if (results.notfound) {
                    console.log("not found");
                    setUsers(null);
                } else {
                    setUsers(results);
                }
            });
    }, [id]);

    const friendship = (par) => {
        setFriendstatus(par.accepted);
    };

    return (
        <>
            {!user && <h1>No user found</h1>}
            {user && (
                <>
                    <div className="other-profile">
                        <div className="other-profile-info">
                            <h2>
                                {user.first} {user && user.last}
                            </h2>
                            <div className="big-image-container">
                                <ProfilePic imageUrl={user && user.image_url} />
                            </div>
                            <div>{user && user.bio}</div>
                            <FriendButton userId={id} friendship={friendship} />
                        </div>
                        {(friendstatus && (
                            <>
                                <div className="canvas-container">
                                    <h2 className="doodle-here">Doodle here!</h2>
                                    <Canvas />
                                </div>
                                <Wall />
                            </>
                        )) || (
                            <h2>
                                Nothing to see here, because you are not friends
                                (yet)!
                            </h2>
                        )}
                    </div>
                </>
            )}
        </>
    );
}
