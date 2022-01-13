import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";

export default function Profile({ first, last, imageUrl, bio, updateBio }) {
    return (
        <div className="myprofile">
            <h2>{first} {last}</h2>
            <div className="big-image-container">
                <ProfilePic imageUrl={imageUrl} />
            </div>
            <div className="bio">{bio}</div>
            <BioEditor bio={bio} updateBio={updateBio} />
        </div>
    );
}
