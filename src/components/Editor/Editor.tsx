import { Component, onMount } from "solid-js";
import pell from 'pell'

import "./Editor.css";

const Editor: Component = () => {
    let editor: HTMLDivElement;

    onMount(() => {
        pell.init({
            element: editor,
            defaultParagraphSeparator: "p",
            styleWithCSS: false,
            onChange: () => null,
            actions: ["bold", "italic", "underline", "strikethrough", "heading1", "heading2", "line", "quote", "paragraph", "ulist", "olist", "code", "image"]
        });
    });

    return (
        <div id="editor">
            <h2 contentEditable id="page-title">18/01/2022</h2>
            <div id="content" ref={editor}>
            </div>
        </div>
    )
};

export default Editor;