import { Component, createEffect, createSignal, For } from "solid-js";
import File from "../../model/File";

import book from '../../assets/book.svg';
import logout from '../../assets/logout.svg';

import './EditorPage.css';
import Editor from "../../components/Editor/Editor";
import EachDayService from "../../services/EachDayService";
import { GoogleDriveService } from "../../services/GoogleDriveService";

const EditorPage: Component = () => {
    const [file, setFile] = createSignal<File>(null);
    EachDayService.getOrCreateTodayFile().then(setFile);

    createEffect(() => {
        console.log("File: ", file());
        if(file()) {
            // GoogleDriveService.createTextFile2(EachDayService.getDriveFolder(), "gdoc").then(f => console.log("Created", f)).catch(console.error);
        }
    }, file);

    return (
        <div id="editor-page">
            <div id="head">
                <p class="left"><span class="button"><img src={book}></img>Historique</span></p>
                <p class="right"><span class="button" onClick={() => EachDayService.signOut()}>Déconnexion<img src={logout}></img></span></p>
            </div>
            <Editor></Editor>
            {/* <button onClick={() => GoogleDriveService.createFolder("Eachday")}>Create folder</button>
            <br />
            <For each={files()}>
                {(file) => (
                    <p>{file.name}</p>
                )}
            </For> */}
        </div>
    );
}

export default EditorPage;