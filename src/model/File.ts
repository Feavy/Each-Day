export default interface File {
    id: string;
    kind: string;
    mimeType: string;
    name: string;
    content?: string;
}