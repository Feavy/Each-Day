export module GDocToPell {

    export function gDocToPell(html: string): string {
        html = html.replaceAll(/<p([^>]+)>/g, "<div$1>").replaceAll("</p>", "</div>").replaceAll(/<span[^>]+><\/span>/g, "<span$1><br/></span>");
        const div = document.createElement("div");
        div.innerHTML = html;

        process(div);

        return div.innerHTML;
    }

    function process(element: HTMLElement) {
        if (element.tagName.match(/SPAN|B|I|U|STRIKE/)) {
            element = processElement(element);
        } else if (element.tagName === "STYLE") {
            element.remove();
            return;
        }

        element.removeAttribute("style");

        const children = [...element.children];
        for (const child of children) {
            process(child as HTMLElement);
        }
    }

    function processElement(span: HTMLElement): HTMLElement {
        const replacements = [];
        if (span.style.fontWeight === "700") {
            replacements.push(document.createElement("b"));
        }
        if (span.style.fontStyle === "italic") {
            replacements.push(document.createElement("i"));
        }
        if (span.style.textDecoration === "underline") {
            replacements.push(document.createElement("u"));
        }
        if (span.style.textDecoration === "line-through") {
            replacements.push(document.createElement("strike"));
        }
        if (span.innerText.startsWith("“") && span.innerText.endsWith("”")) {
            span.innerHTML = span.innerText.substring(1, span.innerText.length - 1);
            replacements.push(document.createElement("blockquote"));
        }
        if (replacements.length > 0) {
            return replace(span, replacements);
        }
        return span;
    }

    function replace(element1: HTMLElement, element2: HTMLElement[]): HTMLElement {
        const parent = element1.parentElement;
        for (let i = 1; i < element2.length; i++) {
            element2[i - 1].appendChild(element2[i]);
        }
        element2[element2.length - 1].innerHTML = element1.innerHTML;
        parent.insertBefore(element2[0], element1);
        element1.remove();
        return element2[0];
    }
}

export module PellToGDoc {
    export function pellToGdoc(element: HTMLElement): string {
        element = element.cloneNode(true) as HTMLElement;
        process(element);
        return element.innerHTML;
    }

    function process(element: HTMLElement) {
        if (element.tagName === "BLOCKQUOTE") {
            element.innerText = "“"+element.innerText+"”";
        }

        const children = [...element.children];
        for (const child of children) {
            process(child as HTMLElement);
        }
    }
}