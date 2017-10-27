var idInputText = 0; // pour identifier les inputs de façon unique

$(document).ready(function() {

  document.addEventListener('click', function(){
    createMusicBox(event);
  }); // sur click du bouton set-music

  document.getElementById('closeModalMusique').addEventListener('click', function(){
    closeModalMusique(event);
  }); // sur clic du bouton closeModalMusique

  document.getElementById('read').addEventListener('click', getForm); // sur clic du bouton Lire pour ecouter les textes saisis
});


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

// créer un bouton
function createButton(type, classe, datatoggle, datatarget, texte) {
  var button = document.createElement('button');
  button.setAttribute('type', type);
  button.setAttribute('class', classe);
  button.setAttribute('data-toggle', datatoggle);
  button.setAttribute('data-target', datatarget);
  button.appendChild(texte);
  return button;
}

// créer un élément div
function createDiv(classe, id, child) {
  var div = document.createElement('div');
  div.setAttribute('class', classe);
  div.setAttribute('id', id);

  for(var i=0; i<child.length; i++) {
    div.appendChild(child[i]);
  }
  return div;
}

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
