import './App.css';
import { useEffect, useState } from 'react';
import ContextMenu from './context_menu/contextmenu';
import Folder from './folder/folder';
import Contents from './contents/contents'

function App() {

  const [top, setTop] = useState("0px")
  const [left, setLeft] = useState("0px")
  const [directionReveal, setDirectionReveal] = useState("right-reveal")
  const [parentClassName, setParentClassName] = useState("new-location")
  const [display, setDisplay] = useState("none")
  const [openedLatest, setOpenedLatest] = useState(null)
  const [contexts, setContexts] = useState(
    [
      {
        type: "li",
        text: "New Folder"
      },
      {
        type: "li",
        text: "Change Background"
      },
    ]
  )
  const [folders, setFolders] = useState(
    {
      30: {
        'top': 300,
        'left': 570,
        'title': 'Aquarius',
        'parent': null,
        'children': [],
        'open': false,
        'contentX': null,
        'contentY': null,
        'contentWidth': 300,
        'contentHeight': 300
      },
      1: {
        'top': 50,
        'left': 50,
        'title': 'origin',
        'parent': null,
        'children': [2],
        'open': false,
        'contentX': null,
        'contentY': null,
        'contentWidth': 300,
        'contentHeight': 300
      },
      2: {
        'top': 50,
        'left': 150,
        'title': 'sipping on gin n juice',
        'parent': 1,
        'children': [],
        'open': false,
        'contentX': null,
        'contentY': null,
        'contentWidth': 300,
        'contentHeight': 300
      },
    }
  )
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth
  })

  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      })
    }
    window.addEventListener('resize', handleResize)
    return _ => {
      window.removeEventListener('resize', handleResize)
    }
  })

  // useEffect(() => {
  //   if (openedLatest) {

  //   }
  // }, [openedLatest])

  const rightClick = (e) => {
    e.preventDefault()
    setDisplay("block")
    setParentClassName("contextmenu")
    if (e.clientX > (window.innerWidth / 4) * 3) {
      e.clientY > (window.innerHeight / 4) * 3 ? setDirectionReveal("left-reveal bottom") : setDirectionReveal("left-reveal")
      setTop(e.clientY + "px")
      setLeft(e.clientX + 160 + "px")
    } else {
      e.clientY > (window.innerHeight / 4) * 3 ? setDirectionReveal("right-reveal bottom") : setDirectionReveal("right-reveal")
      setTop(e.clientY + "px")
      setLeft(e.clientX + 5 + "px")
    }
    if (e.target.className === "folder-image") {
      setContexts([{
        type: "li",
        text: "Delete Folder",
        folder: e.target.id
      }])
    } else {
      setContexts([
        {
          type: "li",
          text: "New Folder"
        },
        {
          type: "li",
          text: "Change Background"
        },
      ])
    }
  }

  const closeContext = (e) => {
    e.preventDefault()
    setDisplay("none")
  }

  useEffect(() => {
    setParentClassName("new-location")
  }, [parentClassName])

  const renderFolders = () => {
    const renderFolders = []
    const renderContents = []
    for (const folder in folders) {
      if (folders[folder].parent === null) {
        renderFolders.push(
          <Folder
            id={folder}
            top={folders[folder].top}
            left={folders[folder].left}
            title={folders[folder].title}
            folders={folders}
            setFolders={setFolders}
            parent={null}
            dimensions={dimensions}
            openedLatest={openedLatest}
            setOpenedLatest={setOpenedLatest}
            key={folder} 
          />
        )
      }
      if (folders[folder].open) {
        renderContents.push(
          <Contents
            id={`c-${folder}`}
            children={folders[folder].children}
            folders={folders}
            setFolders={setFolders}
            contentX={folders[folder].contentX === null ? folders[folder].left : folders[folder].contentX}
            contentY={folders[folder].contentY === null ? folders[folder].top + 110 : folders[folder].contentY}
            // contentX={folders[folder].contentX === null ? 300 + (renderContents.length * 15) : folders[folder].contentX}
            // contentY={folders[folder].contentY === null ? 300 - (renderContents.length * 15) : folders[folder].contentY}
            contentWidth={folders[folder].contentWidth}
            contentHeight={folders[folder].contentHeight}
            dimensions={dimensions}
            openedLatest={openedLatest}
            key={`c-${folder}`}
          />
        )
      }
    }
    return [...renderFolders, ...renderContents]
  }

  return (
    <div id="App"
      className="App"
      onClick={(e) => closeContext(e)}
      onContextMenu={(e) => rightClick(e)}>
      <div style={{ "display": display, "position": "fixed", "top": top, "left": left, "flexDirection": "row-reverse", "zIndex": "10000" }}>
        <ContextMenu
          parentClassName={parentClassName}
          directionReveal={directionReveal}
          folders={folders}
          setFolders={setFolders}
          array={contexts} 
        />
      </div>
      {renderFolders()}
    </div>
  );
}

export default App;