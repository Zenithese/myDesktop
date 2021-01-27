import './contents.css'
import React, { useState, useEffect, useRef } from 'react'
import ContentsBorder from './contentsBorder'
import Folder from '../folder/folder'
import Doc from '../doc/doc'

export default function Contents({ id, children, folders, setFolders, contentX, contentY, contentWidth, contentHeight, dimensions, opened, setOpened, accessToken }) {

    const contentsEl = useRef(null)
    const contentsContainerEl = useRef(null)
    const [gridRow, setGridRow] = useState("")
    const [gridCol, setGridCol] = useState("")
    const [offSetX, setOffSetX] = useState(0)
    const [offSetY, setOffSetY] = useState(0)
    const [x, setX] = useState(contentX)
    const [y, setY] = useState(contentY)
    const [className, setClassName] = useState("droppable contents")
    const [width, setWidth] = useState(contentWidth)
    const [height, setHeight] = useState(contentHeight)
    const [dropped, setdropped] = useState(false)

    useEffect(() => {
        const contents = contentsEl.current
        const width = contents.clientWidth
        const height = contents.clientHeight
        const row = Math.floor(height / 100)
        const col = Math.floor(width / 100)
        setGridRow("100px ".repeat(row))
        setGridCol("100px ".repeat(col))
        const children = contents.children
        for (let i = 0; i < children.length; i++) {
            children[i].style.gridRowStart = Math.floor(i / col) + 1
            children[i].style.gridColumnStart = (i + 1) % col || col
        }
    })

    useEffect(() => {
        if (offSetY) {
            document.addEventListener('mousemove', drag)
            document.addEventListener('mouseup', stop)
        }
    }, [offSetY])

    useEffect(() => {
        if (dropped) {
            const temp = { ...folders }
            temp[id.slice(2)].contentX = x
            temp[id.slice(2)].contentY = y
            setFolders(temp)
            setdropped(false)
        }
    }, [dropped, folders, id, x, y, setFolders])

    const start = (e) => {
        if (e.target.className === "close-button" || e.target.className === "back-button") return
        setClassName("contents")
        setOffSetX(e.pageX - e.target.getBoundingClientRect().left)
        setOffSetY(e.pageY - e.target.getBoundingClientRect().top)
    }

    const drag = (e) => {
        e.preventDefault()
        if (contentsContainerEl.current) {
            setY(Math.min(Math.max(0, e.pageY - offSetY), document.body.clientHeight - contentsContainerEl.current.offsetHeight))
            setX(Math.min(Math.max(0, e.pageX - offSetX), document.body.clientWidth - contentsContainerEl.current.offsetWidth))
        }
    }

    const stop = (e) => {
        e.preventDefault()
        setOffSetX(0)
        setOffSetY(0)
        setClassName("droppable contents")
        setdropped(true)
        document.removeEventListener('mousemove', drag)
        document.removeEventListener('mouseup', stop)
    }

    const handleClose = () => {
        const _id = Number(id.slice(2))
        setOpened(prev => prev.filter(id => id !== _id))
    }

    const handleBack = () => {
        const _id = Number(id.slice(2))
        const border = document.getElementById(`b-${folders[_id].parent}`)
        if (border) {
            border.className = "flash"
            setTimeout(() => {
                border.className = ""
            }, 2000);
            return
        }
        if (folders[_id].parent) {
            setOpened(prev => {
                const temp = { ...folders }
                temp[folders[_id].parent].contentX = temp[_id].contentX
                temp[folders[_id].parent].contentY = temp[_id].contentY
                temp[folders[_id].parent].contentWidth = temp[_id].contentWidth
                temp[folders[_id].parent].contentHeight = temp[_id].contentHeight
                setFolders(temp)
                prev = prev.filter(id => id !== _id)
                return [...prev, Number(folders[_id].parent)]
            })
        }
    }

    const handleMouseDown = (e) => {
        if (e.target.className === "close-button" || e.target.className === "folder-image" || e.target.className === "file-image" || e.target.className === "back-button") return
        document.querySelector(".App").appendChild(contentsContainerEl.current)
    }

    const renderChildren = children.map(child => {
        return (
            folders[child].type ? 
            <Doc 
                id={child}
                top={folders[child].top}
                left={folders[child].left}
                title={folders[child].title}
                parent={folders[child].parent}
                webViewLink={folders[child].webViewLink}
                iconLink={folders[child].iconLink}
                folders={folders}
                setFolders={setFolders}
                accessToken={accessToken}
                dimensions={dimensions}
                key={child}
            />
            :
            <Folder 
                id={child}
                top={folders[child].top}
                left={folders[child].left} 
                title={folders[child].title} 
                children={folders[child].children} 
                parent={folders[child].parent} 
                folders={folders}
                setFolders={setFolders}
                dimensions={dimensions}
                opened={opened}
                setOpened={setOpened}
                key={child} 
            />
        )
    })

    return (
        <div ref={contentsContainerEl}
            className="contents-container"
            onMouseDown={(e) => handleMouseDown(e)}
            style={{ "display": "grid", "top": Math.min(y, dimensions.height - height - 5), "left": Math.min(x, dimensions.width - width - 5), "width": `${width}px`, "height": `${height}px` }}>
            <ContentsBorder 
                id={id.slice(2)}
                width={width} 
                setWidth={setWidth} 
                height={height} 
                setHeight={setHeight} 
                setX={setX} 
                setY={setY} 
                folders={folders}
                setFolders={setFolders} />
            <div className="contents-handle"
                onMouseDown={(e) => start(e)}>
                <div className="close-button" onClick={() => handleClose()}>&#10006;</div>
                <div className="back-button" onClick={() => handleBack()}>&#x25C0;</div>
            </div>
            <div
                id={id}
                ref={contentsEl}
                className={className}
                style={{ "gridTemplateColumns": gridCol, "gridTemplateRows": gridRow, "width": `${width}px`, "height": `${height - 15}px` }}>
                {renderChildren}
            </div>
        </div>
    )
}