import './contents.css'
import React, { useState, useEffect } from 'react';

export default function ContentsBorder({ id, width, setWidth, height, setHeight, setX, setY, folders, setFolders }) {

    const [section, setSection] = useState(null)
    const [startX, setStartX] = useState(null)
    const [startY, setStartY] = useState(null)
    const [startWidth, setStartWidth] = useState(null)
    const [startHeight, setStartHeight] = useState(null)
    const [offSetX, setOffSetX] = useState(0)
    const [offSetY, setOffSetY] = useState(0)
    const [finished, setFinished] = useState(false)

    useEffect(() => {
        if (finished) {
            const temp = { ...folders }
            temp[id].contentWidth = width
            temp[id].contentHeight = height
            setFolders(temp)
            setFinished(false)
        }
    })

    useEffect(() => {
        if (section) {
            document.addEventListener('mousemove', drag)
            document.addEventListener('mouseup', stop)
        }
    }, [section])

    const start = (e) => {
        setSection(e.target.className)
        setStartX(e.pageX)
        setStartY(e.pageY)
        setStartWidth(width)
        setStartHeight(height)
        setOffSetX(e.pageX - e.target.getBoundingClientRect().right)
        setOffSetY(e.pageY - e.target.getBoundingClientRect().bottom)
    }

    const drag = (e) => {
        e.preventDefault()
        if (section === "side-top") {
            setHeight(Math.max(startHeight - e.pageY + startY, 150))
            setY(Math.min(e.pageY - offSetY, startY + startHeight - offSetY - 150))
        } else if (section === "side-left") {
            setWidth(Math.max(startWidth - e.pageX + startX, 150))
            setX(Math.min(e.pageX - offSetX, startX + startWidth - offSetX - 150))
        } else if (section === "side-right") {
            setWidth(Math.max(startWidth + e.pageX - startX, 150))
        } else if (section === "side-bottom") {
            setHeight(Math.max(startHeight + e.pageY - startY, 150))
        } else if (section === "corner-1") {
            setWidth(Math.max(startWidth - e.pageX + startX, 150))
            setHeight(Math.max(startHeight - e.pageY + startY, 150))
            setX(Math.min(e.pageX - offSetX, startX + startWidth - offSetX - 150))
            setY(Math.min(e.pageY - offSetY, startY + startHeight - offSetY - 150))
        } else if (section === "corner-2") {
            setWidth(Math.max(startWidth + e.pageX - startX, 150))
            setHeight(Math.max(startHeight - e.pageY + startY, 150))
            setY(Math.min(e.pageY - offSetY, startY + startHeight - offSetY - 150))
        } else if (section === "corner-3") {
            setWidth(Math.max(startWidth - e.pageX + startX, 150))
            setHeight(Math.max(startHeight + e.pageY - startY, 150))
            setX(Math.min(e.pageX - offSetX, startX + startWidth - offSetX - 150))
        } else if (section === "corner-4") {
            setWidth(Math.max(startWidth + e.pageX - startX, 150))
            setHeight(Math.max(startHeight + e.pageY - startY, 150))
        }
    }

    const stop = (e) => {
        e.preventDefault()
        document.removeEventListener('mousemove', drag)
        document.removeEventListener('mouseup', stop)
        setSection(null)
        setFinished(true)
    }

    return (
        <div id={`b-${id}`} onMouseDown={(e) => start(e)}>
            <div className="corner-1"></div>
            <div className="corner-2"></div>
            <div className="corner-3"></div>
            <div className="corner-4"></div>
            <div className="side-top" style={{ "width": width }}></div>
            <div className="side-left" style={{ "height": height }}></div>
            <div className="side-right" style={{ "height": height }}></div>
            <div className="side-bottom" style={{ "width": width }}></div>
        </div>
    )
}