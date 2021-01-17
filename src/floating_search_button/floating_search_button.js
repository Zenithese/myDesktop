import './floating_search_button.css'
import React, { useState, useEffect, useRef } from 'react';
import Doc from '../doc/doc'

export default function FloatingSearchButton({ closeSearch, setCloseSearch, driveDocuments }) {

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
        setClassName("fsb-open")
        setResultsClassName("results-open")
        inputEl.current.focus()
    }

    const handleArrowClick = () => {
        if ("right") {
            setCurrentResult((currentResult + 1) % results.length)
        } else {
            setCurrentResult((currentResult - 1) % results.length)
        }
    }

    const renderResults = () => {
        // const render = [];
        // for (let i = 0; i < 3; i ++) {

        // }
        console.log(driveDocuments)
        return (
            // <div className="search-item" style={{ "backgroundColor": results[currentResult] }}></div>
            <Doc id={"doc"} title={"New Doc"}/>
        )
    }

    return (
        <div className="fsb-container keep-open" onClick={(e) => handleClick(e)}>
            <div className="fsb-left"></div>
            <div className={className}>
                <input ref={inputEl} className="fsb-input"></input>
            </div>
            <div className="fsb-right"></div>
            <div className={resultsClassName}>
                <div className="left-arrow" onClick={() => handleArrowClick("left")}></div>
                {renderResults()}
                <div className="right-arrow" onClick={() => handleArrowClick("right")}></div>
            </div>
        </div>
    )
}