import './folder.css';
import React from 'react';
import ContentEditable from 'react-contenteditable';

export default function Placeholder({ x, y, value }) {
    return (
        <div
            className="folder"
            style={{ "position": "absolute", "top": y, "left": x, "zIndex": -1 }}>
            <div className="folder-image-container">
                <img className="folder-image" alt="" src="http://icon-park.com/imagefiles/folder_icon_yellow.png" />
            </div>
            <div className="folder-name-container" >
                <ContentEditable
                    id="input"
                    html={value}
                    data-column="item"
                    className="content-editable" />
            </div>
        </div>
    )
}