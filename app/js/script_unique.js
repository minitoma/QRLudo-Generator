/**
 * @Author: alassane
 * @Date:   2018-11-10T17:59:11+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2019-02-04T21:09:51+01:00
 */

// fichier script concernant les qr codes uniques
var qrcode;
var qrType;

var {
  remote,
  ipcRenderer
} = require('electron');
var {
  Menu,
  MenuItem
} = remote;

var menu = new Menu();

$(document).ready(function() {

  //appel à la focntion qui permet de lire les enregistrement
  chargement();

  //Use to implement information on the audio import
  var info = document.createElement('div'); // balise div : contain html information
  var info_activ = false; // boolean : give the etat of info (up/off)


  // desactiver les boutons s'il y a rien à lire ou generer
  if (document.getElementById('qrName').value.length === 0) {
    $('#preview').attr('disabled', true);
  }

  $("#saveQRCode").click(e => {
    saveQRCodeImage();
  });

  $('#closeModalListeMusic').click(e => {
    $('#musicUrl').val('');
    $('#listeMusic').find('.errorLoader').remove();
  }); // close modal add music

  // enable right click
  menu.append(new MenuItem({
    label: 'Coller le lien',
    click() {
      const {
        clipboard
      } = require('electron');
      let url = clipboard.readText();
      $('input#musicUrl').val(url);
      getMusicFromUrl();
    }
  }));

  $('input#musicUrl').contextmenu(e => {
    menu.popup(remote.getCurrentWindow())
    if(info_activ == true){
      document.getElementById('elementsAudio').removeChild(info);
      info_activ = false;
    }
  });
   //Show the information about the audio file import (help)
  $('button#showInfo').click(e => {
    e.preventDefault();
    if (info_activ==false){
        info.innerHTML = ` <div id="info-audio" class="info-content">
        <h5><a href="#copyLink">Copier le lien téléchargeable de la musique</a></h5>
          <div id="copyLink" class="info-content">
            <h6><a href="#google">Google Drive</a></h6>
            <div id="google" class="info-content">
              <ul class="list components">
                <li>
                  Aller sur internet, se rendre sur son compte Google Drive (https://drive.google.com), se connecter éventuellement
                </li>
                <li>
                  Faire clic-droit sur le fichier audio en question
                </li>
                <li>
                  Cliquer sur "Obtenir le lien partageable"
                </li>
                <li>
                  Revenir sur l'application QRLudo
                </li>

              </ul>
            </div>

            <h6><a href="#dropbox">Dropbox</a></h6>
            <div id="dropbox" class="info-content">
              <ul class="list components">
                <li>
                  Aller sur internet, se rendre sur son compte Dropbox (https://www.dropbox.com), se connecter éventuellement
                </li>
                <li>
                  Survoller avec la souris le fichier audio en question
                </li>
                <li>
                  Cliquer sur "Partager", un popup va s'ouvrir
                </li>
                <li>
                  En bas à droite du popup ouvert, cliquer sur "Créer un lien"
                </li>
                <li>
                  Toujours sur le popup, cliquer sur "Copier le lien" en bas à droite
                </li>
                <li>
                  Revenir sur l'application QRLudo
                </li>

              </ul>
            </div>
          </div>
        </div>`;
      console.log("test");
      document.getElementById('elementsAudio').appendChild(info);
      info_activ = true;
    }
    else {
      document.getElementById('elementsAudio').removeChild(info);
      info_activ = false;
    }
    //ipcRenderer.send('showInfoWindow', null);
  });

  $('button#annuler').click(e => {

    //aficher popup quand on click sur reinitialiser
    // cache le qr générer & desactivation du bouton exporter
    var popUpQuiter = confirm("Etes vous sûr de vouloir réinitialiser?");
    if (popUpQuiter == true){

      //Les différents store sont clean ici
      if(store.get(`titreUnique`)){
        store.delete(`titreUnique`);
        $("#qrName").val("");
      }

      //implémentation des différentes zones de txt enregistrées
      for(var i = 1; i<=numTextArea; i++){
        if (store.get(`textZone${i}`)){
          store.delete(`textZone${i}`);
        }
      }

      //On parcours le store pour afficher les texte enregistré dans les zones correspondantes
      for(var i = 1; i<=numTextArea; i++){
        if (store.get(`text${i}`)){
          store.delete(`text${i}`);
        }
      }

      store.delete("numTextArea");
      numTextArea = 0;
      store.delete("numTextAreaCourant")
      numTextAreaCourant = 0;

      $("button#annuler").attr('type','reset');

      let a = $('#legendeTextarea');
      $.each($(".qrData"), function(i, val) {
        $(`#textarea${i}`).val("");
        $("#cible").empty();
      });

      $("#cible").append(a);
      $(a).children('button').attr('disabled', true);

      $('#qrView').hide();
      $('#saveQRCode').attr('disabled', true);
      $('#preview').attr('disabled', true);

      var settings = require("electron-settings");
      if (settings.has("defaultColor")) {
        $("#qrColor").val(settings.get("defaultColor"));
      }

      $("#ajouterTexte").attr('disabled', false);
    }
    else {
      $("button#annuler").removeAttr('type');
    }
  });
});

// trigger preview qrcode action
$('#preview').click(e => {

  //re-afficher le qr generer si le bouton est reinitialiser a deja été utilisé
  $("#qrView").show();

  console.log('preview');
  //enlever les messages en haut de page
  initMessages();
  let inputArray = $('input, textarea');

  // if (validateForm(inputArray)) { // all fields are filled
  // get all required attributes for qrcode
  let qrColor = $('#qrColor').val();
  let qrName = $('#qrName').val();
  let qrData = [];

  for (data of $('.qrData')) {
    if (data.name == 'AudioName') {
      let dataAudio = {
        type: 'music',
        url: data.id,
        name: data.value
      }

      let jsonAudio = JSON.stringify(dataAudio);
      qrData.push(JSON.parse(jsonAudio));
    } else
      qrData.push($(data).val());
  }

  qrType = $('#typeQRCode').val();

  // Generate in a div, the qrcode image for qrcode object
  let div = $('#qrView')[0];

  let newQrUnique = new QRCodeUnique(qrName, qrData, qrColor);
  console.log(newQrUnique);
  previewQRCode(qrName, qrData, qrColor, div);
  //console.log();
  $('#annuler').attr('disabled', false);
});


//Fonction permettant la continuité entre les onglet avec la gestion de l'objet store
function chargement(){

  //nombre de zone texte courant
  if(store.get(`numTextAreaCourant`))
    numTextArea = store.get(`numTextAreaCourant`);
  else
    store.set(`numTextAreaCourant`,numTextAreaCourant);

  //On désactive le bouton de rajout de champtexte si le nombre est superieur à celui recommandé
  if(numTextAreaCourant >= 3)
    $("#ajouterTexte").attr('disabled', true);

  //indice des zones textes presente, peut etre superieur au zone texte presente
  if(store.get(`numTextArea`))
    numTextArea = store.get(`numTextArea`);
  else
    store.set(`numTextArea`,numTextArea);

  if(store.get(`titreUnique`)){
    $('#qrName').val(store.get(`titreUnique`));
  }

  //implémentation des différentes zones de txt enregistrées
  for(var i = 1; i<=numTextArea; i++){
    if (store.get(`textZone${i}`)){
      var text = document.createElement('div');
      text.innerHTML = store.get(`textZone${i}`);
      text.setAttribute("class", "d-flex align-items-start legendeQR");
      text.setAttribute("id", "legendeTextarea");
      $('#cible').append(text);
    }
  }

  //On parcours le store pour afficher les texte enregistré dans les zones correspondantes
  for(var i = 1; i<=numTextArea; i++){
    if (store.get(`text${i}`)){
      $('#textarea'+(i)).val(store.get(`text${i}`));
    }
  }

  //insertion du premier champ Texte
  if(numTextAreaCourant == 0){
    ajouterChampLegende();
  }

  //On desactive le bouton supprimer quand il y a qu'un seul text area
  if(numTextAreaCourant == 1) {
    disabledButtonDelete();
  }
}

// form validation return true if all fields are filled
function validateForm(inputArray) {
  //cet index pour enlever un input de type file
  let index = 0;
  initMessages();
  for (input of inputArray) {
    // eliminer les input de type file
    if ($(input).attr('type') != 'file') {
      if (!$(input).val() || $(input).val() == "") {
        messageInfos("Veuillez renseigner tous les champs", "danger"); //message a afficher en haut de la page
        return false;
      }
    } else {
      //enlever l'element input de type file
      inputArray.splice(index, 1);
    }

    ++index;
  }

  return true;
}


// generate and print qr code
function previewQRCode(name, data, color, div) {

  // instanciate a qrcode unique object
  if (qrType == 'xl')
    qrcode = new QRCodeXL(name, data, color);
  else
    qrcode = new QRCodeUnique(name, data, color);

  let facade = new FacadeController();
  facade.genererQRCode(div, qrcode);
}

// save image qr code
function saveQRCodeImage() {
  const fs = require('fs');

  let img = $('#qrView img')[0].src;

  var data = img.replace(/^data:image\/[^;]/, 'data:application/octet-stream');

  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  console.log(data);
  xhr.open('GET', data, true);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == xhr.DONE) {
      var filesaver = require('file-saver');
      console.log(xhr.response);
      //Dans les deux cas filsaver.saveAs renvoie rien qui s'apparente à un bolléen
      if(filesaver.saveAs(xhr.response, qrcode.getName() + '.jpeg') == true ){
        console.log(filesaver.saveAs(xhr.response, qrcode.getName() + '.jpeg').getName);
        messageInfos("Le QR code a bien été enregistré", "success"); //message a afficher en haut de la page
      }

    }
  }
  xhr.send();
}


function getMusicFromUrl() {
  let modal = $('#listeMusic').find('div.modal-body.scrollbar-success');
  let loader = document.createElement('div');
  let errorMsg = document.createElement('label');

  const {
    clipboard
  } = require('electron');

  let url = clipboard.readText();
  let xhr = new XMLHttpRequest();

  Music.getDownloadLink(url, link => {
    if (link == null) {
      showError(modal, errorMsg);
      return
    }

    try {
      xhr.open('GET', link, true);
    } catch (e) {
      showError(modal, errorMsg);
    }
    xhr.responseType = 'blob';
    xhr.onload = function(e) {

      if (this.status == 200) {
        let blob = this.response; // get binary data as a response
        let contentType = xhr.getResponseHeader("content-type");
        console.log(contentType);

        if (contentType == 'audio/mpeg' || contentType == 'audio/mp3') {
          // get filename
          let filename = xhr.getResponseHeader("content-disposition").split(";")[1];
          filename = filename.replace('filename="', '');
          filename = filename.replace('.mp3"', '.mp3');

          // save file in folder projet/download
          let fileReader = new FileReader();
          fileReader.onload = function() {
            fs.writeFileSync(`${temp}/Download/${filename}`, Buffer(new Uint8Array(this.result)));

            $(loader, errorMsg).remove();
            $('#closeModalListeMusic').click(); // close modal add music
          };
          fileReader.readAsArrayBuffer(blob);

          ajouterChampSon(filename, link);
        } else {
          showError(modal, errorMsg, "Le fichier n'est pas un fichier audio");
        }
      } else {
        // request failed
        showError(modal, errorMsg);
      }
    };

    xhr.onloadstart = function(e) {
      console.log('load start');
      $(loader).addClass('loader');
      $(modal).find('.errorLoader').remove();
      $(modal).prepend(loader); // show loader when request progress
    };

    xhr.onerror = function(e) {
      showError(modal, errorMsg);
    };

    xhr.send();
  });
}

function showError(modal, errorMsg, message = "Veuillez coller un lien de fichier téléchargeable. Reportez vous à la rubrique Info pour plus d'informations.") {
  console.log('error ');
  $(modal).find('.loader').remove();
  $(errorMsg).text(message);
  $(errorMsg).css('color', '#f35b6a');
  $(errorMsg).addClass('errorLoader');
  $(modal).prepend(errorMsg); // add error message
}

//verifier le champ qrName du formulaire myFormActive puis activer le button generer
//Le nom du QR Code doit contenir au moins un caractère, sinon le bouton generer n'est pas accessible
function activer_button() {
  //Permet l'enregistrement du titre dans le store Titre
  store.delete(`titreUnique`);
  var titre = document.getElementById('qrName').value;
  store.set(`titreUnique`, titre);


  $('#preview').attr('disabled', true); //Par defaut le bouton generer est toujours activé, on le desactive dans la condition suivante si necessaire
  if (document.getElementById('qrName').value.length > 0) {

    $('#preview, #annuler, #showAudio').attr('disabled', false);
  }
}


//ajouter une nvlle legende (textarea) a chaque click sur button Texte (pour chaque textarea il faut rajouter à l'attribut class la valeur qrData class="... qrData")
function ajouterChampLegende(valeur = "") {
  store.delete(`numTextAreaCourant`);
  numTextAreaCourant++; // Nouveau numero pour le prochain textarea
  store.set(`numTextAreaCourant`,numTextAreaCourant);

  store.delete(`numTextArea`);
  numTextArea++; // Nouveau numero pour le prochain textarea
  store.set(`numTextArea`,numTextArea);

  var textareaLegende = document.createElement('div');
  textareaLegende.innerHTML = `<i class='fa fa-play align-self-center icon-player'></i><i class="fa fa-pause align-self-center icon-player"></i>
    <textarea id='textarea${numTextArea}' class='form-control qrData' rows='3' name='legendeQR' placeholder='Tapez votre texte (255 caractères maximum)' maxlength='255' onkeyup="verifNombreCaractere(${numTextArea});">${valeur}</textarea>
    <button id='delete${numTextArea}' type='button' class='btn btn-outline-success align-self-center legendeQR-close-btn' onclick='supprimerChampLegende(this, ${numTextArea});'>
    <div class="inline-block">
      <i class='fa fa-trash-alt'></i></button>
      <button type='button' class='btn btn-outline-success align-self-center legendeQR-close-btn' onclick='moveUp(this, ${numTextArea});'>
      <i class='fa fa-arrow-up'></i></button>
      <button type='button' class='btn btn-outline-success align-self-center legendeQR-close-btn' onclick='moveDown(this, ${numTextArea});'>
      <i class='fa fa-arrow-down'></i></button>`;
  textareaLegende.setAttribute("class", "d-flex align-items-start legendeQR");
  textareaLegende.setAttribute("id", "legendeTextarea");

  document.getElementById('cible').appendChild(textareaLegende);

  //degrisser boutons premiere zone de texte apres ajout d'une nouvelle zone
  $($("#legendeTextarea").children()).attr('disabled', false);

  //Permet d'enregistrer l'ajout de case texte
  store.set(`textZone${numTextArea}`,textareaLegende.innerHTML);

  //limiter zone de de texte
  if (numTextAreaCourant>=3){
    $('#ajouterTexte').attr('disabled', true);
  }
}

//verifier si le nombre de caractère maximal est respecté, si ce n'est pas le cas on affiche une pop up d'informations
function verifNombreCaractere(num) {
  //Permet l'enregistrement du text dans le store
  store.delete(`text${num}`);
  var txt = document.getElementById('textarea'+num).value;
  store.set(`text${num}`, txt);


  $('#messages').empty();
  if(document.getElementById('textarea'+num).value.length >= $('#textarea'+num).attr('maxlength')) {
    messageInfos("La limite de caractère est atteinte (255 caractères)","warning");
  }
}

//supprimeun le textarea correspondant au numText
function supprimerChampLegende(e, numText) {

  store.delete(`numTextAreaCourant`);
  numTextAreaCourant--; // Nouveau numero pour le prochain textarea
  store.set(`numTextAreaCourant`,numTextAreaCourant);

  //suppression dans le store de la zone de txt correspondante
  store.delete(`text`+numText);
  store.delete(`textZone`+numText);

  $(e).parents('div#legendeTextarea').remove();

  $('#ajouterTexte').attr('disabled', false);

  if(numTextAreaCourant == 1) {
    disabledButtonDelete();
  }
}

//Permet de desactiver le bouton supprimer du texte area restant
function disabledButtonDelete() {
  for(var i = 1; i<numTextArea+1; i++){
    if(store.get(`textZone${i}`))
      $("#delete" + i).attr('disabled', true);
  }
}

//generer un input 'pour un fichier audio' -> nom de fichier + url (pour chaque input il faut rajouter à l'attribut class la valeur qrData class=".. qrData")
function ajouterChampSon(nom, url) {

  var inputSon = document.createElement('div');
  inputSon.innerHTML = `<i class='fa fa-play align-self-center icon-player'></i><i class='fa fa-pause align-self-center icon-player'></i><input type='text' id='${url}' name='AudioName' class='form-control qrData' value='${nom}' readonly>
    <button type='button' class='btn btn-outline-success legendeQR-close-btn align-self-center' onclick='supprimerChampSon(this);'>
    <div class="inline-block">
      <i class='fa fa-trash-alt'></i></button>
      <button type='button' class='btn btn-outline-success align-self-center legendeQR-close-btn' onclick='moveUp(this);'>
      <i class='fa fa-arrow-up'></i></button>
      <button type='button' class='btn btn-outline-success align-self-center legendeQR-close-btn' onclick='moveDown(this);'>
      <i class='fa fa-arrow-down'></i></button>
    </div>`;
  inputSon.setAttribute("class", "d-flex align-items-start legendeQR");
  inputSon.setAttribute("id", "inputAudio");
  document.getElementById('cible').appendChild(inputSon);

  $('#listeMusic .close').click();

}

//supprimer un champ Audio -> event onclick
function supprimerChampSon(e) {
  $(e).parents('div#inputAudio').remove();
}

// déplacer au dessus du champ précédent
function moveUp(e, numTxt) {
  let prev = $(e).parents('.legendeQR').prev();
  let div = $(e).parents('.legendeQR');

  let divVal = $(e).parents('.legendeQR').children('textarea').val();
  let prevVal = $(e).parents('.legendeQR').prev().children('textarea').val()

  if (prev.length > 0) {

    for(var i = 1; i<numTextArea+1; i++){
      if(store.get("text"+i) == prevVal)
        store.set("text"+i,divVal);
    }
    store.set("text"+numTxt,prevVal);

    div.remove();
    div.insertBefore(prev);
  }
}

// déplacer en dessous du champ suivant
function moveDown(e,numTxt) {
  let next = $(e).parents('.legendeQR').next();
  let div = $(e).parents('.legendeQR');

  let divVal = $(e).parents('.legendeQR').children('textarea').val();
  let nextVal = $(e).parents('.legendeQR').next().children('textarea').val();

  if (next.length > 0) {

    for(var i = 1; i<numTextArea+1; i++){
      if(store.get("text"+i) == nextVal)
        store.set("text"+i,divVal);
    }
    store.set("text"+numTxt,nextVal);

    div.remove();
    div.insertAfter(next);
  }


}
