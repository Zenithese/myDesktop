import './greeting.css'
import React from 'react'

export default function Greeting({ setDisplayGreeting }) {
    
    return (
        <div className="modal-content" >
            <span className="greeting-close" onClick={() => setDisplayGreeting(false)}>&#10006;</span>
            <br />
            Welcome to (your) myDesktop: a desktop for Google Drive!
            <br />
            Use it like your OS desktop
            <br />
            <ul>
                <li>Drag and drop and nest files and folders</li>
                <li>Right click for context menu</li>
                <li>Search your drive by clicking on the search button and querying in the input field</li>
            </ul>
            <br />
            By authorizing, you are allowing myDesktop to access your Drive through Google DriveAPI.
            This allows you to search your documents and organize them within the myDesktop UI.
            Additionally, when you rename your documents on myDesktop, a patch request is sent to your drive to update it there as well.
            Lastly, your document and folder positions are saved so you can return where you left off.
            <br />
            <br />
            Authorize to gain said functionality!
        </div>
    )
}