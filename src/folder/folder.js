import './folder.css';
import React, { useState, useEffect, useRef } from 'react';
import ContentEditable from 'react-contenteditable';
import Contents from '../contents/contents';

export default function Folder() {

    const [value, setValue] = useState("New Folder")
    const [moving, setMoving] = useState(false)
    const [offSetX, setOffSetX] = useState(0)
    const [offSetY, setOffSetY] = useState(0)
    const [position, setPosition] = useState("absolute")
    const [x, setX] = useState(0)
    const [y, setY] = useState(0)
    const [z, setZ] = useState("0")
    const [className, setClassName] = useState("droppable folder")
    const [nest, setNest] = useState(document.querySelector(".App"))
    const [gridRowStart, setGridRowStart] = useState("auto")
    const [gridColStart, setGridColStart] = useState("auto")
    const [display, setDisplay] = useState("none")
    const folderEl = useRef(null)

    useEffect(() => {
        if (moving) {
            // setOffSetX(event.pageX - event.target.getBoundingClientRect().left + 5)
            // setOffSetY(event.pageY - event.target.getBoundingClientRect().top + 5)
            // document.querySelector(".App").appendChild(folderEl.current)
        } else if (nest) {
            if (nest.className.split(" ")[1] === "droppable" || nest.className === "App") {
                if (nest.className.split(" ")[2] === "contents") {
                    nest.appendChild(folderEl.current)
                    setPosition(null)
                }
            }
        }
    }, [moving])

    useEffect (() => {
        if (offSetY) {
            document.addEventListener('mousemove', drag)
            document.addEventListener('mouseup', stop)
        }
    }, [offSetY])

    useEffect(() => {
        if (position === null) {
            setOffSetY(0)
            setOffSetX(0)
            setY(nest.getBoundingClientRect().top + 5)
            setX(nest.getBoundingClientRect().left + 5)
        }
    }, [position])

    const handleInput = (e) => {
        setValue(e.target.value)
    }

    const start = (e) => {
        setMoving(true)
        setPosition("absolute")
        setClassName("folder")
        setZ("1000")
        setOffSetX(e.pageX - e.target.getBoundingClientRect().left + 5)
        setOffSetY(e.pageY - e.target.getBoundingClientRect().top + 5)
        setTimeout(() => document.querySelector(".App").appendChild(folderEl.current), 300);
    }

    const drag = (e) => {
        e.preventDefault()
        if (folderEl.current) {
            if (display !== "none") setDisplay("none")
            setY(Math.min(Math.max(0, e.pageY - offSetY), document.body.clientHeight - folderEl.current.offsetHeight))
            setX(Math.min(Math.max(0, e.pageX - offSetX), document.body.clientWidth - folderEl.current.offsetWidth))
        }
        nestFolder(e)
    }

    const stop = (e) => {
        e.preventDefault()
        setOffSetX(0)
        setOffSetY(0)
        setMoving(false)
        setZ("0")
        setClassName("droppable folder")
        document.removeEventListener('mousemove', drag)
        document.removeEventListener('mouseup', stop)
    }

    const nestFolder = (e) => {
        e.preventDefault()
        const folder = e.target.parentElement ? e.target.parentElement.parentElement : null;
        if (folder) {
            folder.hidden = true
            let nestable = document.elementFromPoint(e.clientX, e.clientY)
            if (nestable = nestable.closest(".droppable")) {
                if (nestable.className.slice(0, 7) !== "current") {
                    nestable.className = "current " + nestable.className
                    setNest(nestable)
                }
            } else if (nestable = document.querySelector(".current")) {
                nestable.className = nestable.className.slice(8)
                setNest(document.querySelector(".App"))
            }
            folder.hidden = false
        }
    }

    return (
        <div ref={folderEl}
            className={className}
            style={{ "position": position, "top": y, "left": x, "zIndex": z }}>
            <div className="folder-image-container">
                <img 
                    className="folder-image"
                    alt="" 
                    src="http://icon-park.com/imagefiles/folder_icon_yellow.png"
                    onMouseDown={(e) => start(e)} 
                    onDoubleClick={() => setDisplay("grid")} />
            </div>
            <div className="folder-name-container" >
                <ContentEditable
                    id="input"
                    html={value}
                    data-column="item"
                    className="content-editable"
                    onChange={(e) => handleInput(e)} />
            </div>
            <Contents display={display} setDisplay={setDisplay} />
        </div>
    )
}