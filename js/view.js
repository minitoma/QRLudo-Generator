var facade = new FacadeController();
var tabQRCode = [];
var typeQR; // rens le type de qrcode


$(document).ready(function() {

  // effacer la liste des musiques avant de fermer le popup
  $('#closeModalMusique').click(function(e){
    $('#modalMusic').find('div.modal-header.row').empty();
    e.stopImmediatePropagation();
  });

  $('button.set-legende').click(function(){ createItemContent($('li.active').attr('id'), null); }); // sur clic du bouton creer champ texte

  $('button#read').click(function(){
    $('div.colRight > form > div:nth-child(2)').css('display', 'none');
    $('div.colRight > form > div:nth-child(3)').css('display', 'block');
    getForm(null);
  }); // sur clic du bouton Lire pour ecouter les textes saisis
  $('button#stop').click(function(){
    $('div.colRight > form > div:nth-child(3)').css('display', 'none');
    $('div.colRight > form > div:nth-child(2)').css('display', 'block');
    stopLecture();
  });
  document.getElementById('preview').addEventListener('click', preview); // prévisualiser le qr-code
  $('a#createQRCodeAtomique').click(function(){
    baseViewQRCodeAtomique(createItemContent);
  }); // création d'un qrcode atomique

  // créer un qrcode ensemble
  $('a#createQRCodeEnsemble').click(function(){
    baseViewQRCodeEnsemble(null);
    /* drag and drop concernant le qrcode ensemble */
    var holder = $('html')[0];

    holder.ondragover = () => {
        return false;
    };

    holder.ondragleave = () => {
        return false;
    };

    holder.ondragend = () => {
        return false;
    };

    holder.ondrop = (e) => {
      e.preventDefault();

      for (let f of e.dataTransfer.files) {
        console.log(f);
        if (f) { facade.importQRCode(f); }
      }

      return false;
    };
    /* fin drag and drop concernant le qrcode ensemble */
  }); // création d'un qrcode ensemble

  $('#setNameQRCode').click(function(e){
    if ($('#nameQRCode').val()) {
      createItems(false);
      $('#nameQRCode').val('');
      $('#creer').attr('disabled', true);
      $('#import').attr('disabled', true);
    } else {
      e.preventDefault();
    }
  }); // creation d'une famille de qrcode atomique

  $('#nameQRCode').keypress(function(e){
    var key = e.keyCode;
    if (!(key >= 65 && key <= 90) && !(key >= 97 && key <= 122)) {
      e.preventDefault();
    }
  });

});


// fonction pour une zone de texte
function createTextarea (classe, id, textcontent) {
  var textarea = document.createElement('textarea');
  if (classe) textarea.setAttribute('class', classe);
  if (id) textarea.setAttribute('id', id);
  if (textcontent) textarea.appendChild(document.createTextNode(textcontent));
  textarea.setAttribute('placeholder', 'Mettre la légende');
  return textarea;
}

// fonction pour une zone de texte
function createInput (type, classe, id, value, src, datatoggle, datatarget, title) {
  var input = document.createElement('input');
  if (type) input.setAttribute('type', type);
  if (classe) input.setAttribute('class', classe);
  if (id) input.setAttribute('id', id);
  if (value) input.setAttribute('value', value);
  if (src) input.setAttribute('src', __dirname+'/img/'+src);
  if (datatoggle) input.setAttribute('data-toggle', datatoggle);
  if (datatarget) input.setAttribute('data-target', datatarget);
  if (title) input.setAttribute('title', title);
  input.setAttribute('disabled', 'disabled');
  return input;
}

function createClickableImg (classe, src, title) {
  var a = document.createElement('A');
  var img = document.createElement('IMG');
  img.setAttribute('class', 'clickableImg '+ classe)
  img.setAttribute('src', __dirname+'/img/'+src);
  img.setAttribute('title', title);

  if (src == 'add.png') {
    img.setAttribute('data-toggle', 'modal')
    img.setAttribute('data-target', '#myModal');
  }

  a.append(img);
  return a;
}

// créer un élément div
function createDiv(classe, id, child) {
  var div = document.createElement('DIV');
  if (classe) div.setAttribute('class', classe);
  if (id) div.setAttribute('id', id);

  if (child) {
    for(var i=0; i<child.length; i++) {
      div.appendChild(child[i]);
    }
  }

  return div;
}

// Générer un champ pour de la musique
function createMusicBox () {
  try {
    // Load client secrets from a local file.
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
      if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
      }
      // Authorize a client with the loaded credentials, then call the Drive API.
      authorize(JSON.parse(content), listFiles);
    });
  } catch (e) {
    alert('Erreur : ' + e.stack);
  }
}

// créer le contenu d'un item à partir de l'id renseigné.
function createItemContent (idActive, data) {
  try {
    var textarea = createTextarea('form-control', 'legende', data ? data:null);
    var div2 = createDiv('col-md-12', null, [textarea]);

    var btnAdd    =   createClickableImg('addChamp', 'add.png', 'Ajouter un nouveau champ');
    var btnDelete =   createClickableImg('deleteChamp', 'delete.png', 'Supprimer ce champ');
    var btnPlay   =   createClickableImg('playChamp', 'play.png', 'Ecouter le contenu du champ');

    var span = document.createElement('SPAN');
    span.append(btnAdd, btnDelete, btnPlay);
    var div3 = createDiv('col-md-12 optButton', null, [span]);

    var div = createDiv('form-group', null, [createDiv('row', null, [div2, div3])]);
    var form;

    if (typeQR == 'atomique') { form = $('form#myFormActive'); }
    if (typeQR == 'ensemble') { form = $('form#myFormActive'); }
    if (typeQR == 'famille')  { form = $('div#content-item.'+idActive).find($('form#myFormActive')); }

    form.append(div);

    // ajout un event sur click du bouton supprimer champ
    $('img.deleteChamp').click(function(){
      $(this).parents('div.form-group').remove();
      // supprimer le qrcode s'il n'y a plus de champs textarea
      if (form.find('textarea').length == 0) {
        if (typeQR == 'atomique') { init_View(); }
        if (typeQR == 'famille')  { $('div#content-item.'+idActive+' > input[title="Supprimer ce qrcode"]').trigger('click'); }
      }
    });

    // ajouter un eventlistener sur playChamp pour lire le champ sur click du bouton
    $('img.playChamp').click(function(event){
      console.log(event.target);
      var texte = event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].value;
      getForm(texte);
    });

    // activer/desactiver les boutons
    $('#preview, #read').attr('disabled', false);
    $('#creer, #import').attr('disabled', true);

    $('#closeModal').trigger('click'); // fermer le popup d'ajout d'un nouveau champ

  } catch (e) {
    alert('Erreur : ' + e.stack);
  }
}

/*
 fonction pour créér des items
 si imported = true : cette fonction est appelée pour recréer une famille de qrcode
*/
function createItems (imported) {
  try {

    if ($('div#nameproject').children().length == 0) {
      $('div#nameproject').append('<p><h6>Famille de QR-Code</h6></p>');
    }

    typeQR = 'famille';
    $('#nameFamily').css('display', 'block');
    $('div.tab-content-qrcode-family.row').css('display', 'block');
    $('div.tab-content-qrcode-unique').css('display', 'none');

    var li = document.createElement('LI');
    li.setAttribute('id', $('#nameQRCode').val());
    li.setAttribute('class', 'list-group-item');
    li.appendChild(document.createTextNode($('#nameQRCode').val()));
    $('ul#sortable').append(li);

    $('ul#sortable > li').click(function(){
      $('.tab-content-liste-content > div').css('display', 'none');
      $('ul#sortable > li').removeClass('active');
      $(this).addClass('active');
      $('.tab-content-liste-content > div.'+this.id).css('display', 'block');
    });

    // Afficher le nom du qrcode
    var div = createDiv($('#nameQRCode').val(), 'content-item', [document.createTextNode($('#nameQRCode').val().toUpperCase())]);

    //ajout du bouton pour supprimer un qrcode.
    var inputDel = createInput('image', null, null, null, 'delete.png', null, null, 'Supprimer ce qrcode');
    inputDel.disabled = false;
    div.append(inputDel);
    $('div.tab-content-liste-content').append(div);

    //supprimer l'item et le content-item
    $('div#content-item > input[title="Supprimer ce qrcode"]').click(function(){
      $(this).parent().remove();
      $('li#'+$(this).parent().attr('class')).remove();
      $('ul#sortable > li:first-child').click();

      // reinitialiser la vue s'il n'y a plus de qrcode
      if ($('li.active').length == 0) {
        init_View();
      }
    });

    $('ul#sortable > li:last-child').trigger('click');

    var html =
        '<div class="row" id="content-form">'+
          '<form id="myFormActive"></form>'+
      '</div>';

    $('.tab-content-liste-content > #content-item:last-child').append(html);

    // bouton pour fermer annuler la création du qrcode et champ pour braille au milieu du qrcode
    html =
      '<div class="row"><div class="col-md-6 text-center"><input type="checkbox" id="checkBraille">Texte en braille</div>'+
      '<div class="col-md-6 text-center"><input type="color" id="colorQR" title="Couleur du QRCode"/></div></div>'+
          //'<button type="button" class="btn btn-default" id="closeForm">Annuler</button>'+
      '<div class="row" style="display:none;"><div class="col-md-3 text-center"><input type="text" id="braille" title="Texte en braille" maxlength="2"></div>'+
      '<div class="col-md-3 text-center"><input type="color" id="colorBraille" title="Couleur du texte en braille"/></div>'+
      '<div class="col-md-6 text-center"></div></div>';

    $('.tab-content-liste-content > #content-item:last-child > #content-form').append(html);

    // ajouter un eventlistener au checbox pour afficher ou masquer les options du braille
    $('input#checkBraille').change(function(){
      if ($(this).prop('checked')) {
        $('div#content-item.'+$('li.active').attr('id')+' > div#content-form > div:nth-child(3)').css('display', 'block');
      } else {
        $('div#content-item.'+$('li.active').attr('id')+' > div#content-form > div:nth-child(3)').css('display', 'none');
      }
    });

    if (!imported) {
      createItemContent($('li.active').attr('id'), null);
    }
  } catch (e) {
    alert('Erreur : ' + e.stack);
  }
}

// fonction pour prévisualiser un qrcode
function preview () {
  try {
    // famille de qrcode
    if (typeQR == 'famille') {
      if ($('#nameFamily').val() == '') {
        alert("Veuillez saisir le nom de la famille");
      } else {
        $('#previewFamily, #initView').css('display', 'block'); // afficher le bouton terminer
        previewQRCode(true); // true pour famille
      }
    }

    // pour qrcode atomique, pas de famille
    if (typeQR == 'atomique' || typeQR == 'ensemble') { previewQRCode(false); }
  } catch (e) {
    alert('Erreur : ' + e.stack);
  }
}

// fonction appelée pour faire le view d'une famille de  qrcode
function drawQRCodeFamille (qrcode) {
  try {
    for (var i = 0; i < qrcode.length; i++) {
      var qr = qrcode[i];
      console.log(qr.getDonneesUtilisateur());
      console.log(qr.getMetadonnees());
      // appel de createItems avec true pour recréer une famille importée
      $('#nameQRCode').val(qr.getNomQRCode());
      createItems(true);
      var activeItem = $('div#content-item.'+$('li.active').attr('id'));
      // s'il y a du texte en braille
      if (qr.getTexteBraille() != null && qr.getTexteBraille() != "") {
        activeItem.find($('input#colorBraille')).val(qr.getColorBraille()); // restaurer la couleur du braille
        activeItem.find($('input#braille')).val(qr.getTexteBraille()); // restaurer le texte en braille
        activeItem.find($('input#checkBraille')).trigger('click');
      }
      // recupérer et restaurer la couleur du qrcode
      activeItem.find($('input#colorQR')).val(qr.getColorQRCode()); // restaurer la couleur du qrcode
      for (var j=0; j<qr.getTailleContenu(); j++){

        if (qr.getTypeContenu(j) == DictionnaireXml.getTagTexte()) {
          createItemContent($('li.active').attr('id'), qr.getTexte(j));
        } else if (qr.getTypeContenu(j) == DictionnaireXml.getTagFichier()) {
           // appel de selectMusic pour créer un champ input de music
          selectMusic(null, [qr.getUrlFichier(j), qr.getNomFichier(qr.getUrlFichier(j))]);
        }
      }
    }

    $('#nameFamily').val(qrcode[0].getNomFamille())
                    .css('display', 'block');
    $('#creer, #import').attr('disabled', true);

  } catch (e) {
    alert('Erreur : ' + e.stack);
  }
}

// fonction appelée pour faire le view du qrcode atomique
function drawQRCodeAtomique (qrcode) {
  try {
    if (qrcode.getTypeQR() == 'ensemble') {
      drawQRCodeAtomiqueEnsemble(qrcode, true);
      return;
    }
    if (typeQR == 'ensemble') {
      drawQRCodeAtomiqueEnsemble(qrcode, false);
      return;
    }

    baseViewQRCodeAtomique(null);

    if (qrcode.getTexteBraille() != null && qrcode.getTexteBraille() != "") {
      $('input#colorBraille').val(qrcode.getColorBraille()); // restaurer la couleur du braille
      $('input#braille').val(qrcode.getTexteBraille()); // restaurer le texte en braille
      $('input#checkBraille').trigger('click');
    }

    $('input#colorQR').val(qrcode.getColorQRCode()); // restaurer la couleur du qrcode

    for (var i=0; i<qrcode.getTailleContenu(); i++){

      if (qrcode.getTypeContenu(i) == DictionnaireXml.getTagTexte()){
        createItemContent(null, qrcode.getTexte(i));
      } else if (qrcode.getTypeContenu(i) == DictionnaireXml.getTagFichier()){
        // appel de selectMusic pour créer un chap input de music
        selectMusic(null, [qrcode.getUrlFichier(i), qrcode.getNomFichier(qrcode.getUrlFichier(i))]);
      }

    }
  } catch (e) {
    alert('Erreur : ' + e.stack);
  }
}

// fonction appelée pour créer un qrcode atomique dans un qrcode ensemble
function drawQRCodeAtomiqueEnsemble (qrcode, imported) {
  try {
    if (imported) { baseViewQRCodeEnsemble(); }
    //ajout du bouton pour supprimer un qrcode.
    var inputDel = createInput('image', null, null, null, 'delete.png', null, null, 'Supprimer ce qrcode');
    inputDel.disabled = false;

    // mettre chaque qrcode atomique dans un div
    var div = createDiv(null, null, [inputDel, createDiv(null, null, null)]);
    $('#myFormActive').append(div);


    if (imported) {
      for (var i=0; i<qrcode.getNbLiens(); i++){
        // appel de selectMusic pour créer un chap input de music
        selectMusic(null, [qrcode.getLien(i), qrcode.getNomFichier(qrcode.getLien(i))]);
      }
    } else {
      for (var i=0; i<qrcode.getTailleContenu(); i++){

        // importer que les musiques si qrcode ensemble à créer
        if (qrcode.getTypeContenu(i) == DictionnaireXml.getTagFichier()){
          // appel de selectMusic pour créer un chap input de music
          selectMusic(null, [qrcode.getUrlFichier(i), qrcode.getNomFichier(qrcode.getUrlFichier(i))]);
        }

      }
    }

    //supprimer le qrcode sur click du bouton
    $('form#myFormActive > div > input[title="Supprimer ce qrcode"]').click(function(){
      $(this).parent().remove();
      // reinitialiser la vue s'il n'y a plus de qrcode
      if ($('#myFormActive').children().length == 0) {
        init_View();
      }
    });

  } catch (e) {
    alert('Erreur : ' + e.stack);
  }
}

// retourne l'architecture html de base pour un qrcode atomique
function baseViewQRCodeAtomique (callback) {
  typeQR = 'atomique';
  $('div#nameproject').append('<p><h6>QR-Code Atomique</h6></p>');
  $('div.tab-content-qrcode-unique').css('display', 'block');
  var html =
      '<div class="row" id="content-form">'+
        '<form id="myFormActive"></form>'+
    '</div>';

  $('.content').append(html);

  // bouton pour fermer annuler la création du qrcode et champ pour braille au milieu du qrcode
  html =
    '<div class="row"><div class="col-md-6 text-center"><input type="checkbox" id="checkBraille">Texte en braille</div>'+
    '<div class="col-md-6 text-center"><input type="color" id="colorQR" title="Couleur du QRCode"/></div></div>'+
        //'<button type="button" class="btn btn-default" id="closeForm">Annuler</button>'+
    '<div class="row" style="display:none;"><div class="col-md-3 text-center"><input type="text" id="braille" title="Texte en braille" maxlength="2"></div>'+
    '<div class="col-md-3 text-center"><input type="color" id="colorBraille" title="Couleur du texte en braille"/></div>'+
    '<div class="col-md-6 text-center"></div></div>';

  $('.content > #content-form').append(html);

  try {
    // ajouter un eventlistener au checbox pour afficher ou masquer les options du braille
      $('input#checkBraille').change(function(){
      if ($(this).prop('checked')) {
        $('div#content-form').children('div:last-child').css('display', 'block');
      } else {
        $('div#content-form').children('div:last-child').css('display', 'none');
      }
    });
    $('input#nameFamily').css('display', 'none');
    // activer / désactiver les bouton
    $('#preview, #read').css('disabled', false);
    $('#creer, #import').css('disabled', true);

    if (callback) { callback(null, null); }

  } catch (e) {
    alert('Erreur : ' + e.stack);
  }
}

// retourne l'architecture html de base pour un qrcode ensemble
function baseViewQRCodeEnsemble () {
  typeQR = 'ensemble';
  $('div#nameproject').append('<p><h6>QR-Code Ensemble</h6></p>');
  $('div.tab-content-qrcode-unique').css('display', 'block');

  var html = '<div class="row text-center" id="temporary"><div class="col-md-12"><p><h4>Glisser/Déposer les qrcodes à ajouter</h4></p></div></div>';

  html +=
    '<div class="row" id="content-form">'+
      '<form id="myFormActive"></form>'+
    '</div>';

  $('.content').append(html);

  // champ pour braille au milieu du qrcode
  html =
    '<div class="row"><div class="col-md-6 text-center"><input type="checkbox" id="checkBraille">Texte en braille</div>'+
    '<div class="col-md-6 text-center"><input type="color" id="colorQR" title="Couleur du QRCode"/></div></div>'+
    '<div class="row" style="display:none;"><div class="col-md-3 text-center"><input type="text" id="braille" title="Texte en braille" maxlength="2"></div>'+
    '<div class="col-md-3 text-center"><input type="color" id="colorBraille" title="Couleur du texte en braille"/></div>'+
    '<div class="col-md-6 text-center"></div></div>';

  $('.content > #content-form').append(html);

  try {
    // ajouter un eventlistener au checbox pour afficher ou masquer les options du braille
      $('input#checkBraille').change(function(){
      if ($(this).prop('checked')) {
        $('div#content-form').children('div:last-child').css('display', 'block');
      } else {
        $('div#content-form').children('div:last-child').css('display', 'none');
      }
    });
    $('input#nameFamily').css('display', 'none');
    // activer / désactiver les bouton
    $('button#preview, button#read').attr('disabled', false);
    $('button#creer, button#import').attr('disabled', true);

  } catch (e) {
    alert('Erreur : ' + e.stack);
  }
}

/**
 * Copyright © 12/02/2018, Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * The Software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders X be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the Software.
 * Except as contained in this notice, the name of the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
*/