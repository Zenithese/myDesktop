import './App.css';
import { useEffect, useState } from 'react';
import ContextMenu from './context_menu/contextmenu';
import Folder from './folder/folder';
import Contents from './contents/contents';
import FloatingSearchButton from './floating_search_button/floating_search_button';
import GAPI from './gapi/gapi';
import Doc from './doc/doc'
// import GhostFolder from './folder/ghostFolder'

function App() {

  const [top, setTop] = useState("0px")
  const [left, setLeft] = useState("0px")
  const [directionReveal, setDirectionReveal] = useState("right-reveal")
  const [parentClassName, setParentClassName] = useState("new-location")
  const [display, setDisplay] = useState("none")
  const [contexts, setContexts] = useState([])
  const [opened, setOpened] = useState([])
  const [closeSearch, setCloseSearch] = useState(false)
  const [driveDocuments, setDriveDocuments] = useState([])
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
        id: e.target.id
      }])
    } else {
      setContexts([
        {
          type: "li",
          text: "New Folder",
          id: `nf-${e.target.id}`
        },
        {
          type: "li",
          text: "Change Background"
        },
      ])
    }
  }

  const handleClick = (e) => {
    e.preventDefault()
    setDisplay("none")
    if (!e.target.closest(".keep-open")) setCloseSearch(true)
  }

  useEffect(() => {
    setParentClassName("new-location")
  }, [parentClassName])

  const renderFolders = () => {
    const renderFolders = []
    for (const folder in folders) {
      if (folders[folder].parent === null) {
        renderFolders.push(
          folders[folder].type ? 
          <Doc 
            id={folder}
            top={folders[folder].top}
            left={folders[folder].left}
            title={folders[folder].title}
            folders={folders}
            setFolders={setFolders}
            setDriveDocuments={setDriveDocuments}
            key={folder}
          />
          :
          <Folder
            id={folder}
            top={folders[folder].top}
            left={folders[folder].left}
            title={folders[folder].title}
            folders={folders}
            setFolders={setFolders}
            parent={null}
            dimensions={dimensions}
            setOpened={setOpened}
            key={folder} 
          />
        )
      }
    }
    return renderFolders
  }

  const renderContents = () => {
    return opened.map((folder, index) => {
      return <Contents
        id={`c-${folder}`}
        children={folders[folder].children}
        folders={folders}
        setFolders={setFolders}
        contentX={folders[folder].contentX === null ? 300 + (index * 15) : folders[folder].contentX}
        contentY={folders[folder].contentY === null ? 300 - (index * 15) : folders[folder].contentY}
        contentWidth={folders[folder].contentWidth}
        contentHeight={folders[folder].contentHeight}
        dimensions={dimensions}
        setOpened={setOpened}
        key={`c-${folder}`}
      />
    })
  }

  return (
    <div id="App"
      className="App"
      onClick={(e) => handleClick(e)}
      onContextMenu={(e) => rightClick(e)}>
      <GAPI setDriveDocuments={setDriveDocuments} />
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
      {renderContents()}
      <FloatingSearchButton 
        closeSearch={closeSearch} 
        setCloseSearch={setCloseSearch} 
        driveDocuments={driveDocuments} 
        setDriveDocuments={setDriveDocuments}
        folders={folders} 
        setFolders={setFolders} 
      />
      {/* <GhostFolder /> */}
    </div>
  );
}

export default App;