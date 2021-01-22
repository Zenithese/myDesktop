import './context_menu.css'
import {useState, useEffect} from 'react';

export default function ContextMenu({ array, parentClassName, directionReveal, folders, setFolders, setBackground }) {

    const [openContexts, setOpenContexts] = useState([]);
    const [update, setUpdate] = useState(true);

    let num = 0
    useEffect(() => {
        setOpenContexts(oldArray => [...oldArray, "closed"])
    }, [num])

    const handleClick = (e) => {
        if (e.target.innerHTML === "New Folder") {
            const temp = { ...folders }
            const id = Math.floor(Math.random() * 1000000000000000)
            if (e.target.id.slice(3) === "App") {
                temp[id] = {
                    'top': e.pageY,
                    'left': e.pageX,
                    'title': 'New Folder',
                    'parent': null,
                    'children': [],
                    'contentX': null,
                    'contentY': null,
                    'contentWidth': 300,
                    'contentHeight': 300
                }
            } else {
                const parent = Number(e.target.id.slice(5))
                temp[id] = {
                    'top': e.pageY,
                    'left': e.pageX,
                    'title': 'New Folder',
                    'parent': parent,
                    'children': [],
                    'open': false,
                    'contentX': null,
                    'contentY': null,
                    'contentWidth': 300,
                    'contentHeight': 300
                }
                temp[parent].children.push(id)
            }
            setFolders(temp)
        } else if (e.target.innerHTML === "Delete Folder" || e.target.innerHTML === "Delete File") {
            const temp = { ...folders };
            (function recursiveDelete(id = e.target.id, inital = true) {
                if (temp[id].children) {
                    temp[id].children.forEach(id => {
                        if (temp[id].children) {
                            recursiveDelete(id, false)
                        } else {
                            delete temp[id]
                        }
                    })
                }
                if (inital) {
                    if (temp[id].parent) temp[temp[id].parent].children = temp[temp[id].parent].children.filter(folderId => folderId !== Number(id))
                    delete temp[id]
                    setFolders(temp)
                } 
                delete temp[id]
            })();
        } else if (e.target.innerHTML === "Classic Windows") {
            setBackground("App background-1")
        } else if (e.target.innerHTML === "Oranges") {
            setBackground("App background-2")
        } else if (e.target.innerHTML === "Sky") {
            setBackground("App background-3")
        }
    }

    const list = array.map((item, i) => {
        if (item.type === "li") return <div className="contextmenu" id={item.id} onClick={(e) => handleClick(e)} key={i}>{item.text}</div>
        if (item.type === "li with context") {
            num++
            return (
                <NestedContext 
                    text={item.text} 
                    array={item.array} 
                    parentClassName={parentClassName} 
                    key={i} openContexts={openContexts} 
                    setOpenContexts={setOpenContexts}
                    num={num - 1}
                    update={update}
                    setUpdate={setUpdate}
                    directionReveal={directionReveal} 
                    setBackground={setBackground}
                />
            )
        }
        return null
    })

    return (
        <div className={directionReveal}>
            {list}
        </div>
    )
}

function NestedContext({ text, array, parentClassName, openContexts, num, setOpenContexts, update, setUpdate, directionReveal, setBackground }) {

    const [className, setClassName] = useState("contextmenu")

    useEffect(() => {
        if (parentClassName === "contextmenu") setClassName("contextmenu")
    }, [parentClassName])

    useEffect(() => {
        if (openContexts[num] === "closed") setClassName("contextmenu")
    }, [update, openContexts, num])

    const onHover = () => {
        setClassName("selector")
        setOpenContexts(array => {
            for (let i = 0; i < array.length; i++) {
                i === num ? array[i] = "open" : array[i] = "closed"
            }
            return array
        })
        setUpdate(!update)
    }

    const onLeave = (e) => {
        if (e.target.className === "contextmenu") return
        setClassName("contextmenu")
        openContexts[num] = "closed"
    }

    return (
        <div className="more-context" onMouseOver={() => onHover()}>
            <div className={className} onMouseOver={() => onHover()} onMouseLeave={(e) => onLeave(e)}>
                {text + " =>"}
            </div>
            <div className="nested-context" >
                <ContextMenu array={array} parentClassName={className} directionReveal={directionReveal} setBackground={setBackground} />
            </div>
        </div>
    )
}