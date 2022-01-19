import { Component, createEffect, createSignal, For } from "solid-js";
import File from "../../model/File";
import { GoogleDriveService } from "../../services/GoogleDriveService";

import book from '../../assets/book.svg';
import logout from '../../assets/logout.svg';

import './EditorPage.css';
import Editor from "../../components/Editor/Editor";

const EditorPage: Component = () => {
    const [files, setFiles] = createSignal<File[]>([]);

    createEffect(() => {
        GoogleDriveService.listFiles().then(files => setFiles(files));
    });

    return (
        <div id="editor-page">
            <div id="head">
                <p class="left"><span class="button"><img src={book}></img>Historique</span></p>
                <p class="right"><span class="button" onClick={() => GoogleDriveService.signOut()}>Déconnexion<img src={logout}></img></span></p>
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