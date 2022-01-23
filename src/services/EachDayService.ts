import File from "../model/File";
import { GoogleDriveService } from "./GoogleDriveService";

module EachDayService {
    let driveFolder: File = null;
    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    export function init(): Promise<boolean> {
        return GoogleDriveService.init();
    }

    export function listenSignedIn(listener: (signedIn: boolean) => void) {
        GoogleDriveService.listenSignedIn(listener);
    }

    /**
     *  Sign in the user upon button click.
     */
    export function signIn() {
        GoogleDriveService.signIn();
    }

    /**
     *  Sign out the user upon button click.
     */
    export function signOut() {
        GoogleDriveService.signOut();
    }

    export async function setupDrive() {
        console.log("setup drive");
        const files = await GoogleDriveService.searchFiles("mimeType='application/vnd.google-apps.folder'");
        if (files.length > 0) {
            driveFolder = files[0];
            console.log("Found folder:", files[0]);
        } else {
            driveFolder = await GoogleDriveService.createFolder("EachDay");
            console.log("Created folder:", driveFolder);
        }
        console.log("Drive setup")
    }

    function formatDate(d: Date) {
        return `${("0" + d.getDate()).slice(-2)}/${("0" + (d.getMonth() + 1)).slice(-2)}/${d.getFullYear()}`;
    }

    export async function getOrCreateTodayFile() {
        const d = new Date();
        const exiting = await getFileByDate(d);
        if(exiting.length > 0) {
            console.log("Existing file:", exiting[0])
            return exiting[0];
        }
        const file = await GoogleDriveService.createGDocFile(driveFolder, formatDate(d));
        console.log("Created new file:",file); 
        return file;
    }

    export async function getFileByDate(d: Date): Promise<File[]> {
        return GoogleDriveService.searchFiles(`modifiedTime > '${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${("0" + d.getDate()).slice(-2)}T00:00:00'`);
    }

    export function getDriveFolder() {
        return driveFolder;
    }
}

export default EachDayService;