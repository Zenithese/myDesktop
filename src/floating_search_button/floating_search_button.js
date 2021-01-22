import { gapi } from 'gapi-script';
import { debounce } from 'lodash';
import './floating_search_button.css'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Doc from '../doc/doc'

export default function FloatingSearchButton({ closeSearch, setCloseSearch, driveDocuments, setDriveDocuments, folders, setFolders }) {

    const inputEl = useRef(null)
    const [className, setClassName] = useState("fsb")
    const [resultsClassName, setResultsClassName] = useState("results-closed")
    const results = ["blue", "red", "green", "yellow", "orange"]
    const [currentResult, setCurrentResult] = useState(0)

    useEffect(() => {
        if (closeSearch) {
            setClassName("fsb")
            setCloseSearch(false)
            setResultsClassName("results-closed")
        }
    })

    const handleClick = (e) => {
        // if (className === "fsb-open" && e.target.className === "fsb-input") return;
        // if (className === "fsb") {
        //     setClassName("fsb-open")
        //     setResultsClassName("results-open")
        //     inputEl.current.focus()
        // } else {
        //     setClassName("fsb")
        //     setResultsClassName("results-closed")
        // }
        setDriveDocuments([])
        setClassName("fsb-open")
        setResultsClassName("results-open")
        inputEl.current.value = ""
        inputEl.current.focus()
    }

    const handleArrowClick = () => {
        if ("right") {
            setCurrentResult((currentResult + 1) % driveDocuments.length)
        } else {
            setCurrentResult((currentResult - 1) % driveDocuments.length)
        }
    }

    const renderResults = () => {
        if (driveDocuments[currentResult]) {
            const { id, name, webViewLink } = driveDocuments[currentResult]
            return (
                <Doc
                    id={id}
                    title={name}
                    folders={folders}
                    left={null}
                    top={null}
                    parent={"search"}
                    setFolders={setFolders}
                    setCloseSearch={setCloseSearch}
                    setDriveDocuments={setDriveDocuments}
                    searchItem={true}
                    webViewLink={webViewLink}
                />
            )
        }
    }

    const handleChange = (e) => {
        delayedQuery(e.target.value.length ? `name contains '${e.target.value}'` : null);
    }

    const delayedQuery = useCallback(
        debounce((q) => listFiles(q), 500),
        []
    );

    const listFiles = (searchTerm = null) => {
        if (searchTerm) {
            gapi.client.drive.files.list({
                pageSize: 10,
                'fields': "nextPageToken, files(kind, id, name, webViewLink, iconLink, mimeType, description)",
                q: searchTerm,
            })
                .then(function (response) {
                    const res = JSON.parse(response.body);
                    setDriveDocuments(res.files);
                    console.log(res.files)
                });
        } else {
            setDriveDocuments([]);
        }
    };

    return (
        <div className="fsb-container keep-open"
            onClick={(e) => handleClick(e)}>
            <div className="fsb-left"></div>
            <div className={className}>
                {/* &#128269; */}
                <input ref={inputEl} className="fsb-input" onChange={(e) => handleChange(e)}></input>
            </div>
            <div className="fsb-right"></div>
            {
                driveDocuments[currentResult] ?
                    <div
                        id={resultsClassName}
                        className={resultsClassName}>
                        <div className="left-arrow" onClick={() => handleArrowClick("left")}></div>
                        <div id="results-container" className="results-container">
                            {renderResults()}
                        </div>
                        <div className="right-arrow" onClick={() => handleArrowClick("right")}></div>
                    </div>
                    :
                    null
            }
        </div>
    )
}