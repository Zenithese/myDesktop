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
  }

  const closeContext = (e) => {
    e.preventDefault()
    setDisplay("none")
  }

  useEffect(() => {
    setParentClassName("new-location")
  }, [parentClassName])

  return (
    <div className="App"
      onClick={(e) => closeContext(e)}
      onContextMenu={(e) => rightClick(e)}>
      <div style={{ "display": display, "position": "absolute", "top": top, "left": left, "flexDirection": "row-reverse" }}>
        <ContextMenu parentClassName={parentClassName} directionReveal={directionReveal} array={[
          {
            type: "li",
            text: "New Folder"
          },
          {
            type: "li",
            text: "Change Background"
          },
        ]} />
      </div>
      <Folder />
      {/* <Contents /> */}
    </div>
  );
}

export default App;