import { Component, createEffect, onMount } from "solid-js";
import pell from 'pell'

import "./Editor.css";
import File from "../../model/File";

function getOffset(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}

interface Props {
    file: File;
}

const Editor: Component<Props> = (props: Props) => {
    let editor: HTMLDivElement;

    let pellElement: pell.PellElement;

    onMount(() => {
        pellElement = pell.init({
            element: editor,
            defaultParagraphSeparator: "p",
            styleWithCSS: true,
            onChange: () => null,
            actions: ["bold", "italic", "underline", "strikethrough", "heading1", "heading2", "line", "quote", "paragraph", "ulist", "olist", "code", "image"]
        });
        console.log("mount", props.file);
    });

    createEffect(() => {
        if(props.file && props.file.content) {
            pellElement.content.innerHTML = props.file.content.replaceAll("&quot;", "'").replaceAll(/(font-family|color|padding|margin)[^;]+;/g, "");
        }else{
            pellElement.content.innerHTML = "<p><br/></p>";
        }
    }, props.file);

    const onEditorClick = (e: MouseEvent) => {
        const lastChild = pellElement.content.lastChild as HTMLElement;
        if(!lastChild || getOffset(lastChild).top + lastChild.clientHeight + 42 < e.pageY) {
            const p: HTMLParagraphElement = document.createElement("p");
            p.innerHTML = "<br/>";
            pellElement.content.appendChild(p);

            // Focus on just added paragraph
            const range = document.createRange();
            const sel = window.getSelection();
            
            range.setStart(pellElement.content.lastChild, 0);
            range.collapse(true);
            
            sel.removeAllRanges();
            sel.addRange(range);
        }
    };

    return (
        <div id="editor">
            <h2 contentEditable id="page-title">18/01/2022</h2>
            <div id="content" ref={editor} onClick={onEditorClick}>
            </div>
        </div>
    )
};

export default Editor;