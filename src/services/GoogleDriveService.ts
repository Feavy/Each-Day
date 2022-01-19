
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
  export function init(): Promise<Void> {
    return new Promise((resolve, reject) => {
      gapi.load('client:auth2', () => {
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        }).then(_ => resolve(gapi.auth2.getAuthInstance().isSignedIn.get())).catch(reject);
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

  export function createFolder(name: string) {
    const fileMetadata = {
      'name': name,
      'mimeType': 'application/vnd.google-apps.folder'
    };
    gapi.client.drive.files.create({
      resource: fileMetadata,
      fields: 'id'
    }).then(console.log).catch(console.error);
  }

  export function listFiles(): Promise<File[]> {
    return new Promise((resolve, reject) => {
      gapi.client.drive.files.list().then(rep => resolve(rep.result.files)).catch(reject);
    });
  }
}