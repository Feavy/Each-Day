import { Component, createEffect, createSignal, For } from "solid-js";
import File from "../../model/File";

import book from '../../assets/book.svg';
import logout from '../../assets/logout.svg';

import './EditorPage.css';
import Editor from "../../components/Editor/Editor";
import EachDayService from "../../services/EachDayService";
import { GoogleDriveService } from "../../services/GoogleDriveService";
import Strings from "../../Strings";

const EditorPage: Component = () => {
    const [file, setFile] = createSignal<File>(null);
    EachDayService.getOrCreateTodayFile().then(file => {
        GoogleDriveService.getFileContent(file.id).then(data => {
            setFile(previous => {
                return {
                    ...previous,
                    content: data
                }
            });
        });
    });

    createEffect(() => {
        console.log("File: ", file());
        if (file()) {
            console.log("File is present");
        }
        console.log("logout:", Strings.LOGOUT);
        window.scrollTo(0, 0);
    }, file);

    return (
        <div id="editor-page">
            <div id="head">
                <p class="left"><span class="button"><img src={book}></img>Historique</span></p>
                <p class="right"><span class="button" onClick={() => EachDayService.signOut()}>Déconnexion<img src={logout}></img></span></p>
            </div>
            <Editor file={file()}></Editor>
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