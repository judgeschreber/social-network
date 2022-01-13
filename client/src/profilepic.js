export default function ProfilePic({ first, last, imageUrl, showUploader }) {
    imageUrl = imageUrl || "default.png";
    return (
        <>
            <img
                className="profile-pic"
                src={imageUrl}
                alt={`${first} ${last}`}
                onClick={showUploader}
            />
        </>
    );
}
