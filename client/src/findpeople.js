import { useState, useEffect } from "react";

export default function Findpeople() {
    const [users, setUsers] = useState();
    const [searchTerm, setSearchTerm] = useState();
    //get user data from db when mounted

    useEffect(() => {
        if (!users || !searchTerm)
            fetch("/getpeople")
                .then((result) => {
                    return result.json();
                })
                .then((result) => {
                    console.log("json result in mount fetch; ", result);
                    setUsers(result);
                });
        else {
            fetch("/findpeople.json", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    searchterm: searchTerm,
                }),
            })
                .then((result) => {
                    return result.json();
                })
                .then((result) => {
                  
                    setUsers(result);
                });
        }
    }, [searchTerm]);

    const updateUsersList = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>
            <div className="find-people-top">
                <h2>Find people</h2>
                <input type="text" onChange={updateUsersList} />
            </div>
            <div className="find-three">
                {users &&
                    users.map((user) => (
                        <a
                            key={user.id}
                            href={`/user/${user.id}`}
                            className="person"
                        >
                            <div className="find-person-img-container">
                                <img
                                    className="profile-pic"
                                    src={user.image_url}
                                ></img>
                            </div>
                            <p key={user.id}>
                                {user.first} {user.last}
                            </p>
                        </a>
                    ))}
            </div>
        </>
    );
}
