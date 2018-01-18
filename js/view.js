var idInputText = 0; // pour identifier les inputs de façon unique
var idMenu = 1; // pour identifier de facon unique les menus
var facade = new FacadeController();
var tabQRCode = [];


$(document).ready(function() {

  document.getElementById('closeModalMusique').addEventListener('click', function(){
    closeModalMusique(event);
  }); // sur clic du bouton closeModalMusique

  $('button.set-legende').click(function(){
  //document.getElementsByClassName('set-legende')[0].addEventListener('click', function(){
  createItemContent($('li.active').attr('id'));
    //createTextBox('');
  }); // sur clic du bouton creer champ texte

  document.getElementById('read').addEventListener('click', function(){
    this.parentNode.parentNode.style.display = 'none';
    document.getElementById('stop').parentNode.parentNode.style.display = 'block';
    getForm(null);
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

  $('#setNameQRCode').click(function(e){
    if ($('#nameQRCode').val()) {
      createItems();
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
  //if (id) textarea.setAttribute('id', id+idInputText);
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
  idInputText++;
  if (id) input.setAttribute('id', id);
  if (value) input.setAttribute('value', value);
  if (src) input.setAttribute('src', __dirname+'/img/'+src);
  if (datatoggle) input.setAttribute('data-toggle', datatoggle);
  if (datatarget) input.setAttribute('data-target', datatarget);
  if (title) input.setAttribute('title', title);
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

// créer le contenu d'un item à partir de l'id renseigné.
function createItemContent (id) {
  var textarea = createTextarea('form-control', 'legende', null);
  var div2 = createDiv('col-md-12', null, [textarea]);

  var btnAdd    =   createClickableImg('addChamp', 'add.png', 'Ajouter un nouveau champ');
  var btnDelete =   createClickableImg('deleteChamp', 'delete.png', 'Supprimer ce champ');
  var btnPlay   =   createClickableImg('playChamp', 'play.png', 'Ecouter le contenu du champ');

  var span = document.createElement('SPAN');
  span.append(btnAdd, btnDelete, btnPlay);
  var div3 = createDiv('col-md-12 optButton', null, [span]);

  var div = createDiv('form-group', null, [createDiv('row', null, [div2, div3])]);
  var form = $('div#content-item.'+id).find($('form#myFormActive'));
  form.append(div);

  $('div#content-item').find('img.deleteChamp').click(function(){
    $(this).parents('div.form-group').remove();
    /*if (form.length != 0) {
      // recupérer le texte saisi avant de remplacer
      var textContent = form.childNodes[form.childNodes.length-1].childNodes[0].childNodes[0].childNodes[0].value;

      // recréer le input ou textarea et le div form-group
      if (form.childNodes[form.childNodes.length-1].childNodes[0].childNodes[0].childNodes[0].tagName == 'INPUT') {
        div2 = createDiv('col-md-9', null, [createInput('text', 'form-control', null, textContent, null, null, null, null)]);
      } else {
        div2 = createDiv('col-md-9', null, [createTextarea('form-control', 'legende', textContent)]);
      }
      div = createDiv('form-group', null, [createDiv('row', null, [div2, createDiv('col-md-3', null, [createDiv('row', null, [div3, div4, div5])])])]);
      // recréer le champ précédent avec les boutons add et delete
      form.replaceChild(div, form.childNodes[form.childNodes.length-1]);
    } else {
      // s'il s'agit d'une famille il faut juste supprimer le tab correspondant
      if (document.getElementsByClassName('nav-tabs nav')[0].style.display == 'block') {
        //closeTab();
        document.getElementsByClassName('nav-tabs nav')[0].removeChild(document.getElementsByClassName('active menu')[0]);
        document.getElementsByClassName('tab-content')[0].removeChild(document.getElementsByClassName('tab-pane fade active in')[0]);
        if (document.getElementsByClassName('menu')[0]) {
          document.getElementsByClassName('menu')[0].childNodes[0].click();
        } else {
          init_View();
        }

      } else {
        // il n' y a plus de champ on réinitilise l'application
        init_View();
      }
    }*/
  });

  // ajouter un eventlistener sur playChamp pour lire le champ sur click du bouton
  $('div#content-item').find('img.playChamp').click(function(event){
    console.log(event.target);
    var texte = event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].value;
    getForm(texte);
  });


  // activer les boutons preview et lire
  $('#preview').attr('disabled', false);
  $('#read').attr('disabled', false);

  $('#closeModal').trigger('click'); // fermer le popup d'ajout d'un nouveau champ
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
  var btnDelete = createInput('image', null, null, null, 'delete.png', null, null, 'Supprimer ce qrcode');
  btnDelete.disabled = false;
  //var btnDelete = createButton('button', 'btn btn-default deleteChamp', null, null, null);
  var btnPlay = createButton('button', 'btn btn-default playChamp', null, null, null);
  btnAdd.appendChild(createInput('image', null, null, null, 'add.png', null, null, 'Ajouter un nouveau champ'));
  btnDelete.appendChild(createInput('image', 'deleteChamp', null, null, 'delete.png', null, null, 'Supprimer ce champ'));
  btnPlay.appendChild(createInput('image', 'playChamp', null, null, 'play.png', null, null, 'Ecouter le contenu du champ'));
  var div3 = createDiv('col-md-4', null, [btnAdd]);
  var div4 = createDiv('col-md-4', null, [btnDelete]);
  var div5 = createDiv('col-md-4', null, [btnPlay]);
  var div = createDiv('form-group', null, [createDiv('row', null, [div2, createDiv('col-md-3', null, [createDiv('row', null, [div3, div4, div5])])])]);
  //var form = document.getElementsByClassName('in active')[0].childNodes[0].childNodes[0];
  var form = document.getElementById('myFormActive');
  form.appendChild(div);

  // ajouter un eventlistener sur playChamp pour lire le champ sur click du bouton
  btnPlay.addEventListener('click', function(event){
    console.log(event.target);
    var texte = event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].value;
    getForm(texte);
  });
  // ajouter un eventlistener sur deleteChamp pour supprimer le champ sur click du bouton
  btnDelete.addEventListener('click', function(){
    form.removeChild(div); // suppression du champ
    // ajout des btn add et delete au champ précédent si il existe
    if (form.length != 0) {
      // recupérer le texte saisi avant de remplacer
      var textContent = form.childNodes[form.childNodes.length-1].childNodes[0].childNodes[0].childNodes[0].value;

      // recréer le input ou textarea et le div form-group
      if (form.childNodes[form.childNodes.length-1].childNodes[0].childNodes[0].childNodes[0].tagName == 'INPUT') {
        div2 = createDiv('col-md-9', null, [createInput('text', 'form-control', null, textContent, null, null, null, null)]);
      } else {
        div2 = createDiv('col-md-9', null, [createTextarea('form-control', 'legende', textContent)]);
      }
      div = createDiv('form-group', null, [createDiv('row', null, [div2, createDiv('col-md-3', null, [createDiv('row', null, [div3, div4, div5])])])]);
      // recréer le champ précédent avec les boutons add et delete
      form.replaceChild(div, form.childNodes[form.childNodes.length-1]);
    } else {
      // s'il s'agit d'une famille il faut juste supprimer le tab correspondant
      if (document.getElementsByClassName('nav-tabs nav')[0].style.display == 'block') {
        //closeTab();
        document.getElementsByClassName('nav-tabs nav')[0].removeChild(document.getElementsByClassName('active menu')[0]);
        document.getElementsByClassName('tab-content')[0].removeChild(document.getElementsByClassName('tab-pane fade active in')[0]);
        if (document.getElementsByClassName('menu')[0]) {
          document.getElementsByClassName('menu')[0].childNodes[0].click();
        } else {
          init_View();
        }

      } else {
        // il n' y a plus de champ on réinitilise l'application
        init_View();
      }
    }
  });

  // activer les boutons preview et lire
  document.getElementById('preview').disabled = false;
  document.getElementById('read').disabled = false;

  document.getElementById('closeModal').click(); // fermer le popup
  // s'il ya plus d'un champ, on supprime le btn add de l'avant dernie champ
  if (document.getElementsByClassName('tab-pane fade active in')[0].childNodes[0].childNodes[0].childNodes.length > 1) { deleteAddBtn(); }
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

// créer une élément img
function createImg(id, src) {
  var img = document.createElement('img');
  if (id) img.setAttribute('id', id);
  if (src) img.setAttribute('src', src);
  return img;
}

/*
 fonction pour créér des items
 si imported = true : cette fonction est appelée pour recréer une famille de qrcode
*/
function createItems (imported) {
  $('#nameFamily').css('display', 'block');
  $('div.tab-content-qrcode-family.row').css('display', 'block');

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

  var p = document.createElement('P');
  p.appendChild(document.createTextNode($('#nameQRCode').val()));
  //var div = createDiv($('#nameQRCode').val(), 'content-item', [document.createTextNode('Fermer')]);
  var div = createDiv($('#nameQRCode').val(), 'content-item', null);

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
  });

  $('ul#sortable > li:last-child').click();

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
  $('#checkBraille').change(function(){
    if (this.checked) {
      document.getElementById('braille').parentNode.parentNode.style.display = 'block';
    } else {
      document.getElementById('braille').parentNode.parentNode.style.display = 'none';
    }
  });

  createItemContent($('li.active').attr('id'));

}

/*
 fonction pour créér des tabs
 si imported = true : cette fonction est appelée pour recréer une famille de qrcode
*/
function createTabs (imported) {
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

  createTabContent(a.getAttribute('href'), idMenu, li, imported);

  a.appendChild(texte);

  li.appendChild(a);
  li.addEventListener('click', function(){
    switchTab(event, null);
  });
  document.querySelector('.nav-tabs').appendChild(li);
  idMenu++;
  switchTab(null, true);
}

/*
 fonction pour créer le contenu des tabs
 si imported = true : cette fonction est appelée pour recréer une famille de qrcode
 */
function createTabContent (id, idMenu, li, imported) {

  var button = createButton('button', 'btn btn-default addChamp', 'modal', '#myModal', document.createTextNode('Ajouter un champ'+idMenu));

  var checkbox = createInput('checkbox', null, 'checkBraille', null, null, null, null, null);
  checkbox.disabled = false;

  var div4 = createDiv('col-md-6 text-center', null, [checkbox, document.createTextNode('Texte en braille')]);
  // palette de couleur pour la couleur du qrcode
  var inputColorQR = createInput('color', null, 'colorQR', null, null, null, null, 'Couleur du QRCode');
  var div5 = createDiv('col-md-6 text-center', null, [inputColorQR]);

  var input = createInput('text', null, 'braille', null, null, null, null, 'Texte en braille');
  input.setAttribute('maxlength', '2');
  input.disabled = false;

  var inputColorBraille = createInput('color', null, 'colorBraille', null, null, null, null, 'Couleur du texte en braille');
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

  var div2 = createDiv('row', 'content-form', [createForm('myFormActive'), div3, div9]);
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

  if (!imported) { createTextBox(null); }

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
      document.getElementById('previewFamily').style.display = 'block'; // afficher le bouton exporter famille
      document.getElementById('initView').style.display = 'block'; // afficher le bouton terminer
      previewQRCode(true); // true pour famille
    }
//  } else if (document.getElementById('nameFamily').style.display == 'none' && document.getElementById('nameFamily').value == '') { // qrcode atomique
  } else {
    previewQRCode(false); // pour qrcode atomique, pas de famille
  }
}

// fonction appelée pour faire le view d'une famille de  qrcode
function drawQRCodeFamille (qrcode) {
  for (var i = 0; i < qrcode.length; i++) {
    var qr = qrcode[i];
      console.log(qr.getDonneesUtilisateur());
      console.log(qr.getMetadonnees());
      // appel de createTabs avec true pour recréer une famille importée
      document.getElementById('nameQRCode').value = qr.getNomQRCode();
      createTabs(true);

      // s'il y a du texte en braille
      if (qr.getTexteBraille() != null && qr.getTexteBraille() != "") {
        var brailleColor = document.getElementsByClassName('tab-pane fade active in')[0].childNodes[0].childNodes[2].childNodes[1].childNodes[0];
        var brailleText = document.getElementsByClassName('tab-pane fade active in')[0].childNodes[0].childNodes[2].childNodes[0].childNodes[0];
        var checkBraille = document.getElementsByClassName('tab-pane fade active in')[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0];
        brailleColor.setAttribute('value', qr.getColorBraille()); // restaurer la couleur du braille
        brailleText.setAttribute('value', qr.getTexteBraille()); // restaurer le texte en braille
        checkBraille.click();
      }
      // recupérer et restaurer la couleur du qrcode
      var qrCodeColor = document.getElementsByClassName('tab-pane fade active in')[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0];
      qrCodeColor.setAttribute('value', qr.getColorQRCode()); // restaurer la couleur du qrcode
      for (var j=0; j<qr.getTailleContenu(); j++){

        if (qr.getTypeContenu(j) == DictionnaireXml.getTagTexte()) {
          createTextBox(qr.getTexte(j));
        } else if (qr.getTypeContenu(j) == DictionnaireXml.getTagFichier()) {
           // appel de selectMusic pour créer un champ input de music
          selectMusic (null, [qr.getUrlFichier(j), qr.getNomFichier(qr.getUrlFichier(j))]);
        }
      }

      document.getElementsByClassName('nav-tabs nav')[0].style.display = 'block';
  }
  document.getElementById('nameFamily').setAttribute('value', qrcode[0].getNomFamille());
  document.getElementById('nameFamily').style.display = 'block';
  document.getElementById('creer').disabled = true;
  document.getElementById('import').disabled = true;
}

// fonction appelée pour faire le view du qrcode atomique
function drawQRCodeAtomique (qrcode) {
  baseViewQRCodeAtomique(null);
  if (qrcode.getTexteBraille() != null && qrcode.getTexteBraille() != "") {
    document.getElementById('colorBraille').setAttribute('value', qrcode.getColorBraille()); // restaurer la couleur du braille
    document.getElementById('braille').setAttribute('value', qrcode.getTexteBraille()); // restaurer le texte en braille
    document.getElementById('checkBraille').click();
  }
  document.getElementById('colorQR').setAttribute('value', qrcode.getColorQRCode()); // restaurer la couleur du qrcode
  for (var i=0; i<qrcode.getTailleContenu(); i++){

    if (qrcode.getTypeContenu(i) == DictionnaireXml.getTagTexte()){
      createTextBox(qrcode.getTexte(i));
    } else if (qrcode.getTypeContenu(i) == DictionnaireXml.getTagFichier()){
      // appel de selectMusic pour créer un chap input de music
      selectMusic (null, [qrcode.getUrlFichier(i), qrcode.getNomFichier(qrcode.getUrlFichier(i))]);
    }
  }
}

// retourne l'architecture html de base pour un qrcode atomique
function baseViewQRCodeAtomique (callback) {
  var html =
      '<div class="tab-pane fade active in" id="menu1">'+
        '<div class="row" id="content-form">'+
          '<form id="myFormActive"></form>'+
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
  document.getElementById('checkBraille').addEventListener('change', function(){
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
  if (callback) { callback(null); }
}

/*
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
*/
