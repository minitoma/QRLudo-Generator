var idInputText = 0; // pour identifier les inputs de façon unique
var idMenu = 1; // pour identifier de facon unique les menus
var facade = new FacadeController();
var tabQRCode = null;

$(document).ready(function() {

  document.getElementById('closeModalMusique').addEventListener('click', function(){
    closeModalMusique(event);
  }); // sur clic du bouton closeModalMusique

  document.getElementsByClassName('set-legende')[0].addEventListener('click', function(){
    createTextBox('');
  }); // sur clic du bouton creer champ texte

  document.getElementById('read').addEventListener('click', function(){
    this.parentNode.parentNode.style.display = 'none';
    document.getElementById('stop').parentNode.parentNode.style.display = 'block';
    getForm();
  }); // sur clic du bouton Lire pour ecouter les textes saisis
  document.getElementById('stop').addEventListener('click', function(){
    this.parentNode.parentNode.style.display = 'none';
    document.getElementById('read').parentNode.parentNode.style.display = 'block';
    stopLecture();
  });
  document.getElementById('preview').addEventListener('click', preview); // prévisualiser le qr-code
  document.getElementById('createQRCodeAtomique').addEventListener('click', function(){
    baseViewQRCodeAtomique(createTextBox);
  }); // création d'un qrcode atomique
  document.getElementById('setNameQRCode').addEventListener('click', function(){
    createTabs();
    document.getElementById('creer').disabled = true;
    document.getElementById('import').disabled = true;
    //baseViewQRCodeEnsemble(createTextBox);
  }); // creation d'une famille de qrcode atomique
});


// fcontion pour créer un label
function createLabel (fore, texte) {
  var label = document.createElement('label');
  if (fore) label.setAttribute('for', fore);
  if (texte) label.appendChild(document.createTextNode(texte));
  return label;
}

// fonction pour une zone de texte
function createTextarea (classe, id, textcontent) {
  var textarea = document.createElement('textarea');
  if (classe) textarea.setAttribute('class', classe);
  idInputText++;
  if (id) textarea.setAttribute('id', id+idInputText);
  if (textcontent) textarea.appendChild(document.createTextNode(textcontent));
  textarea.setAttribute('placeholder', 'Mettre la légende');
  return textarea;
}

// fonction pour une zone de texte
function createInput (type, classe, id, value, src, datatoggle, datatarget) {
  var input = document.createElement('input');
  if (type) input.setAttribute('type', type);
  if (classe) input.setAttribute('class', classe);
  idInputText++;
  if (id) input.setAttribute('id', id);
  if (value) input.setAttribute('value', value);
  if (src) input.setAttribute('src', __dirname+'/img/'+src);
  if (datatoggle) input.setAttribute('data-toggle', datatoggle);
  if (datatarget) input.setAttribute('data-target', datatarget);
  input.setAttribute('disabled', 'disabled');
  return input;
}

// créer un bouton
function createButton(type, classe, datatoggle, datatarget, texte) {
  var button = document.createElement('button');
  if (type) button.setAttribute('type', type);
  if (classe) button.setAttribute('class', classe);
  if (datatoggle) button.setAttribute('data-toggle', datatoggle);
  if (datatarget) button.setAttribute('data-target', datatarget);
  if (texte) button.appendChild(document.createTextNode(texte));
  return button;
}

// Générer une zone de texte
function createTextBox (textContent) {
  /*
  '<div class="form-group">'+
    '<div class="row">'+
      '<div class="col-md-9">'+
        '<textarea class="form-control" id="legende1"></textarea>'+
      '</div>'+
      '<div class="col-md-3">'+
        '<button type="button" class="btn btn-default addChamp" data-toggle="modal" data-target="#myModal">Ajouter un champ1</button>'+
      '</div>'+
    '</div>'+
  '</div>'+
*/
  var div2 = createDiv('col-md-9', null, [createTextarea('form-control', 'legende', textContent)]);
  var btnAdd = createButton('button', 'btn btn-default addChamp', 'modal', '#myModal', null);
  var btnDelete = createButton('button', 'btn btn-default deleteChamp', null, null, null);
  btnAdd.appendChild(createInput('image', null, null, null, 'add.png', null, null));
  btnDelete.appendChild(createInput('image', 'deleteChamp', null, null, 'delete.png', null, null));
  var div3 = createDiv('col-md-6', null, [btnAdd]);
  var div4 = createDiv('col-md-6', null, [btnDelete]);
  var div = createDiv('form-group', null, [createDiv('row', null, [div2, createDiv('col-md-3', null, [createDiv('row', null, [div3, div4])])])]);
  var form = document.getElementsByClassName('in active')[0].childNodes[0].childNodes[0];
  form.appendChild(div);

  // ajouter un eventlistener sur deleteChamp pour supprimer le champ sur click du bouton
  btnDelete.addEventListener('click', function(){
    form.removeChild(div); // suppression du champ
    // ajout des btn add et delete au champ précédent si il existe
    if (form.length != 0) {
      // recupérer le texte saisi avant de remplacer
      var textContent = form.childNodes[form.length-1].childNodes[0].childNodes[0].childNodes[0].value;
      // recréer le input et le div form-group
      div2 = createDiv('col-md-9', null, [createTextarea('form-control', 'legende', textContent)]);
      div = createDiv('form-group', null, [createDiv('row', null, [div2, createDiv('col-md-3', null, [createDiv('row', null, [div3, div4])])])]);
      // recréer le champ précédent avec les boutons add et delete
      form.replaceChild(div, form.childNodes[form.length-1]);
    } else {
      // il n' y a plus de champ on réinitilise l'application
      init_View();
    }
  });

  // activer les boutons preview et lire
  document.getElementById('preview').disabled = false;
  document.getElementById('read').disabled = false;

  document.getElementById('closeModal').click(); // fermer le popup
  // s'il ya plus d'un champ, on supprime le btn add de l'avant dernie champ
  if (document.getElementById('myForm').childNodes.length > 1) { deleteAddBtn(); }
}

// créer un formulaire
function createForm(id) {
  var form = document.createElement('form');
  if (id) form.setAttribute('id', id);
  return form;
}

// Générer un champ pour de la musique
function createMusicBox () {
  // Load client secrets from a local file.
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the Drive API.
    authorize(JSON.parse(content), listFiles);
  });
}


// créer un élément div
function createDiv(classe, id, child) {
  var div = document.createElement('div');
  if (classe) div.setAttribute('class', classe);
  if (id) div.setAttribute('id', id);

  if (child) {
    for(var i=0; i<child.length; i++) {
      div.appendChild(child[i]);
    }
  }

  return div;
}

// créer une élément img
function createImg(id, src) {
  var img = document.createElement('img');
  if (id) img.setAttribute('id', id);
  if (src) img.setAttribute('src', src);
  return img;
}

// fonction pour créér des tabs
function createTabs () {
  // initialiser le tableau de qrcode
  tabQRCode = [];

  document.getElementsByClassName('nav nav-tabs')[0].style.display = 'block';
  document.getElementById('nameFamily').style.display = 'block';
  var li = document.createElement('li');
  li.setAttribute('class', 'menu menu'+idMenu);

  var a = document.createElement('a');
  a.setAttribute('data-toggle', 'tab');
  a.setAttribute('href', '#menu'+idMenu);

  // recupérer le nom de famille saisi
  var family = document.getElementById('nameQRCode').value;
  var texte = document.createTextNode(family);
  if (family == "" || family == null) {
    texte = document.createTextNode('Sans titre');
  }
  createTabContent(a.getAttribute('href'), idMenu, li);

  a.appendChild(texte);

  li.appendChild(a);
  li.addEventListener('click', function(){
    switchTab(event, null);
  });
  document.querySelector('.nav-tabs').appendChild(li);
  idMenu++;
  switchTab(null, true);
}

// créer le contenu des tabs
function createTabContent (id, idMenu, li) {

  var button = createButton('button', 'btn btn-default addChamp', 'modal', '#myModal', document.createTextNode('Ajouter un champ'+idMenu));

  var checkbox = createInput('checkbox', null, 'checkBraille', null, null, null, null);
  checkbox.disabled = false;

  var div4 = createDiv('col-md-6 text-center', null, [checkbox, document.createTextNode('Texte en braille')]);
  // palette de couleur pour la couleur du qrcode
  var inputColorQR = createInput('color', null, 'colorQR', null, null, null, null);
  var div5 = createDiv('col-md-6 text-center', null, [inputColorQR]);

  var input = createInput('text', null, 'braille', null, null, null, null);
  input.setAttribute('maxlength', '2');
  input.setAttribute('title', 'Texte en braille');
  input.disabled = false;

  var inputColorBraille = createInput('color', null, 'colorBraille', null, null, null, null);
  inputColorQR.setAttribute('title', 'Couleur du QRCode');
  inputColorBraille.setAttribute('title', 'Couleur du texte en braille');
  inputColorQR.disabled = false;
  inputColorBraille.disabled = false;
  // champ pour braille au milieu du qrcode
  var div6 = createDiv('col-md-3 text-center', null, [input]);
  var div7 = createDiv('col-md-3 text-center', null, [inputColorBraille]);
  var div8 = createDiv('col-md-6', null, null);

  var div3 = createDiv('row', null, [div4, div5]);
  var div9 = createDiv('row', null, [div6, div7, div8]);
  div9.style.display = 'none';

  var classe = 'tab-pane fade';

  var div2 = createDiv('row', 'content-form', [createForm('myForm'), div3, div9]);
  var div = createDiv(classe, id.substring(1), [div2]);
  setActive(div, li);
  document.getElementsByClassName('tab-content')[0].appendChild(div);

  // ajouter un eventlistener au checbox pour afficher ou masquer les options du braille
  checkbox.addEventListener('change', function(){
    if (this.checked) {
      div9.style.display = 'block';
    } else {
      div9.style.display = 'none';
    }
  });

  createTextBox(null);
}

// fonction pour ajouter un champ
/*
function addChamp(event) {
  var element = event.target;
  if(element.tagName == 'BUTTON' && element.classList.contains("addChamp")){
    // retourne le formulaire contenu dans le tab active
    var form = document.getElementsByClassName('in active')[0].childNodes[0].childNodes;
  }
}
*/

// fonction pour prévisualiser un qrcode
function preview () {
  // famille de qrcode
  if (document.getElementById('nameFamily').style.display == 'block') {
    if (document.getElementById('nameFamily').value == '') {
      alert("Veuillez saisir le nom de la famille");
    } else {
      previewQRCode();
    }
//  } else if (document.getElementById('nameFamily').style.display == 'none' && document.getElementById('nameFamily').value == '') { // qrcode atomique
  } else {
    previewQRCode();
  }
}

// fonction appelée pour faire le view du qrcode
function drawQRCode (qrcode) {
  var buffer = document.implementation.createDocument(null, 'html', null);
  var body = document.createElementNS('', 'body');
  //body.appendChild(document.createRange().createContextualFragment(data));
  buffer.documentElement.appendChild(body);

  //createTabs();
  baseViewQRCodeAtomique(null);
  document.getElementById('colorBraille').setAttribute('value', qrcode.getColorBraille()); // restaurer la couleur du braille
  document.getElementById('colorQR').setAttribute('value', qrcode.getColorQRCode()); // restaurer la couleur du qrcode
  document.getElementById('braille').setAttribute('value', qrcode.getTexteBraille()); // restaurer le texte en braille
  for (var i=0; i<qrcode.getTailleContenu(); i++){

    if (qrcode.getTypeContenu(i) == DictionnaireXml.getTagTexte()){
      createTextBox(qrcode.getTexte(i));
    }
    else if (qrcode.getTypeContenu(i) == DictionnaireXml.getTagFichier()){
      var nom = qrcode.getNomFichier(i);
      var url = qrcode.getUrlFichier(i);
      selectMusic (null, [url, nom]); // appel de selectMusic pour créer un chap input de music
    }
  }
}

// retourne l'architecture html de base pour un qrcode atomique
function baseViewQRCodeAtomique (callback) {
  var html =
      '<div class="tab-pane fade active in" id="menu1">'+
        '<div class="row" id="content-form">'+
          '<form id="myForm"></form>'+
      '</div></div>';

  document.getElementsByClassName('tab-content')[0].innerHTML = html;

  // bouton pour fermer annuler la création du qrcode et champ pour braille au milieu du qrcode
  html =
    '<div class="row"><div class="col-md-6 text-center"><input type="checkbox" id="checkBraille">Texte en braille</div>'+
    '<div class="col-md-6 text-center"><input type="color" id="colorQR" title="Couleur du QRCode"/></div></div>'+
        //'<button type="button" class="btn btn-default" id="closeForm">Annuler</button>'+
    '<div class="row" style="display:none;"><div class="col-md-3 text-center"><input type="text" id="braille" title="Texte en braille" maxlength="2"></div>'+
    '<div class="col-md-3 text-center"><input type="color" id="colorBraille" title="Couleur du texte en braille"/></div>'+
    '<div class="col-md-6 text-center"></div></div>';

  //document.getElementsByClassName('tab-content')[0].innerHTML += html;
  document.getElementById('content-form').innerHTML += html;

  // ajouter un eventlistener au checbox pour afficher ou masquer les options du braille
  document.getElementById('checkBraille').addEventListener('click', function(){
    if (this.checked) {
      document.getElementById('braille').parentNode.parentNode.style.display = 'block';
    } else {
      document.getElementById('braille').parentNode.parentNode.style.display = 'none';
    }
  });

  // appel de la fonction init_View sur clic du bouton
  //document.getElementById('closeForm').addEventListener('click', init_View);
  document.getElementsByClassName('nav nav-tabs')[0].style.display = 'none';
  document.getElementById('nameFamily').style.display = 'none';
  // activer les boutons lire et preview
  document.getElementById('preview').disabled = false;
  document.getElementById('read').disabled = false;
  // désactiver les bouton import et creer
  document.getElementById('creer').disabled = true;
  document.getElementById('import').disabled = true;
  if (callback) callback(null);
}

// retourne l'architecture html de base pour une famille de qrcode
function baseViewQRCodeEnsemble (callback) {
  document.getElementsByClassName('nav nav-tabs')[0].style.display = 'block';

  var html =
      '<div class="tab-pane fade active in" id="menu1">'+
        '<div class="row" id="content-form">'+
          '<form id="myForm"></form>'+
        '</div>'+
      '</div> ';

  document.getElementsByClassName('tab-content')[0].innerHTML = html;
  if (callback) callback(null);
}
