import { useRef, useState } from "react";
import "./App.css";

function App() {
    const filePickerRef = useRef();
    const [selectedFileName, setSelectedFileName] =
        useState("No file selected");
    const [isUploadButtonDisabled, setIsUploadButtonDisabled] = useState(false);

    const fileSelected = (event) => {
        setSelectedFileName(event.target.files[0].name);
        setIsUploadButtonDisabled(true);
        uploadFile(event.target.files[0]);
    };

    const uploadFile = (file) => {
        const fileData = new FormData();
        fileData.append("file", file);
        fileData.append("fileName", file.name);
        fileData.append("fileType", file.type);
        fileData.append("fileSize", file.size);

        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Access-Control-Allow-Origin", "http://localhost:3000");

        fetch("https://flask-review-app.herokuapp.com/predict", {
            method: "POST",
            body: fileData,
            headers: headers,
        })
            .then((response) => {
                console.log(response);
                return response.json();
            })
            .then((data) => {
                console.log(data);
            });
    };

    return (
        <div className="app">
            <header>
                <span>Review Classifier</span>
                <span>=</span>
            </header>
            <main>
                <div className="input-container">
                    <div>Upload your CSV dataset here:</div>
                    <input
                        ref={filePickerRef}
                        type="file"
                        id="file-picker"
                        accept=".csv"
                        onChange={fileSelected}
                    />

                    <button
                        className="upload-button"
                        onClick={() => filePickerRef.current.click()}
                        disabled={isUploadButtonDisabled}
                    >
                        {isUploadButtonDisabled ? "Uploading..." : "Upload"}
                    </button>

                    <div className="file-selected-label">
                        {selectedFileName}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;
