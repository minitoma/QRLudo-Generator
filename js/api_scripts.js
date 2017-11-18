/* ============================ API GOOGLE DRIVE ========================== */

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, event) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client, listMusic, event);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth, callback, event) {
  var service = google.drive('v3');
  service.files.list({
    auth: auth,
    pageSize: 10,
    fields: "nextPageToken, files(id, name)"
  }, function(err, response, listMusic) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var files = response.files;
    if (files.length == 0) {
      console.log('No files found.');
    } else {
  //    console.log('Files:');
      /*for (var i = 0; i < files.length; i++) {
        var file = files[i];
        console.log('%s (%s)', file.name, file.id);
      }*/
      callback(event, files);
    }
  });
}

// liste de la musique dispo sur le drive
function listMusic(event, content){
  var element = event.target;
  if(element.tagName == 'BUTTON' && element.classList.contains("set-music")){
    var div = document.getElementById('modalMusic').childNodes[1].childNodes[1].childNodes[3];
    for (var i = 0; i < content.length; i++) {
        var a = document.createElement('a');
        a.setAttribute('class', 'hrefMusic');
        a.setAttribute('href', '#' + content[i].id);
        a.appendChild(document.createTextNode(content[i].name));
      div.appendChild(createDiv('col-md-12', '', [a]));
    }
  }
}

/* ============================ API GOOGLE TEXT-TO-SPEECH ========================== */

var googleTTS = require('google-tts-api');

// réupérer le formulaire et tous les champs
function Listen() {
  var form = document.getElementsByClassName('in active')[0].childNodes[0].childNodes[0];
  var texte = "";
  // parcourir le formulaire
  for (var i=0; i<form.length || function(){

    // Play the received speech
    googleTTS(texte, 'fr', 1)   // speed normal = 1 (default), slow = 0.24
    .then(function (url) {
      console.log(url); // https://translate.google.com/translate_tts?...
      var audio = new Audio(url);
      audio.play();
      console.log(texte);
    })
    .catch(function (err) {
      console.error(err.stack);
    });

    return false;}();
     i++) {
    try {
        if (form.elements[i].type == "text") {
          texte = texte + form.elements[i].value + ". ";
      } else {
        console.log("pas de type texte");
      }
    } catch (err) {
      document.getElementById(form.elements[i].id).innerHTML = err.message;
    }
  }
}
