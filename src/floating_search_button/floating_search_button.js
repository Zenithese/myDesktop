import { gapi } from 'gapi-script';
import { debounce } from 'lodash';
import './floating_search_button.css'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Doc from '../doc/doc'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearchPlus } from '@fortawesome/free-solid-svg-icons'

export default function FloatingSearchButton({ closeSearch, setCloseSearch, driveDocuments, setDriveDocuments, folders, setFolders }) {

    const inputEl = useRef(null)
    const [className, setClassName] = useState("fsb")
    const [resultsClassName, setResultsClassName] = useState("results-closed")
    const [currentResult, setCurrentResult] = useState(0)

    useEffect(() => {
        if (closeSearch) {
            setClassName("fsb")
            setCloseSearch(false)
            setResultsClassName("results-closed")
        }
    })

    const handleClick = (e) => {
        if (e.target.className === "left-arrow" 
            || e.target.className === "right-arrow" 
            || e.target.className === "fsb-input"
            || e.target.className === "results-open"
            || e.target.id === "input") return;
        setCurrentResult(0)
        setDriveDocuments([])
        setClassName("fsb-open")
        setResultsClassName("results-open")
        inputEl.current.value = ""
        inputEl.current.focus()
    }

    const handleArrowClick = (dir) => {
        if (dir === "right") {
            setCurrentResult((currentResult + 1) % driveDocuments.length)
        } else {
            setCurrentResult(currentResult ? (currentResult - 1) % driveDocuments.length : driveDocuments.length - 1)
        }
    }

    const renderResults = () => {
        console.log(driveDocuments)
        if (driveDocuments[currentResult]) {
            const { id, name, webViewLink, iconLink } = driveDocuments[currentResult]
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
                    searchItem={true}
                    webViewLink={webViewLink}
                    iconLink={iconLink}
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
                'fields': "nextPageToken, files(kind, id, name, webViewLink, iconLink, mimeType)",
                q: searchTerm,
            })
                .then(function (response) {
                    const res = JSON.parse(response.body);
                    // res.files.forEach(file => {
                    //     if (folders[file.id]) console.log("match")
                    // })
                    // console.log(folders)
                    setDriveDocuments(res.files);
                });
        } else {
            setDriveDocuments([]);
        }
    };

    return (
        <div className="fsb-container keep-open"
            onClick={(e) => handleClick(e)}>
            <div className="fsb-left"></div>
            {resultsClassName === "results-closed" ? <div className="center-search"><FontAwesomeIcon icon={faSearchPlus} /></div> : null}
            <div className={className}>
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