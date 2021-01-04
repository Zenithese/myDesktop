import './folder.css'
import React, { useState, useEffect, useRef } from 'react';
import ContentEditable from 'react-contenteditable'

export default function Folder() {

    const [value, setValue] = useState("New Folder")
    const [moving, setMoving] = useState(false)
    const [offSetX, setOffSetX] = useState(0)
    const [offSetY, setOffSetY] = useState(0)
    const [x, setX] = useState(0)
    const [y, setY] = useState(0)
    const [z, setZ] = useState("0")
    const [className, setClassName] = useState("folder droppable")
    const folderEl = useRef(null)

    useEffect(() => {
        if (moving) {
            document.addEventListener('mousemove', drag)
            document.addEventListener('mouseup', stop)
        }
    }, [moving])

    const handleInput = (e) => {
        setValue(e.target.value)
    }

    const start = (e) => {
        if (e.target.className === "folder-image") {
            setOffSetX(e.pageX - e.target.getBoundingClientRect().left + 5)
            setOffSetY(e.pageY - e.target.getBoundingClientRect().top + 5)
            setMoving(true)
        }
    }

    const drag = (e) => {
        e.preventDefault()
        setClassName("folder")
        setY(Math.min(Math.max(e.pageY - offSetY, 0), document.body.clientHeight - folderEl.current.offsetHeight))
        setX(Math.min(Math.max(e.pageX - offSetX, 0), document.body.clientWidth - folderEl.current.offsetWidth))
        setZ("1000")
        nestFolder(e)
    }

    const stop = (e) => {
        e.preventDefault()
        setOffSetX(0)
        setOffSetY(0)
        setMoving(false)
        setZ("0")
        setClassName("folder droppable")
        document.removeEventListener('mousemove', drag)
        document.removeEventListener('mouseup', stop)
    }

    const nestFolder = (e) => {
        e.preventDefault()
        const folder = e.target.parentElement ? e.target.parentElement.parentElement : null;
        if (folder) {
            folder.hidden = true
            const nest = document.elementFromPoint(e.clientX, e.clientY)
            if (nest && nest.closest(".droppable")) {
                nest.closest(".droppable").className = "folder droppable current-droppable"
            } else {
                document.querySelector(".droppable").className = "folder droppable"
            }
            folder.hidden = false
        }
    }

    return (
        <div
            ref={folderEl}
            className={className}
            onMouseDown={(e) => start(e)}
            style={{ "position": "absolute", "top": y, "left": x, "zIndex": z }}>
            <div className="folder-image-container">
                <img className="folder-image" alt="" src="http://icon-park.com/imagefiles/folder_icon_yellow.png" />
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