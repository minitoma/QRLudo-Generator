
$(document).ready(function() {

  // pour les tabs
  $(".nav-tabs a").click(function(){
      $(this).tab('show');
  });
  $('.nav-tabs a').on('shown.bs.tab', function(event){
      var x = $(event.target).text();         // active tab
      var y = $(event.relatedTarget).text();  // previous tab
      $(".act span").text(x);
      $(".prev span").text(y);
  });

  // desactiver les boutons preview et lire s'il y a rien à lire ou preview
  document.getElementById('preview').disabled = true;
  document.getElementById('read').disabled = true;

  // desactiver exporter, faut preview avant de pouvoir exporter
  document.getElementById('btnExportFile').disabled = true;

  // désactiver le bouton créer s'il s'agit de qrcode unique
  document.getElementById('qrCodeAtomique').addEventListener('click', function(){
  document.getElementById('creer').disabled = true;
  document.getElementById('modalFamilyName').childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[1].textContent = "Nom du QRCode";

  });

  // fonction pour dispatcher
  document.addEventListener('click', function(){
    recognizeFunction(event);
  });

  //document.addEventListener('click', addChamp); // sur click du bouton addChamp

  document.getElementById('modalMusic').addEventListener('click', function(){
    selectMusic(event, null);
  }); // sur clic d'un lien de musique
  document.getElementById('setImportedFile').addEventListener('click', importFile);
  document.getElementById('btnExportFile').addEventListener('click', exportFile);
});


// fonction pour appeler la foncton sollicitée
function recognizeFunction (event) {
  var element = event.target;
  if (element.tagName == 'BUTTON' && element.classList.contains("set-music")){
    modalMusic();
    createMusicBox();
  } else if (element.tagName == 'BUTTON' && element.classList.contains("closeTab")) {
    closeTab(element);
  }
}

// fermer le premier popup avant que celui de la liste des musiques ne s'affiche
function modalMusic() {
  document.getElementById('closeModal').click();
}

// renseigner la musique sur un champ texte et l'afficher
function selectMusic (event, imported) {
  var div2;
  if (event && imported == null) {
    var element = event.target;

    if(element.tagName == 'A') {
      div2 = createDiv('col-md-9', null, [createInput('text', 'form-control', element.getAttribute('href').substring(1), element.textContent, null, null, null)]);
    }
  } else if (event == null && imported) {
    div2 = createDiv('col-md-9', null, [createInput('text', 'form-control', imported[0], imported[1], null, null, null)]);
  }

  var form = document.getElementsByClassName('in active')[0].childNodes[0].childNodes[0];

  var btn = createButton('button', 'btn btn-default addChamp', 'modal', '#myModal', null);
  btn.appendChild(createInput('image', null, null, null, 'add.png', null, null));
  var div3 = createDiv('col-md-3', null, [btn]);

  var div = createDiv('form-group', null, [createDiv('row', null, [div2, div3])]);
  form.appendChild(div);
  // activer les boutons preview et lire
  document.getElementById('preview').disabled = false;
  document.getElementById('read').disabled = false;
  document.getElementById('closeModalMusique').click(); // fermer le popup de musique
  console.log(element);
  console.log(form);
  console.log("numero input " + idInputText);
  if (document.getElementById('myForm').childNodes.length > 1) { deleteAddBtn(); }
}

// fonction pour fermer un onglet
function closeTab (element) {
  // retrouver l'id tab parent et le supprimer de <ul class="nav nav-tabs">
  document.querySelector('.nav-tabs').removeChild(document.getElementsByClassName(element.parentNode.parentNode.parentNode.id)[0]);
  // retrouver l'element apr son id et le supprimer de <div class="tab-content">
  document.getElementsByClassName('tab-content')[0].removeChild(document.getElementById(element.parentNode.parentNode.parentNode.id));

  // définit le tab 1 comme celui active
  if (document.getElementsByClassName('tab-pane fade').length != 0
      && document.getElementsByClassName('tab-pane fade active in').length == 0) {
    document.getElementsByClassName('tab-pane fade')[0].setAttribute('class', 'tab-pane fade active in');
  } else {
    // y a plus de formulaire on desactive les boutons preview et lire
    document.getElementById('preview').disabled = true;
    document.getElementById('read').disabled = true;
    document.getElementById('creer').disabled = false; // activer le bouton créer
    document.getElementById('import').disabled = false; // activer le bouton créer
  }

  if (document.getElementsByClassName('menu').length != 0
      && document.getElementsByClassName('active menu').length == 0) {
        document.getElementsByClassName('menu')[0].setAttribute('class', 'active ' +
        document.getElementsByClassName('menu')[0].getAttribute('class'));
  }

  // ajouter btn addTabs sur le dernier onlet
  if (document.getElementsByClassName('menu').length != 0) {
    var menu = document.getElementsByClassName('menu')[document.getElementsByClassName('menu').length - 1];
    var input = createInput('image', 'addTabs', null, null, 'add.png', 'modal', '#modalFamilyName');
    input.disabled = false;
    if (menu.childNodes[0].childNodes.length <= 1) { // tester si le bouton n'existe pas
      menu.childNodes[0].appendChild(input); // mettre input dans a
    }

  }
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

// fonction pour charger un QRCode
function importFile () {
  document.getElementById('closeModalImport').click(); // fermer le popup d'import

  // recupérer le fichier
  var importedFile = document.getElementById('importedFile').files[0];
  if (importedFile) {
    facade.importQRCode(importedFile);
  }
}

// fonction pour enregistrer un QRCode
function exportFile () {
  var img = document.getElementsByTagName('IMG')[0];
  var url = img.src.replace(/^data:image\/[^;]/, 'data:application/octet-stream');

  var xhr = new XMLHttpRequest();

  xhr.responseType = 'blob'; //Set the response type to blob so xhr.response returns a blob
  xhr.open('GET', url , true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == xhr.DONE) {
        //When request is done
        //xhr.response will be a Blob ready to save
        var filesaver = require('file-saver');
        filesaver.saveAs(xhr.response, 'image.jpeg');
        init_View(); // réinitialiser le view
    }
  };
  xhr.send(); //Request is sent
}

// function appelée aprés chaque export pour réinitialiser la vue
function init_View () {
  facade = new FacadeController();
  document.getElementsByClassName('tab-content')[0].innerHTML = "";
  document.getElementsByClassName('nav nav-tabs')[0].innerHTML = "";
  document.getElementById('affichageqr').childNodes[1].innerHTML = '<div class="col-md-12"> <!-- affichage du qrcode --> </div>';
  document.getElementById('btnExportFile').disabled = true;
  document.getElementById('preview').disabled = true;
  document.getElementById('read').disabled = true;
  document.getElementById('creer').disabled = false;
  document.getElementById('import').disabled = false;
}


// définir le dernier tab créé comme celui active (tab et tabcontent)
function setActive (div, li) {
  if (document.getElementsByClassName('tab-pane fade active in').length != 0) {
    document.getElementsByClassName('tab-pane fade active in')[0].setAttribute('class', 'tab-pane fade');
  }
  div.setAttribute('class', 'tab-pane fade active in');

  if (document.getElementsByClassName('active menu').length != 0) {
    var id = document.getElementsByClassName('active menu')[0].getAttribute('class').match(/\d+/g).join(''); // retourne le chiffre dans la chaine
    document.getElementsByClassName('active menu')[0].setAttribute('class', 'menu menu' + id);
  }
  li.setAttribute('class', 'active menu menu'+idMenu);
}

// copier le contenu d'un element input
function copyContentToQRCode (qrcode, input) {
  // tester s'il s'agit d'un input de musique
  if(input.disabled) {
    var url = 'https://drive.google.com/open?id=' + input.id;
    qrcode.ajouterFichier(url, input.value);
  } else {
    qrcode.ajouterTexte(input.value);
  }
  // copier la couleur dans le qrcode
  qrcode.ajouterColor(document.getElementById('colorPicker').value);
}

// fonction pour supprimer le bouton add de l'avant dernier champ du formulaire
function deleteAddBtn () {
  var row = document.getElementById('myForm').childNodes[document.getElementById('myForm').childNodes.length - 2];
  row.childNodes[0].removeChild(row.childNodes[0].childNodes[1]); // supprimer btn add
  row.childNodes[0].childNodes[0].setAttribute('class', 'col-md-12'); // augmenter la taille du textarea
}

// fonction pour supprimer le bouton add tabs de l'avant dernier tab
function deleteAddBtnTabs () {
  // recupérer l'avant dernier menu
  var menu = document.getElementsByClassName('menu')[document.getElementsByClassName('menu').length - 2];
  menu.childNodes[0].removeChild(menu.childNodes[0].childNodes[1]);
}
