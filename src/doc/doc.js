import './doc.css'
import React, { useState, useEffect, useRef } from 'react'
import ContentEditable from 'react-contenteditable';
import docImage from './blue_file_icon.png'

export default function Doc({ id, title }) {

    const fileEl = useRef(null)
    const [className, setClassName] = useState("file")
    const [value, setValue] = useState(title)

    const handleInput = (e) => {
        setValue(e.target.value)
    }

    const handleDoubleClick = () => {
        console.log("clicked doc")
    }

    return (
        <div 
            id={`d-${id}`}
            ref={fileEl}
            className={className}
            // style={{ "position": position, "top": Math.min(y, dimensions.height - 94), "left": Math.min(x, dimensions.width - 94), "zIndex": z }}
            >
            <div className="file-image-container">
                <img draggable="false"
                    id={id}
                    className="file-image"
                    alt=""
                    src={docImage}
                    // onMouseDown={(e) => start(e)}
                    onDoubleClick={() => handleDoubleClick()}
                />
            </div>
            <div className="file-name-container" >
                <ContentEditable
                    id="input"
                    html={value}
                    data-column="item"
                    className="content-editable"
                    onChange={(e) => handleInput(e)}
                />
            </div>
        </div>
    )
}