import './context_menu.css'
import {useState, useEffect} from 'react';

export default function ContextMenu({ array, parentClassName, directionReveal }) {

    const [openContexts, setOpenContexts] = useState([]);
    const [update, setUpdate] = useState(true);

    let num = 0
    useEffect(() => {
        setOpenContexts(oldArray => [...oldArray, "closed"])
    }, [num])

    const list = array.map((item, i) => {
        if (item.type === "li") return <div className="contextmenu" key={i}>{item.text}</div>
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
                directionReveal={directionReveal} />
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

function NestedContext({ text, array, parentClassName, openContexts, num, setOpenContexts, update, setUpdate, directionReveal }) {

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
                <ContextMenu array={array} parentClassName={className} directionReveal={directionReveal}/>
            </div>
        </div>
    )
}