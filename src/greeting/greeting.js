import './greeting.css'
import React from 'react'
import GAPI from '../gapi/gapi'

export default function Greeting({ signedInUser, setSignedInUser, folders, setFolders, accessToken, setAccessToken }) {
    
    return (
        <div className={signedInUser ? "greeting-closed" : "greeting-opened" } >
            <span className="greeting-close">&#10006;</span>
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
            <GAPI
                folders={folders}
                setFolders={setFolders}
                accessToken={accessToken}
                setAccessToken={setAccessToken}
                signedInUser={signedInUser}
                setSignedInUser={setSignedInUser}
            />
        </div>
    )
}