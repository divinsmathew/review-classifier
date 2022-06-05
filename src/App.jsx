import { useState } from "react";
import "./App.css";

const Sentiment = ({ sentiment }) => {
    return (
        <div className="sentiment">
            {sentiment === "positive" ? (
                <span className="sentiment-icon positive">Positive</span>
            ) : (
                <span className="sentiment-icon negative">Negative</span>
            )}
        </div>
    );
};

const App = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [classifiedData, setClassifiedData] = useState([]);
    const [review, setReview] = useState("");
    const [inputMode, setInputMode] = useState(true);

    // const sleep = (ms) => {
    //     return new Promise((resolve) => setTimeout(resolve, ms));
    // };

    const sendRequest = async (file) => {
        const fileData = new FormData();
        fileData.append("file", file);
        setClassifiedData([]);
        setIsUploading(true);

        // await sleep(1000);
        const response = await fetch("<URL GOES HERE>", {
            method: "POST",
            body: fileData,
        });
        const data = await response.json();

        // const data = {
        //     results: {
        //         sentence_wise_sentiment: [
        //             {
        //                 sentence: "Hi I am good",
        //                 sentiment: "positive",
        //             },
        //             {
        //                 sentence: "This is bad",
        //                 sentiment: "negative",
        //             },
        //         ],
        //         sentiment: "positive",
        //         title: "It is good",
        //     },
        // };

        setClassifiedData(data.results);
        setIsUploading(false);

        if (data?.results?.length === 0) {
            alert("No results found");
            return;
        }

        setInputMode(false);
    };

    return (
        <div className="app">
            <header>
                <span>Review Classifier</span>
                <span>=</span>
            </header>
            <main>
                {inputMode && (
                    <div className="input-container">
                        <div>Enter your review here.</div>
                        <div className="warning-text">
                            Please make sure that reviews in file are free of
                            gibberish and emoticons.
                        </div>
                        <textarea
                            value={review}
                            placeholder="Enter your review here."
                            onChange={(event) => setReview(event.target.value)}
                        />
                        <button
                            className="upload-button"
                            onClick={sendRequest}
                            disabled={isUploading}
                        >
                            {isUploading ? "Submitting..." : "Submit"}
                        </button>
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
                                            {classifiedData.map(
                                                (data, index) => (
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
                                                        <td>
                                                            {data.user_name}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </article>
                        )}
                    </div>
                )}
                {!inputMode && (
                    <div className="input-container">
                        <h4>Summary</h4>

                        <div className="summary-container">
                            <div className="summary-text">
                                <span className="summary-title">Title</span>
                                <span>{classifiedData.title}</span>
                            </div>
                            <div className="summary-text">
                                <span className="summary-title">Sentiment</span>
                                <Sentiment
                                    sentiment={classifiedData.sentiment}
                                />
                            </div>
                        </div>
                        <h4>Sentence-wise sentiments</h4>
                        <table className="table table-bordered table-hover table-condensed">
                            <thead>
                                <tr>
                                    <th>Sentence</th>
                                    <th>Sentiment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classifiedData.sentence_wise_sentiment.map(
                                    (data, index) => (
                                        <tr
                                            className="classified-data"
                                            key={index}
                                        >
                                            <td>{data.sentence}</td>
                                            <td>
                                                <Sentiment
                                                    sentiment={data.sentiment}
                                                />
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>

                        <button
                            className="upload-button"
                            onClick={() => setInputMode(true)}
                            disabled={isUploading}
                        >
                            Submit New Review
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
