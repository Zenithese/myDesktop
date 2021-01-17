import { gapi } from 'gapi-script';
import React, { useState } from 'react'

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const API_KEY = process.env.REACT_APP_API_KEY;
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = "https://www.googleapis.com/auth/drive  https://www.googleapis.com/auth/drive.appdata";

export default function GAPI({ setDriveDocuments }) {
    const [signedInUser, setSignedInUser] = useState();

    /**
     * Print files.
     */
    const listFiles = (searchTerm = null) => {       
        gapi.client.drive.files
            .list({
                pageSize: 10,
                'fields': "nextPageToken, files(kind, id, name, webViewLink, iconLink, mimeType, description)",
                q: searchTerm,
            })
            .then(function (response) {
                const res = JSON.parse(response.body);
                setDriveDocuments(res.files);
                console.log(res.files)
            });
    };

    /**
     *  Sign in the user upon button click.
     */
    const handleAuthClick = (event) => {
        gapi.auth2.getAuthInstance().signIn();
    };

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    const updateSigninStatus = (isSignedIn) => {
        if (isSignedIn) {
            // Set the signed in user
            setSignedInUser(gapi.auth2.getAuthInstance().currentUser.je.Qt);
            // list files if user is authenticated
            listFiles();
        } else {
            // prompt user to sign in
            handleAuthClick();
        }
    };

    /**
     *  Sign out the user upon button click.
     */
    const handleSignOutClick = (event) => {
        gapi.auth2.getAuthInstance().signOut();
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
            })
            .then(
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

    return (
        <div>
            <button onClick={() => handleClientLoad()}>Sign-In</button>
            <button onClick={() => handleSignOutClick()}>Sign-Out</button>
        </div>
    );
};