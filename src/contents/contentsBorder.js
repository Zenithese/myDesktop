import './contents.css'
import React, { useState, useEffect } from 'react';

export default function ContentsBorder({ width, setWidth, height, setHeight, setX, setY }) {

    const [section, setSection] = useState(null)
    const [startX, setStartX] = useState(null)
    const [startY, setStartY] = useState(null)
    const [startWidth, setStartWidth] = useState(null)
    const [startHeight, setStartHeight] = useState(null)
    const [offSetX, setOffSetX] = useState(0)
    const [offSetY, setOffSetY] = useState(0)

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
            setHeight(startHeight - e.pageY + startY)
            setY(e.pageY - offSetY)
        } else if (section === "side-left") {
            setWidth(startWidth - e.pageX + startX)
            setX(e.pageX - offSetX)
        } else if (section === "side-right") {
            setWidth(startWidth + e.pageX - startX)
        } else if (section === "side-bottom") {
            setHeight(startHeight + e.pageY - startY)
        } else if (section === "corner-1") {
            setWidth(startWidth - e.pageX + startX)
            setHeight(startHeight - e.pageY + startY)
            setX(e.pageX - offSetX)
            setY(e.pageY - offSetY)
        } else if (section === "corner-2") {
            setWidth(startWidth + e.pageX - startX)
            setHeight(startHeight - e.pageY + startY)
            setY(e.pageY - offSetY)
        } else if (section === "corner-3") {
            setWidth(startWidth - e.pageX + startX)
            setHeight(startHeight + e.pageY - startY)
            setX(e.pageX - offSetX)
        } else if (section === "corner-4") {
            setWidth(startWidth + e.pageX - startX)
            setHeight(startHeight + e.pageY - startY)
        }
    }

    const stop = (e) => {
        e.preventDefault()
        document.removeEventListener('mousemove', drag)
        document.removeEventListener('mouseup', stop)
        setSection(null)
    }

    return (
        <div onMouseDown={(e) => start(e)}>
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