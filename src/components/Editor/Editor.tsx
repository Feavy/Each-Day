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
    let titleSpan: HTMLSpanElement;

    let pellElement: pell.PellElement;

    const [dateString, setDateString] = createSignal<string>(undefined);

    const title = () => {
        return titleSpan.textContent;
    }

    const setTitle = (title: string) => {
        if(!title || title === "Sans titre") {
            titleSpan.style.color = "#CCC";
            return;
        }
        titleSpan.style.color = "";
        titleSpan.textContent = title;
    }

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
                setDateString(part1);
                setTitle(part2);
            });
        } else {
            pellElement.content.innerHTML = "<div><br/></div>";
        }
    }, props.file);

    const update = () => {
        const part1 = dateString();
        const part2 = title();
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
        const target = e.target as HTMLSpanElement;
        setTitle(target.textContent);
        update();
    };

    const clearPlaceholder = (e: MouseEvent) => {
        const target = e.target as HTMLSpanElement;
        if(target.textContent === "Sans titre") {
            target.textContent = "";
            titleSpan.style.color = "";
        }
    };

    const onTitleBlur = (e: FocusEvent) => {
        const target = e.target as HTMLSpanElement;
        if(target.textContent === "") {
            target.textContent = "Sans titre";
            titleSpan.style.color = "#CCC";
        }
    }

    return (
        <div id="editor">
            <h2 id="page-title">{dateString()} – <span style="color: #CCC" ref={titleSpan} contentEditable={true} id="page-title-editable" onKeyUp={updateTitle} onClick={clearPlaceholder} onBlur={onTitleBlur}>Sans titre</span></h2>
            <div id="content" ref={editor} onClick={onEditorClick}>
            </div>
        </div>
    )
};

export default Editor;