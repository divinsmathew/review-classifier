import { useRef, useState } from "react";
import "./App.css";

function App() {
    const filePickerRef = useRef();
    const [selectedFileName, setSelectedFileName] =
        useState("No file selected");
    const [isUploading, setIsUploading] = useState(false);
    const [classifiedData, setClassifiedData] = useState([]);

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const fileSelected = (event) => {
        setSelectedFileName(event.target.files[0].name);
        setIsUploading(true);
        uploadFile(event.target.files[0]);

        filePickerRef.current.value = null;
    };

    const uploadFile = async (file) => {
        const fileData = new FormData();
        fileData.append("file", file);
        fileData.append("fileName", file.name);
        fileData.append("fileType", file.type);
        fileData.append("fileSize", file.size);

        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Access-Control-Allow-Origin", "http://localhost:3000");

        setClassifiedData([]);
        setIsUploading(true);

        fetch("https://flask-review-app.herokuapp.com/predict", {
            method: "POST",
            body: fileData,
            headers: headers,
        })
            .then((response) => response.json())
            .then((data) => setClassifiedData(data.results));

        await sleep(2000);
        setIsUploading(false);
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
                        disabled={isUploading}
                    >
                        {isUploading ? "Uploading..." : "Upload"}
                    </button>

                    <div className="file-selected-label">
                        {selectedFileName}
                    </div>

                    {classifiedData.length > 0 && (
                        <article>
                            <div className="title">
                                Found {classifiedData.length} Results:
                            </div>
                            <div className="classified-data-container">
                                <table className="table table-bordered table-hover table-condensed">
                                    <thead>
                                        <tr>
                                            <th>Review</th>
                                            <th>Stars</th>
                                            <th>URL</th>
                                            <th>User Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {classifiedData.map((data, index) => (
                                            <tr
                                                className="classified-data"
                                                key={index}
                                            >
                                                <td>{data.review}</td>
                                                <td>{data.star}</td>
                                                <td>
                                                    <a
                                                        href={data.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        Click to open
                                                    </a>
                                                </td>
                                                <td>{data.user_name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </article>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;
