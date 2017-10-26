

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

var idInputText = 0; // pour identifier les inputs de façon unique

$(document).ready(function() {

  document.addEventListener('click', function(){
    createMusicBox(event);
  }); // sur click du bouton closeTab

  document.getElementById('closeModalMusique').addEventListener('click', function(){
    closeModalMusique(event);
  }); // sur clic du bouton closeModalMusique
});


// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'drive-nodejs-quickstart.json';
/*
// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Drive API.
  authorize(JSON.parse(content), listFiles);
});
*/
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
      callback(oauth2Client, listeMusic, event);
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
  }, function(err, response, listeMusic) {
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



// fcontion pour créer un label
function createLabel (fore, texte) {
  var label = document.createElement('label');
  label.setAttribute('for', fore);
  var texte = document.createTextNode('Légende');
  label.appendChild(texte);
  return label;
}

// fonction pour une zone de texte
function createInput (type, classe, id, value) {
  var input = document.createElement('input');
  input.setAttribute('type', type);
  input.setAttribute('class', classe);
  idInputText++;
  input.setAttribute('id', id+idInputText);
  input.setAttribute('value', value);
  return input;
}

// Générer une zone de texte
function createTextBox() {

  var child = [createLabel('legende', 'Légende'), createInput('text', 'form-control', 'legende', '')];
  var div = createDiv('form-group', '', child);

  var form = document.getElementsByClassName('in active')[0].childNodes[0].childNodes[0];
  form.appendChild(div);

  document.getElementById('closeModal').click(); // fermer le popup
  //var i = idInputText - ;
  //document.getElementById("legende"+idInputText).focus(); // placer le curseur sur le champ de texte crée
  //console.log(i, idInputText);
}
//export default createTextBox;

// créer un formulaire
function createForm(id) {
  var form = document.createElement('form');
  form.setAttribute('id', id);
  return form;
}

// Générer un champ pour de la musique
function createMusicBox(event) {
  var element = event.target;
  if(element.tagName == 'BUTTON' && element.classList.contains("set-music")){
    // Load client secrets from a local file.
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
      if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
      }
      // Authorize a client with the loaded credentials, then call the Drive API.
      authorize(JSON.parse(content), listFiles, event);
    });
  }
}

function createButton(type, classe, datatoggle, datatarget, texte) {
  var button = document.createElement('button');
  button.setAttribute('type', type);
  button.setAttribute('class', classe);
  button.setAttribute('data-toggle', datatoggle);
  button.setAttribute('data-target', datatarget);
  button.appendChild(texte);
  return button;
}

function createDiv(classe, id, child) {
  var div = document.createElement('div');
  div.setAttribute('class', classe);
  div.setAttribute('id', id);

  for(var i=0; i<child.length; i++) {
    div.appendChild(child[i]);
  }
  return div;
}

// liste de la musique dispo sur le drive
function listeMusic(event, content){
  var element = event.target;
  if(element.tagName == 'BUTTON' && element.classList.contains("set-music")){
    var div = document.getElementById('modalMusic').childNodes[1].childNodes[1].childNodes[3];
    for (var i = 0; i < content.length; i++) {
        var a = document.createElement('a');
        a.setAttribute('class', 'hrefMusic');
        a.setAttribute('href', '#' + content[i].id);
        a.appendChild(document.createTextNode(content[i].name));
        var child = [a];
      div.appendChild(createDiv('col-md-12', '', child));
    }
  }
}



/*

  /*
    var div = document.createElement('div');
    div.setAttribute('class', 'form-group');

    div.appendChild(createLabel('lienMusic', 'Lien de la Musique'));

    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('class', 'form-control');
    input.setAttribute('id', 'legende');

    div.appendChild(input);

    var form = document.getElementById('myForm');
    form.appendChild(div);

    document.getElementById('closeModal').click(); // fermer le popup
  }
}*/

/*
var form = document.getElementById('myForm');

document.getElementById('addText').addEventListener('click', function(e) {
  form.appendChild(createTextBox());
});
*/


/*
// Générer une zone de texte
function createTextBox() {
  var input = document.createElement('input');
  input.type = 'text';
  return input;
}
*/

// effacer la liste des musiques avant de fermer le popup musique
function closeModalMusique(event) {
  if (event) {
    var element = event.target;
    childNodes = element.parentNode.parentNode.childNodes[3];

    while (childNodes.firstChild) {
      childNodes.removeChild(childNodes.firstChild);
    }
  }
}
