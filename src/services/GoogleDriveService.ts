
// @ts-nocheck
import File from "../model/File";

var CLIENT_ID = '804262594205-eilbcjqdhnlpi091k18skab0b15pf8c2.apps.googleusercontent.com';
var API_KEY = 'AIzaSyDC5-nRTdYCzCSKZWNCsDW5E1h3aoBndd0';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = 'https://www.googleapis.com/auth/drive.file';

export module GoogleDriveService {

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  export function init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      gapi.load('client:auth2', () => {
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        }).then(_ => resolve(isLogged())).catch(reject);
      });
    });
  }

  export function listenSignedIn(listener: (signedIn: boolean) => void) {
    gapi.auth2.getAuthInstance().isSignedIn.listen(listener);
  }

  /**
   *  Sign in the user upon button click.
   */
  export function signIn() {
    gapi.auth2.getAuthInstance().signIn();
  }

  /**
   *  Sign out the user upon button click.
   */
  export function signOut() {
    gapi.auth2.getAuthInstance().signOut();
  }

  export function isLogged() {
    return gapi.auth2.getAuthInstance().isSignedIn.get();
  }

  function getToken() {
    const token = gapi.auth.getToken();
    return `${token.token_type} ${token.access_token}`;
  }

  export function createFolder(name: string): Promise<File> {
    const fileMetadata = {
      'name': name,
      'mimeType': 'application/vnd.google-apps.folder'
    };
    return gapi.client.drive.files.create({
      resource: fileMetadata,
      fields: 'id'
    });
  }

  export async function createTextFile(folder: File, name: string): Promise<File> {
    const fileMetadata = {
      'name': name + ".txt",
      'mimeType': 'text/plain',
      "parents": [folder.id]
    };
    return (await gapi.client.drive.files.create({
      resource: fileMetadata
    })).result;
  }

  export async function createGDocFile(folder: File, name: string): Promise<File> {
    const fileMetadata = {
      'name': name,
      'mimeType': 'application/vnd.google-apps.document',
      "parents": [folder.id]
    };
    return (await gapi.client.drive.files.create({
      resource: fileMetadata
    })).result;
  }

  // export function createGDocFile(folder: File, name: string, content: string): Promise<any> {
  //   const fileMetadata = {
  //     'name': name,
  //     'mimeType': 'application/vnd.google-apps.document',
  //     "parents": [folder.id]
  //   };

  //   const blob = new Blob([content], { type: 'text/html' });

  //   const form = new FormData();
  //   form.append("metadata", new Blob([JSON.stringify(fileMetadata)], { type: "application/json" }));
  //   form.append("file", blob);
  //   return fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true", {
  //     method: "POST",
  //     headers: new Headers({ Authorization: `Bearer ${gapi.auth.getToken().access_token}` }),
  //     body: form,
  //   }).then(content => content.json());
  // }

  export function updateGDocFile(folder: File, file: File) {
    const fileMetadata = {
      'name': file.name,
      'mimeType': 'application/vnd.google-apps.document'
    };

    const blob = new Blob([file.content], { type: 'text/html' });

    const form = new FormData();
    form.append("metadata", new Blob([JSON.stringify(fileMetadata)], { type: "application/json" }));
    form.append("file", blob);
    return fetch("https://www.googleapis.com/upload/drive/v3/files/"+file.id +"?uploadType=multipart&supportsAllDrives=true", {
      method: "PATCH",
      headers: new Headers({ Authorization: getToken() }),
      body: form,
    }).then(content => content.json());
  }

  export function getFileContent(fileId: string): Promise<string> {
    return fetch("https://www.googleapis.com/drive/v3/files/"+fileId+"/export?mimeType=text/html", {
      headers: new Headers({ Authorization: getToken() })
    }).then(rep => rep.text());
  }

  export function listFiles(): Promise<File[]> {
    return new Promise((resolve, reject) => {
      gapi.client.drive.files.list().then(rep => resolve(rep.result.files)).catch(reject);
    });
  }

  export function searchFiles(query: string): Promise<File[]> {
    return new Promise((resolve, reject) => {
      gapi.client.drive.files.list({
        q: query
      }).then(rep => resolve(rep.result.files)).catch(reject);
    });
  }
}