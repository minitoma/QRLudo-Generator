/* ============================ API GOOGLE DRIVE ========================== */

var fs = require('fs');
var readline = require('readline');
var {
  google
} = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
const TOKEN_PATH = 'token.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
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
      callback(oauth2Client, listMusic);
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
function getNewToken(oauth2Client) {
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
function listFiles(auth, callback) {

  var service = google.drive('v3');
  service.files.list({
    auth: auth,
    pageSize: 10,
    fields: "nextPageToken, files(id, name)"
  }, function(err, response, listMusic) {
    if (err) {
      console.log('The API returned an error: ' + err);
      alert('Pas de connexion internet');
      // $('#closeModalMusique').click();
      return;
    } else if (response.files.length == 0) {
      console.log('No files found.');
      alert('Aucun fichier trouvé');
      // $('#closeModalMusique').click();
      return;
    } else {
      callback(response.files);
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

/* ============================ API GOOGLE TEXT-TO-SPEECH ========================== */

var googleTTS = require('google-tts-api');
var texte = "",
  j = 0,
  audio = null;

// réupérer le formulaire et tous les champs
function getForm(data) {
  if (data) {
    texte = data;
  } else {
    var form = null;

    if (typeQR == 'atomique' || typeQR == 'ensemble') {
      form = $('form#myFormActive');
    }
    if (typeQR == 'famille') {
      var idActive = $('li.active').attr('id');
      form = $('div#content-item.' + idActive).find($('form#myFormActive'));
    }

    var tab = form.find('textarea, input');
    // parcourir le formulaire
    for (var i = 0; i < tab.length; i++) {
      try {
        texte = texte + tab[i].value + ".";
      } catch (err) {
        console.log(err);
        //document.getElementById(tab[i].id).innerHTML = err.message;
      }
    }
  }

  // transformer le texte en tableau de phrase pour eviter de depasser les 200 caractéres
  var reg = new RegExp("[.,;?!:]+", "g");
  texte = texte.split(reg);
  if (texte[texte.length - 1] == " ") {
    console.log('oui');
  }

  listen(play);
}

function listen(callback) {
  var phrase = texte[j];
  console.log(texte);
  console.log(phrase);

  // ignorer la derniére phrase s'il s'agit d'un blanc
  if (j == texte.length - 1 && texte[texte.length - 1] == " ") {
    document.getElementById('stop').click();
    return;
  }

  if (j < texte.length) {
    j++;
  } else {
    j = 0;
    texte = "";
    document.getElementById('stop').click();
  }
  callback(phrase, listen);
}

function play(phrase, callback) {
  // Play the received speech
  googleTTS(phrase, 'fr', 1) // speed normal = 1 (default), slow = 0.24
    .then(function(url) {
      console.log(url); // https://translate.google.com/translate_tts?...
      audio = new Audio(url);

      audio.addEventListener('ended', function() {
        callback(play);
      });
      audio.play();
    })
    .catch(function(err) {
      console.log(err);
      if (phrase != null && phrase != "") {
        alert('Pas de connexion internet');
      } else {
        document.getElementById('stop').click();
      }
    });
}

function stopLecture() {
  audio.pause();
  audio = null;
  texte = "";
  j = 0;
  return;
}

/**
 * Copyright © 12/02/2018, Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * The Software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders X be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the Software.
 * Except as contained in this notice, the name of the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
 */
