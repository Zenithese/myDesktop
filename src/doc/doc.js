import './doc.css'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import ContentEditable from 'react-contenteditable'
import docImage from './filledDrive.png'
import { debounce } from 'lodash'

const API_KEY = process.env.REACT_APP_API_KEY;

export default function Doc({ id, title, parent, left, top, folders, setFolders, setCloseSearch, searchItem, webViewLink, iconLink, accessToken, dimensions }) {

    const fileEl = useRef(null)
    const [className, setClassName] = useState("file")
    const [inputClassName, setInputClassName] = useState("file-name-container")
    const [value, setValue] = useState(null)
    const [offSetX, setOffSetX] = useState(0)
    const [offSetY, setOffSetY] = useState(0)
    const [position, setPosition] = useState(parent ? "grid" : "fixed")
    const [x, setX] = useState(left)
    const [y, setY] = useState(top)
    const [z, setZ] = useState("0")
    const [nest, setNest] = useState(null)
    const [duplicate, setDuplicate] = useState(false)
    const [update, setUpdate] = useState(false)

    useEffect(() => {
        if (nest && update) {
            const nestClassName = nest.className.split(" ")
            const temp = { ...folders }

            let replace = true;
            if (duplicate) {
                if (temp[id].parent === null) {
                    alert(`${temp[id].title} already exist on the desktop`)
                    replace = false
                } else {
                    if (nest.id.slice(2) == temp[id].parent) {
                        alert(`${temp[id].title} already exist in this folder`)
                    } else if (window.confirm(`${temp[id].title} already exist in folder ${temp[temp[id].parent].title} -- move it?`)) {
                        console.log("replacing")
                    } else {
                        replace = false
                    }
                }
            }
            
            if (!temp[id]) {
                temp[id] = {
                    'top': null,
                    'left': null,
                    'title': title,
                    'parent': null,
                    'type': 'doc',
                    'webViewLink': webViewLink,
                    'iconLink': iconLink
                }
            } else if (temp[id].parent) {
                temp[temp[id].parent].children = 
                temp[temp[id].parent].children.filter(folderId => folderId !== id)
            }
            
            if (!replace) {
                setFolders(temp)
            } else if (nestClassName[1] === "droppable") {
                temp[nest.id.slice(2)].children.push(Number(id) ? Number(id) : id)
                temp[id].parent = Number(nest.id.slice(2))
                setPosition(null)
                setFolders(temp)
                nest.className = nest.className.slice(8)
            } else if (nest.id === "App") {
                console.log("effecting postion")
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
            setUpdate(false)
        }
    })

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
        if (folders[id] && e.target.closest(".keep-open")) {
            setDuplicate(true)
        } else if (duplicate) {
            setDuplicate(false)
        }
        setClassName("file")
        setZ("1000")
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
        setOffSetX(0)
        setOffSetY(0)
        setZ("0")
        setClassName("droppable file")
        setUpdate(true)
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

    const handleFocus = () => {
        setInputClassName("file-name-container-focus")
    }

    const handleBlur = () => {
        setInputClassName("file-name-container")
    }

    return (
        <div 
            id={`d-${id}`}
            ref={fileEl}
            className={className}
            style={{ "position": position, "top": Math.min(y, dimensions.height - 94), "left": Math.min(x, dimensions.width - 94), "zIndex": z }}
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
                <img draggable="false"
                    id={id}
                    className="file-icon"
                    alt=""
                    src={iconLink}
                    onMouseDown={(e) => start(e)}
                    onDoubleClick={() => handleDoubleClick()}
                />
            </div>
            <div className={inputClassName} >
                <ContentEditable
                    id="input"
                    html={value ? value : title}
                    data-column="item"
                    className="content-editable"
                    onChange={(e) => handleInput(e)}
                    onFocus={() => handleFocus()}
                    onBlur={() => handleBlur()}
                />
            </div>
        </div>
    )
}