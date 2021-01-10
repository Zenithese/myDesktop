import './contents.css'
import React, { useState, useEffect, useRef } from 'react';
import ContentsBorder from './contentsBorder'
import Folder from '../folder/folder';

export default function Contents({ display, setDisplay, contentsContainerEl, id, children, folders }) {

    const contentsEl = useRef(null)
    const [gridRow, setGridRow] = useState("")
    const [gridCol, setGridCol] = useState("")
    const [update, setUpdate] = useState(false)
    const [offSetX, setOffSetX] = useState(0)
    const [offSetY, setOffSetY] = useState(0)
    const [x, setX] = useState(300)
    const [y, setY] = useState(300)
    const [z, setZ] = useState("1")
    const [className, setClassName] = useState("droppable contents")
    const [width, setWidth] = useState(300)
    const [height, setHeight] = useState(300)

    useEffect(() => {
        console.log(display)
        const contents = contentsEl.current
        const width = contents.clientWidth
        const height = contents.clientHeight
        const row = Math.floor(height / 100)
        const col = Math.floor(width / 100)
        setGridRow("100px ".repeat(row))
        setGridCol("100px ".repeat(col))
        const children = contents.children
        for (let i = 0; i < children.length; i++) {
            children[i].style.gridRowStart = Math.floor(i / row) + 1
            children[i].style.gridColumnStart = (i + 1) % col || col
        }
    })

    useEffect(() => {
        if (offSetY) {
            document.addEventListener('mousemove', drag)
            document.addEventListener('mouseup', stop)
        }
    }, [offSetY])

    const start = (e) => {
        if (e.target.className === "close-button") return
        setClassName("contents")
        setZ("1000")
        document.querySelector(".App").appendChild(contentsContainerEl.current)
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
        setZ("1")
        setClassName("droppable contents")
        document.removeEventListener('mousemove', drag)
        document.removeEventListener('mouseup', stop)
    }

    const handleClose = () => {
        setDisplay("none")
    }

    const renderChildren = () => {
        const render = []
        for (const child in children) {
            render.push(<Folder children={folders[child].children} />)
        }
        return render
    }

    return (
        <div ref={contentsContainerEl}
            className="contents-container"
            style={{
                "display": display, "top": y, "left": x, "zIndex": z, "width": `${width}px`, "height": `${height}px` }}>
            <ContentsBorder width={width} setWidth={setWidth} height={height} setHeight={setHeight} setX={setX} setY={setY} />
            <div className="contents-handle"
                onMouseDown={(e) => start(e)}>
                <div className="close-button" onClick={() => handleClose()}>x</div>
            </div>
            <div
                id={id}
                ref={contentsEl}
                className={className}
                style={{ "gridTemplateColumns": gridCol, "gridTemplateRows": gridRow, "width": `${width}px`, "height": `${height - 15}px` }}
                onMouseUp={() => setUpdate(!update)}>
                {renderChildren()}
            </div>
        </div>
    )
}