import './doc.css'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import ContentEditable from 'react-contenteditable'
import docImage from './blue_file_icon.png'
import { debounce } from 'lodash'

const API_KEY = process.env.REACT_APP_API_KEY;

export default function Doc({ id, title, parent, left, top, folders, setFolders, setCloseSearch, searchItem, webViewLink, accessToken }) {

    const fileEl = useRef(null)
    const [className, setClassName] = useState("file")
    const [value, setValue] = useState(null)
    const [moving, setMoving] = useState(false)
    const [offSetX, setOffSetX] = useState(0)
    const [offSetY, setOffSetY] = useState(0)
    const [position, setPosition] = useState(parent ? "grid" : "fixed")
    const [x, setX] = useState(left)
    const [y, setY] = useState(top)
    const [z, setZ] = useState("0")
    const [nest, setNest] = useState(null)
    const [originalPos, setOriginalPos] = useState([0, 0])

    useEffect(() => {
        let mounted = true
        if (!moving && nest && mounted) {
            if (nest.id.slice(2) === fileEl.current.id.slice(2)) {
                setX(originalPos[0])
                setY(originalPos[1])
                return
            }
            const nestClassName = nest.className.split(" ")
            const temp = { ...folders }
            
            if (!temp[id]) {
                temp[id] = {
                    'top': null,
                    'left': null,
                    'title': title,
                    'parent': null,
                    'type': 'doc',
                    'webViewLink': webViewLink
                }
            } else if (temp[id].parent) {
                temp[temp[id].parent].children = 
                temp[temp[id].parent].children.filter(folderId => folderId !== id)
            }

            if (nestClassName[1] === "droppable") {
                temp[nest.id.slice(2)].children.push(Number(id) ? Number(id) : id)
                temp[id].parent = Number(nest.id.slice(2))
                setPosition(null)
                setFolders(temp)
                nest.className = nest.className.slice(8)
            } else if (nest.id === "App") {
                temp[id].parent = null
                temp[id].top = y
                temp[id].left = x
                setFolders(temp)
            }
            if (searchItem) {
                document.getElementById("results-container").appendChild(fileEl.current)
                setY(null)
                setX(null)
            }
            return function cleanup() { mounted = false }
        }
    }, [moving])

    useEffect(() => {
        if (offSetY) {
            document.addEventListener('mousemove', drag)
            document.addEventListener('mouseup', stop)
        }
    }, [offSetY])

    useEffect(() => {
        if (position === null) {
            setY(nest.getBoundingClientRect().top)
            setX(nest.getBoundingClientRect().left + 3)
            setPosition("grid")
        } else if (position === "fixed") {
            if (parent !== null) {
                document.querySelector(".App").appendChild(fileEl.current)
            }
        }
    }, [position])

    const start = (e) => {
        setOriginalPos([x, y])
        setClassName("file")
        setZ("1000")
        setMoving(true)
        setOffSetX(e.pageX - e.target.getBoundingClientRect().left + 5)
        setOffSetY(e.pageY - e.target.getBoundingClientRect().top + 5)
    }

    const drag = (e) => {
        e.preventDefault()
        if (position !== "fixed") setPosition("fixed")
        if (fileEl.current) {
            setY(Math.min(Math.max(0, e.pageY - offSetY), document.body.clientHeight - fileEl.current.offsetHeight))
            setX(Math.min(Math.max(0, e.pageX - offSetX), document.body.clientWidth - fileEl.current.offsetWidth))
        }
        nestFolder(e)
    }

    const stop = (e) => {
        e.preventDefault()
        if (parent !== null && document.getElementById(`c-${parent}`) && e.target.parentElement.parentElement.parentElement.id === "App") {
            document.getElementById(`c-${parent}`).appendChild(fileEl.current)
        }
        setMoving(false)
        setOffSetX(0)
        setOffSetY(0)
        setZ("0")
        setClassName("droppable file")
        if (!nest && !parent) setNest(document.querySelector(".App"))
        document.removeEventListener('mousemove', drag)
        document.removeEventListener('mouseup', stop)
    }

    const nestFolder = (e) => {
        e.preventDefault()
        const doc = e.target.parentElement ? e.target.parentElement.parentElement : null;
        if (doc) {
            doc.hidden = true
            let nestable = document.elementFromPoint(e.clientX, e.clientY)
            if (document.getElementById("results-open") && nestable.className !== "results-container") {
                setCloseSearch(true)
                setNest(document.querySelector(".App"))
            }
            if (nestable = nestable.closest(".droppable")) {
                if (nestable.className.slice(0, 7) !== "current") {
                    nestable.className = "current " + nestable.className
                    setNest(nestable)
                }
            } else if (nestable = document.querySelector(".current")) {
                nestable.className = nestable.className.slice(8)
                setNest(document.querySelector(".App"))
            }
            doc.hidden = false
        }
    }

    const handleInput = (e) => {
        const name = e.target.value.replace(/&nbsp;/g, " ")
        setValue(name)
        delayedQuery(name.length ? name : null);
    }

    const delayedQuery = useCallback(
        debounce((name) => renameDriveFile(id, name), 500),
        []
    );

    function renameDriveFile(fileId, name) {
        fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?key=${API_KEY}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'name': `${name}` }),
            method: 'PATCH'
        })
    }

    const handleDoubleClick = () => {
        window.open(webViewLink)
    }

    return (
        <div 
            id={`d-${id}`}
            ref={fileEl}
            className={className}
            style={{ "position": position, "top": y, "left": x, "zIndex": z }}
            >
            <div className="file-image-container">
                <img draggable="false"
                    id={id}
                    className="file-image"
                    alt=""
                    src={docImage}
                    onMouseDown={(e) => start(e)}
                    onDoubleClick={() => handleDoubleClick()}
                />
            </div>
            <div className="file-name-container" >
                <ContentEditable
                    id="input"
                    html={value ? value : title}
                    data-column="item"
                    className="content-editable"
                    onChange={(e) => handleInput(e)}
                />
            </div>
        </div>
    )
}