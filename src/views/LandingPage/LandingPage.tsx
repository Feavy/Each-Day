import { Component, createEffect, createSignal, For, onMount } from "solid-js";
import GoogleSignInButton from "../../components/GoogleSignInButton/GoogleSignInButton";
import File from "../../model/File";
import { GoogleDriveService } from "../../services/GoogleDriveService";
import EditorPage from "../EditorPage/EditorPage";

import './LandingPage.css';

const LandingPage: Component = () => {
    const [connected, setConnected] = createSignal(false);

    const handleClientLoad = () => {
        console.log("client loaded");
        GoogleDriveService.init()
            .then((connected) => {
                console.log("Initialized. Connected = " + connected);
                GoogleDriveService.listenSignedIn(signed => setConnected(signed));
                setConnected(connected);
            })
            .catch((e) => console.error("Error", e));
    }

    onMount(() => {
        const script = document.createElement('script');
        script.onload = handleClientLoad;
        script.src = "https://apis.google.com/js/api.js";
        document.body.appendChild(script);
        setTimeout(() => {
            // setConnected(true);
        }, 1000);
    });

    return (
        <div class="page">
            <div id="title" style={connected() ? "top: 0vh; transform: translateY(0);" : ""}>
                <h1 style={connected() ? "font-size: 65px; margin-top: .33em;" : ""}>Each Day</h1>
                {!connected() && <GoogleSignInButton onClick={() => GoogleDriveService.signIn()}></GoogleSignInButton>}
            </div>
            {connected() && <EditorPage></EditorPage>}
        </div>
    )
};

export default LandingPage;