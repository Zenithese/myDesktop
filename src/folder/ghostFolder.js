import './folder.css'
import React, { useState, useEffect, useRef } from 'react';
import ContentEditable from 'react-contenteditable';
import Placeholder from './placeholder';

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

    useEffect(() => {
        if (offSetY) {
            // document.addEventListener('drag', drag)
            // document.addEventListener('ondrop', handleDrop)
            document.addEventListener('mouseup', stop)
        }
    }, [offSetY])

    // useEffect(() => {
    //     if (position === null) {
    //         setOffSetY(0)
    //         setOffSetX(0)
    //         setY(nest.getBoundingClientRect().top + 5)
    //         setX(nest.getBoundingClientRect().left + 5)
    //     }
    // }, [position])

    const handleInput = (e) => {
        setValue(e.target.value)
    }

    const setImage = (e) => {
        e.stopPropagation();
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setDragImage(
            folderEl.current, 
            e.pageX - e.target.getBoundingClientRect().left + 5, 
            e.pageY - e.target.getBoundingClientRect().top + 5
        );
        // e.dataTransfer.setData('text/plain', folderEl.current.id);
        setMoving(true)
        setPosition("absolute")
        setClassName("folder")
        setZ("1000")
        setOffSetX(e.pageX - e.target.getBoundingClientRect().left + 5)
        setOffSetY(e.pageY - e.target.getBoundingClientRect().top + 5)
        document.querySelector(".App").appendChild(folderEl.current)
    }

    const drag = (e) => {
        e.stopPropagation();
        console.log("drag")
    }

    function handleDrop(e) {
        console.log("drop")
        e.stopPropagation(); // stops the browser from redirecting.
        return false;
    }

    const stop = (e) => {
        console.log("over")
        e.preventDefault()
        e.stopPropagation();
        nestFolder(e)
        setY(Math.min(Math.max(0, e.pageY - offSetY), document.body.clientHeight - folderEl.current.offsetHeight))
        setX(Math.min(Math.max(0, e.pageX - offSetX), document.body.clientWidth - folderEl.current.offsetWidth))
        setOffSetX(0)
        setOffSetY(0)
        setMoving(false)
        setZ("0")
        setClassName("droppable folder")
        // document.removeEventListener('drag', drag)
        // document.removeEventListener('ondrop', handleDrop)
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
        <div
            id="ghostfolder"
            draggable="true"
            ref={folderEl}
            className={className}
            style={{ "position": position, "top": y, "left": x, "zIndex": z }}>
            <div className="folder-image-container">
                <img className="folder-image" 
                alt="" 
                src="http://icon-park.com/imagefiles/folder_icon_yellow.png" 
                onDragStart={(e) => setImage(e)}
                onDrop={(e) => handleDrop(e)}/>
            </div>
            <div className="folder-name-container" >
                <ContentEditable
                    id="input"
                    html={value}
                    data-column="item"
                    className="content-editable"
                    onChange={(e) => handleInput(e)} />
            </div>
        </div>
    )
}