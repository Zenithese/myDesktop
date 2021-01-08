import './contents.css'
import React, { useState, useEffect, useRef } from 'react';
import Folder from '../folder/folder';

export default function Contents({ display }) {

    const contentsEl = useRef(null)
    const [gridRow, setGridRow] = useState("")
    const [gridCol, setGridCol] = useState("")
    const [update, setUpdate] = useState(false)
    
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

    return (
        <div 
            ref={contentsEl} 
            className="droppable contents" 
            style={{ "gridTemplateColumns": gridCol, "gridTemplateRows": gridRow, "display": display }} 
            onMouseUp={() => setUpdate(!update)}>
            {/* <Folder />
            <Folder />
            <Folder />
            <Folder />
            <Folder />
            <Folder />
            <Folder />
            <Folder />
            <Folder /> */}
        </div>
    )
}