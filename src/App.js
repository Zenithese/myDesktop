import './App.css';
import { useEffect, useState } from 'react';
import ContextMenu from './context_menu/contextmenu';
import Folder from './folder/folder';
import Contents from './contents/contents';
import FloatingSearchButton from './floating_search_button/floating_search_button';
import Doc from './doc/doc';
import Greeting from './greeting/greeting'

function App() {

  const [signedInUser, setSignedInUser] = useState(null)
  const [displayGreeting, setDisplayGreeting] = useState(false)
  const [background, setBackground] = useState("App background-1")
  const [top, setTop] = useState("0px")
  const [left, setLeft] = useState("0px")
  const [directionReveal, setDirectionReveal] = useState("right-reveal")
  const [parentClassName, setParentClassName] = useState("new-location")
  const [display, setDisplay] = useState("none")
  const [contexts, setContexts] = useState([])
  const [opened, setOpened] = useState([])
  const [closeSearch, setCloseSearch] = useState(false)
  const [driveDocuments, setDriveDocuments] = useState([])
  const [folders, setFolders] = useState({})
  const [accessToken, setAccessToken] = useState(null)
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
    } else if (e.target.className === "file-image") {
      setContexts([{
        type: "li",
        text: "Delete File",
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
          type: "li with context",
          text: "Change Background",
          array: [
            {
              type: "li",
              text: "Classic Windows",
            },
            {
              type: "li",
              text: "Oranges",
            },
            {
              type: "li",
              text: "Sky",
            },
          ]
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
    console.log(folders)
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
            parent={folders[folder].parent}
            webViewLink={folders[folder].webViewLink}
            iconLink={folders[folder].iconLink}
            folders={folders}
            setFolders={setFolders}
            accessToken={accessToken}
            dimensions={dimensions}
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
            opened={opened}
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
      if (folders[folder].contentX === null) initOpen(folder, index)
      return <Contents
        id={`c-${folder}`}
        children={folders[folder].children}
        folders={folders}
        setFolders={setFolders}
        contentX={folders[folder].contentX}
        contentY={folders[folder].contentY}
        contentWidth={folders[folder].contentWidth}
        contentHeight={folders[folder].contentHeight}
        dimensions={dimensions}
        opened={opened}
        setOpened={setOpened}
        accessToken={accessToken}
        key={`c-${folder}`}
      />
    })
  }

  const initOpen = (folder, index) => {
    const temp = { ...folders }
    const contentPos = { x: 300 + (index * 15), y: 300 - (index * 15)}
    folders[folder].contentX = contentPos.x
    folders[folder].contentY = contentPos.y
    setFolders(temp)
  }

  return (
    <div id="App"
      className={background}
      onClick={(e) => handleClick(e)}
      onContextMenu={(e) => rightClick(e)}>
      <Greeting
        displayGreeting={displayGreeting}
        setDisplayGreeting={setDisplayGreeting}
        folders={folders}
        setFolders={setFolders}
        accessToken={accessToken}
        setAccessToken={setAccessToken}
        setDisplayGreeting={setDisplayGreeting}
        signedInUser={signedInUser}
        setSignedInUser={setSignedInUser}
      /> 
      <div style={{ "display": display, "position": "fixed", "top": top, "left": left, "flexDirection": "row-reverse", "zIndex": "10000" }}>
        <ContextMenu
          parentClassName={parentClassName}
          directionReveal={directionReveal}
          folders={folders}
          setFolders={setFolders}
          array={contexts} 
          setBackground={setBackground}
          setOpened={setOpened}
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
        dimensions={dimensions}
      />
    </div>
  );
}

export default App;