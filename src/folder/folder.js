import './folder.css';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import ContentEditable from 'react-contenteditable';
import { debounce } from 'lodash';

export default function Folder({ left, top, title, parent, id, folders, setFolders, dimensions, opened, setOpened }) {

  const folderEl = useRef(null)
  const [value, setValue] = useState(title)
  const [className, setClassName] = useState("droppable folder")
  const [offSetX, setOffSetX] = useState(0)
  const [offSetY, setOffSetY] = useState(0)
  const [position, setPosition] = useState(parent ? "grid" : "fixed")
  const [x, setX] = useState(left)
  const [y, setY] = useState(top)
  const [z, setZ] = useState("0")
  const [nest, setNest] = useState(null)
  const [originalPos, setOriginalPos] = useState([0, 0])
  const [update, setUpdate] = useState(false)
  // const [stopped, setStopped] = useState(false)

  useEffect(() => {
    let mounted = true
    if (update && nest && mounted) {
      if (checkParents(nest.id.slice(2), folderEl.current.id.slice(2))) {
        alert("Nesting a folder into itself is not permitted")
        nest.className = nest.className.slice(8)
        if (parent) {
          setPosition(null)
          setNest(null)
        } else {
          setX(originalPos[0])
          setY(originalPos[1])
          setNest(document.querySelector(".App"))
        }
        return
      }
      const nestClassName = nest.className.split(" ")
      const temp = { ...folders }
      if (nestClassName[1] === "droppable") {
        if (temp[temp[id].parent]) temp[temp[id].parent].children = temp[temp[id].parent].children.filter(folderId => folderId !== id)
        temp[nest.id.slice(2)].children.push(Number(id))
        temp[id].parent = Number(nest.id.slice(2))
        setPosition(null)
        setFolders(temp)
        nest.className = nest.className.slice(8)
      } else if (nest.id === "App") {
        if (temp[temp[id].parent]) temp[temp[id].parent].children = temp[temp[id].parent].children.filter(folderId => folderId !== id)
        temp[id].parent = null
        temp[id].top = y
        temp[id].left = x
        setFolders(temp)
      }
      setUpdate(false)
      return function cleanup() { mounted = false }
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
      if (nest) {
        setY(nest.getBoundingClientRect().top)
        setX(nest.getBoundingClientRect().left + 3)
      }
      setPosition("grid")
    } else if (position === "fixed") {
      if (parent !== null) {
        document.querySelector(".App").appendChild(folderEl.current)
      }
    }
  }, [position])

  const checkParents = (nestID, folderID) => {
    // debugger
    if (nestID == folderID) {
      console.log("subfolder conflict")
      return true
    }
    if (folders[nestID] && folders[nestID].parent) {
      return checkParents(folders[nestID].parent, folderID)
    }
  }

  const start = (e) => {
    setOriginalPos([x, y])
    setClassName("folder")
    setZ("1000")
    // setStopped(false)
    setOffSetX(e.pageX - e.target.getBoundingClientRect().left + 5)
    setOffSetY(e.pageY - e.target.getBoundingClientRect().top + 5)
  }

  const drag = (e) => {
    e.preventDefault()
    if (position !== "fixed") setPosition("fixed")
    if (folderEl.current) {
      setY(Math.min(Math.max(0, e.pageY - offSetY), document.body.clientHeight - folderEl.current.offsetHeight))
      setX(Math.min(Math.max(0, e.pageX - offSetX), document.body.clientWidth - folderEl.current.offsetWidth))
    }
    nestFolder(e)
  }

  const stop = (e) => {
    e.preventDefault()
    if (parent !== null && document.getElementById(`c-${parent}`) && e.target.parentElement.parentElement.parentElement.id === "App") {
      document.getElementById(`c-${parent}`).appendChild(folderEl.current)
    }
    setUpdate(true)
    setOffSetX(0)
    setOffSetY(0)
    setZ("0")
    setClassName("droppable folder")
    // setStopped(true)
    if (!nest && !parent) setNest(document.querySelector(".App"))
    document.removeEventListener('mousemove', drag)
    document.removeEventListener('mouseup', stop)
  }

  const handleDoubleClick = () => {
    if (opened.includes(Number(id))) {
      const border = document.getElementById(`b-${id}`)
      border.className = "flash"
      setTimeout(() => {
        border.className = ""
      }, 2000);
      return
    }
    setOpened(prev => {
      if (folders[id].parent) {
        const temp = { ...folders }
        temp[id].contentX = temp[folders[id].parent].contentX
        temp[id].contentY = temp[folders[id].parent].contentY
        setFolders(temp)
        prev = prev.filter(ID => folders[id].parent !== ID)
      }
      return [ ...prev, Number(id)]
    })
  }

  const nestFolder = (e) => {
    e.preventDefault()
    const folder = e.target.parentElement ? e.target.parentElement.parentElement : null;
    if (folder) {
      folder.hidden = true
      let nestable = document.elementFromPoint(e.clientX, e.clientY)
      if (nestable = nestable.closest(".droppable")) {
        const prevCurrent = document.querySelector(".current")
        if (prevCurrent && prevCurrent !== nestable) prevCurrent.className = prevCurrent.className.slice(8)
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

  const handleInput = (e) => {
    const name = e.target.value.replace(/&nbsp;/g, " ")
    setValue(name)
    delayedQuery(name.length ? name : null);
  }

  const delayedQuery = useCallback(
    debounce((name) => {
      const temp = { ...folders }
      temp[id].title = name
      setFolders(temp)
    }, 500),
    []
  );

  return (
    <div id={`f-${id}`}
      ref={folderEl}
      className={className}
      style={{ "position": position, "top": Math.min(y, dimensions.height - 94), "left": Math.min(x, dimensions.width - 94), "zIndex": z }}>
      <div className="folder-image-container">
        <img draggable="false"
          id={id}
          className="folder-image"
          alt=""
          src="http://icon-park.com/imagefiles/folder_icon_yellow.png"
          onMouseDown={(e) => start(e)}
          onDoubleClick={() => handleDoubleClick()} 
        />
      </div>
      <div className="folder-name-container" >
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