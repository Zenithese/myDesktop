import React from "react";
import { useClickPreventionOnDoubleClick } from "./useClickPreventionOnDoubleClick";

const ClickableElement = ({ onClick, onDoubleClick }) => {
    const [handleClick, handleDoubleClick] = useClickPreventionOnDoubleClick(onClick, onDoubleClick);

    return (
        <div onClick={handleClick} onDoubleClick={handleDoubleClick}>
            Click or double click
        </div>
    );
};

export default ClickableElement;