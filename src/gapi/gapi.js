import { gapi } from 'gapi-script';
import React, { useState, useEffect } from 'react'

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const API_KEY = process.env.REACT_APP_API_KEY;
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = "https://www.googleapis.com/auth/drive  https://www.googleapis.com/auth/drive.appdata";

export default function GAPI({ folders, setFolders, accessToken, setAccessToken, setDisplayGreeting }) {
    const [signedInUser, setSignedInUser] = useState(null)
    const [updatable, setUpdatable] = useState(false)
    const [appDataId, setAppDataId] = useState(null)

    useEffect(() => {
        if (!signedInUser) {
            console.log("siging in")
            handleClientLoad()
        } else {
            fileExists("nerwer_data")
        }
    }, [signedInUser])

    useEffect(() => {
        if (updatable && appDataId && accessToken) {
            const xhr = new XMLHttpRequest();
            xhr.open('PATCH', 'https://www.googleapis.com/upload/drive/v3/files/' + appDataId + '?uploadType=media');
            xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
            xhr.responseType = 'json';
            xhr.send(JSON.stringify(folders));
        }
    }, [folders, updatable, appDataId, accessToken])

    /**
     *  Sign in the user upon button click.
     */
    const handleAuthClick = (event) => {
        gapi.auth2.getAuthInstance().signIn();
        setDisplayGreeting(false);
    };

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    const updateSigninStatus = (isSignedIn) => {
        if (isSignedIn) {
            // Set the signed in user
            const instance = gapi.auth2.getAuthInstance()
            setSignedInUser(instance.currentUser.je.Qt);

            // get access token
            const key = Object.keys(instance.currentUser)[0]
            const key2 = Object.keys(instance.currentUser[key])[1]
            setAccessToken(instance.currentUser[key][key2].access_token)
        } else {
            // prompt user to sign in
            // handleAuthClick();
            // greeting()
            setDisplayGreeting(true)
        }
    };

    /**
     *  Sign out the user upon button click.
     */
    const handleSignOutClick = () => {
        gapi.auth2.getAuthInstance().signOut();
        setDisplayGreeting(false);
        setSignedInUser(null);
    };

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    const initClient = () => {
        gapi.client
            .init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
            }).then(
                function () {
                    // Listen for sign-in state changes.
                    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

                    // Handle the initial sign-in state.
                    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                },
                function (error) { 
                    alert(JSON.stringify(error, null, 2));
                }
            );
    };

    const handleClientLoad = () => {
        gapi.load('client:auth2', initClient);
    };

    function fileExists(fileName) {
        const request = gapi.client.drive.files.list({
            spaces: 'appDataFolder',
            fields: 'files(id, name, modifiedTime)'
        });
        request.execute(res => {
            const appData = res.files.find(f => f.name === fileName)
            if (appData) {
                gapi.client.drive.files.get({
                    'fileId': appData.id,
                    'alt': 'media'
                }).then(r => {
                    setFolders(JSON.parse(r.body))
                    setAppDataId(appData.id)
                    setUpdatable(true)
                })
            } else {
                // console.log("creating file")
                createPositionsFile()
            }
        });
    };

    function createPositionsFile() {
        var file = new Blob([JSON.stringify(folders)], { type: 'text/javascript' });
        var metadata = {
            'name': 'nerwer_data', // Filename at Google Drive
            'mimeType': 'text/javascript', // mimeType at Google Drive
            'parents': ['appDataFolder']
        };
        // id: "1aQcrCKWjnS9uU2cYpWEHioC2JkswMdkcHPiokt6aGc2ydBwBfA"
        var form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', file);

        var xhr = new XMLHttpRequest();
        xhr.open('post', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id');
        xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
        xhr.responseType = 'json';
        xhr.onload = () => {
            console.log(xhr.response.id); // Retrieve uploaded file ID.
        };
        xhr.send(form);
    }

    return (
        <div>
            {signedInUser ? 
                <button onClick={() => handleSignOutClick()}>Sign-Out</button>
                : 
                <button onClick={() => handleAuthClick()}>Authorize</button>}
        </div>
    );
};