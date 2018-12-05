/**
 * @Author: alassane
 * @Date:   2018-12-01T14:38:30+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-01T15:56:17+01:00
 */


const fs = require('fs');
const readline = require('readline');
const {
  google
} = require('googleapis');

// If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
const SCOPES = ['https://www.googleapis.com/auth/drive'] // pour les permisssions d'Ã©criture dans le drive
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  // authorize(JSON.parse(content), insertFile);
  authorize(JSON.parse(content), listFiles);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {
    client_secret,
    client_id,
    redirect_uris
  } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
  const drive = google.drive({
    version: 'v3',
    auth
  });
  drive.files.list({
    // pageSize: 20,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      listMusic(files);
      listJson(files);
      files.map((file) => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log('No files found.');
    }
  });
}

// liste de la musique dispo sur le drive
function listMusic(content) {
  // var div = document.getElementById('listeMusic').childNodes[1].childNodes[1].childNodes[3];
  var div = document.getElementById('elementsAudio');
  // return false;

  for (var i = 0; i < content.length; i++) {
    if (content[i].name.endsWith(".mp3")) {
      var b = document.createElement('button');
      b.setAttribute('type', 'button');
      b.setAttribute('class', 'list-group-item list-group-item-action');
      b.setAttribute('onclick', 'ajouterChampSon("'+content[i].name+'","'+content[i].id+'");');
      b.appendChild(document.createTextNode(content[i].name));
      div.appendChild(b);
    }
  }
}


// liste de la musique dispo sur le drive
function listJson(content) {
  // var div = document.getElementById('listeMusic').childNodes[1].childNodes[1].childNodes[3];
  var div = document.getElementById('elementsJson');
  // return false;

  for (var i = 0; i < content.length; i++) {
    if (content[i].name.endsWith(".json")) {
      var b = document.createElement('button');
      b.setAttribute('type', 'button');
      b.setAttribute('class', 'list-group-item list-group-item-action');
      b.setAttribute('onclick', 'ajouterChampJson("'+content[i].name+'","'+content[i].id+'");');
      b.appendChild(document.createTextNode(content[i].name));
      div.appendChild(b);
    }
  }
}


function insertFile(auth) {

  nomDeFichier = getNomFichierJsonToUpload();

  const drive = google.drive({
    version: 'v3',
    auth
  });

  var fileMetadata = {
    'name': nomDeFichier+'.json'
  };
  var media = {
    mimeType: 'text/plain', //mimeType -> https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types
    body: fs.createReadStream('QR-Unique/json/'+nomDeFichier+'.json'),
  };

  drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  }, function(err, file) {
    if (err) {
      // Handle error
      console.error(err);
    } else {
      console.log('File Id:', file.id);
    }
  });

}
