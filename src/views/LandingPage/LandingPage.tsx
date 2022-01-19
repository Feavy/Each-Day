import { Component, createEffect, createSignal, For, onMount } from "solid-js";
import GoogleSignInButton from "../../components/GoogleSignInButton/GoogleSignInButton";
import EachDayService from "../../services/EachDayService";
import EditorPage from "../EditorPage/EditorPage";

import './LandingPage.css';

const LandingPage: Component = () => {
    const [ready, setReady] = createSignal(false);

    const handleClientLoad = () => {
        console.log("client loaded");
        EachDayService.init()
            .then((connected) => {
                console.log("Initialized. Connected = " + connected);
                EachDayService.listenSignedIn(onConnected);
                onConnected(connected);
            })
            .catch((e) => console.error("Error", e));
    }

    const onConnected = (connected: boolean) => {
        if(connected) {
            EachDayService.setupDrive().then(() => setReady(true));
        }
    }

    onMount(() => {
        const script = document.createElement('script');
        script.onload = handleClientLoad;
        script.src = "https://apis.google.com/js/api.js";
        document.body.appendChild(script);
    });

    return (
        <div class="page">
            <div id="title" style={ready() ? "top: 0vh; transform: translateY(0);" : ""}>
                <h1 style={ready() ? "font-size: 65px; margin-top: .33em;" : ""}>Each Day</h1>
                {!ready() && <GoogleSignInButton onClick={() => EachDayService.signIn()}></GoogleSignInButton>}
            </div>
            {ready() && <EditorPage></EditorPage>}
        </div>
    )
};

export default LandingPage;