var idInputText = 0; // pour identifier les inputs de façon unique
var idMenu = 1; // pour identifier de facon unique les menus
var facade = null; // un objet de FacadeController

$(document).ready(function() {

  document.addEventListener('click', function(){
    createMusicBox(event);
  }); // sur click du bouton set-music

  document.getElementById('closeModalMusique').addEventListener('click', function(){
    closeModalMusique(event);
  }); // sur clic du bouton closeModalMusique

  document.getElementsByClassName('set-legende')[0].addEventListener('click', createTextBox); // sur clic du bouton creer champ texte
  document.getElementById('read').addEventListener('click', getForm); // sur clic du bouton Lire pour ecouter les textes saisis
  document.getElementById('preview').addEventListener('click', preview); // prévisualiser le qr-code
});

// fonction pour prévisualiser un qrcode
function preview() {
  var qrcode = new QRCodeAtomique(); // instancier un objet qrcode

  // on recupére le contenu du tab active
  var div = document.getElementsByClassName('tab-pane fade active in')[0];
  // on recupére le formulaire de ce div active
  var form = div.childNodes[0].childNodes[0];

  /* copier les données du formulaire dans le qrcode */
  if (form != null) {
    for(var i=0; i<form.length; i++) {

      var form2 = form.childNodes[i].childNodes;
      for(var j=0; j<form2.length; j++) {
        switch (form2[j].tagName) {
          case 'INPUT':
            console.log(form2[j].tagName);
            copyInputContent(qrcode, form2[j]);
            break;

          case 'LABEL':
            console.log(form2[j].tagName);
            copyLegendeContent(qrcode,form2[j]);
            break;

          default:
            console.log(form2[j].tagName);
        }
      }
    }
  }

  var div = document.getElementById('affichageqr').childNodes[1]; // recupérer le div correspondant
  facade = new FacadeController(qrcode, div); // instancier la facade
  facade.genererQRCode(form); // générer le qrcode
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

// créer une élément img
function createImg(id, src) {
  var img = document.createElement('img');
  img.setAttribute('id', id);
  img.setAttribute('src', src);
  return img;
}

// fonction pour créér des tabs
function createTabs () {
  var li = document.createElement('li');
  li.setAttribute('class', 'menu'+idMenu);

  if (idMenu == 1) {
    li.setAttribute('class', 'active menuActive menu'+idMenu);
  }

  var a = document.createElement('a');
  a.setAttribute('data-toggle', 'tab');
  a.setAttribute('href', '#menu'+idMenu);

  // recupérer le nom de famille saisi
  var family = document.getElementById('familyName').value;
  var texte = document.createTextNode(family);
  if(family == "" || family == null) {
    texte = document.createTextNode('Famille ' + idMenu);
  }
  a.appendChild(texte);
  li.appendChild(a);
  document.querySelector('.nav-tabs').appendChild(li);

  createTabContent(a.getAttribute('href'), idMenu);
  idMenu++;
}

// créer le contenu des tabs
function createTabContent (id, idMenu) {

  var div2 = createDiv('row', 'content-form', [createForm('myForm')]);

  var button = createButton('button', 'btn btn-default addChamp', 'modal', '#myModal', document.createTextNode('Ajouter un champ'));
  var div4 = createDiv('col-md-6', '', [button]);

  var button = createButton('button', 'btn btn-default closeTab', '', '', document.createTextNode('Annuler'));
  var div5 = createDiv('col-md-6', '', [button]);

  var div3 = createDiv('row', '', [div4, div5]);

  var classe = 'tab-pane fade';
  if (idMenu == 1) {
    classe = 'tab-pane fade in active';
  }

  var div = createDiv(classe, id.substring(1), [div2, div3]);
  document.getElementsByClassName('tab-content')[0].appendChild(div);
}

// fonction pour ajouter un champ
function addChamp(event) {
  var element = event.target;
  if(element.tagName == 'BUTTON' && element.classList.contains("addChamp")){
    // retourne le formulaire contenu dans le tab active
    var form = document.getElementsByClassName('in active')[0].childNodes[0].childNodes;
  }
}

// copier le contenu d'un element input
function copyInputContent(qrcode, input) {
  // tester s'il s'agit d'un input de musique
  if(input.disabled) {
    var url = 'https://drive.google.com/open?id=' + input.id;
    qrcode.ajouterFichier(url, input.value);
  } else {
    qrcode.ajouterTexte(input.value);
  }
}


// copier le contenu d'un element legende
function copyLegendeContent(qrcode, legende) {
  qrcode.ajouterTexte(legende.textContent);
}
