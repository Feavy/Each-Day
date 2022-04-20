import { batch, Component, createEffect, createSignal, onMount } from "solid-js";
import pell from 'pell'

import "./Editor.css";
import File from "../../model/File";
import Callback from "../../utils/Callback";
import { PellToGDoc, GDocToPell } from "./GDocToPellMapping";

function getOffset(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}

interface Props {
    file: File;
    onEdit: Callback<File>;
}

const Editor: Component<Props> = (props: Props) => {
    let editor: HTMLDivElement;

    let pellElement: pell.PellElement;

    const [title1, setTitle1] = createSignal<string>(undefined);
    const [title2, setTitle2] = createSignal<string>(undefined);

    onMount(() => {
        pellElement = pell.init({
            element: editor,
            defaultParagraphSeparator: "div",
            styleWithCSS: false,
            onChange: update,
            actions: ["paragraph", "heading1", "heading2", "bold", "italic", "underline", "strikethrough", "ulist", "olist", "quote", "line", "image"]
        });
    });

    createEffect(() => {
        console.log("EDITOR file", props.file);
        if (props.file && props.file.content) {
            pellElement.content.innerHTML = GDocToPell.gDocToPell(props.file.content);

            const part1 = props.file.name.includes("–") ? props.file.name.split(" –")[0] : props.file.name;
            const part2 = props.file.name.includes("–") ? props.file.name.split("– ")[1] : undefined;

            batch(() => {
                setTitle1(part1);
                setTitle2(part2);
            });
        } else {
            pellElement.content.innerHTML = "<div><br/></div>";
        }
    }, props.file);

    const update = () => {
        const part1 = title1();
        const part2 = title2();
        if (part2) {
            props.file.name = part1 + " – " + part2;
        } else {
            props.file.name = part1;
        }
        props.file.content = PellToGDoc.pellToGdoc(pellElement.content);
        props.onEdit(props.file);
    };

    const onEditorClick = (e: MouseEvent) => {
        const lastChild = pellElement.content.lastChild as HTMLElement;
        if (!lastChild || getOffset(lastChild).top + lastChild.clientHeight + 42 < e.pageY) {
            const p: HTMLParagraphElement = document.createElement("div");
            p.innerHTML = "<br/>";
            pellElement.content.appendChild(p);

            // Focus on the just added paragraph
            const range = document.createRange();
            const sel = window.getSelection();

            range.setStart(pellElement.content.lastChild, 0);
            range.collapse(true);

            sel.removeAllRanges();
            sel.addRange(range);
        }
    };

    const updateTitle = (e: KeyboardEvent) => {
        const input = e.target as HTMLInputElement;
        input.style.width = (((input.value.length || 5) + 3) * 13) + 'px';
        setTitle2(input.value);
        update();
    };

    return (
        <div id="editor">
            <h2 id="page-title">{title1()} – <input id="page-title-editable" onKeyUp={updateTitle} placeholder="Title" value={title2() ? title2() : null}></input></h2>
            <div id="content" ref={editor} onClick={onEditorClick}>
            </div>
        </div>
    )
};

export default Editor;