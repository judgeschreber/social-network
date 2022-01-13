import { Component } from "react";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.upload = this.upload.bind(this);
    }

    setFile(e) {
        this.file = e.target.files[0];
    }
    upload() {
        const formData = new FormData();
        formData.append("file", this.file);
        fetch("/upload.json", {
            method: "POST",
            body: formData,
        })
            .then((result) => {
                return result.json();
            })
            .then((result) => {

                this.props.getImageUrl(result.url);
            })
            .catch((err) =>
                console.log("something isnt working in fetch: ", err)
            );
    }
    render() {
        return (
            <>
                <div className="photo-modal" onClick={this.props.showUploader}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="photo-modal-center"
                    >
                        <h2>Upload Photo</h2>
                        <div className="upload-area">
                            <div>
                                <input
                                    className="file-input"
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => this.setFile(e)}
                                />
                                <label htmlFor="file" className="file-label">
                                    Choose a file
                                </label>
                                <button onClick={() => this.upload()}>
                                    Upload
                                </button>
                            </div>
                        </div>
                        <button onClick={this.props.showUploader}>
                            Go back
                        </button>
                    </div>
                </div>
            </>
        );
    }
}
