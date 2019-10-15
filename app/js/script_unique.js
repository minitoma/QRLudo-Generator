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
                <li>
                  Vidéo résumant les étapes ci dessus
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
                <li>
                  Vidéo résumant les étapes ci dessus
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
    e.preventDefault();
    var settings = require("electron-settings");

    if (settings.has("defaultColor")) {
      $("#qrColor").val(settings.get("defaultColor"));
      $.each($(".qrData"), function(i, val) {
        $("#cible").empty();
      });
      $("#qrName").val("");
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

  previewQRCode(qrName, qrData, qrColor, div);

  $('#annuler').attr('disabled', false);
});


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

        if (contentType == 'audio/mpeg') {
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
  $('#preview').attr('disabled', true); //Par defaut le bouton generer est toujours activé, on le desactive dans la condition suivante si necessaire
  if (document.getElementById('qrName').value.length > 0) {
    $('#preview, #annuler, #ajouterTexte, #showAudio').attr('disabled', false);
  }
}



numTextArea = 0; //Ce compteur permet de compter le nombre de textarea pour differencier les id

//ajouter une nvlle legende (textarea) a chaque click sur button Texte (pour chaque textarea il faut rajouter à l'attribut class la valeur qrData class="... qrData")
function ajouterChampLegende(valeur = "") {

  numTextArea++; // Nouveau numero pour le prochain textarea

  var textareaLegende = document.createElement('div');
  textareaLegende.innerHTML = `<i class='fa fa-play align-self-center icon-player'></i><i class="fa fa-pause align-self-center icon-player"></i>
    <textarea id='textarea${numTextArea}' class='form-control qrData' rows='3' name='legendeQR' placeholder='Mettre la légende (255 caractères maximum)' maxlength='255' onkeyup="verifNombreCaractere(${numTextArea});">${valeur}</textarea>
    <button type='button' class='btn btn-outline-success align-self-center legendeQR-close-btn' onclick='supprimerChampLegende(this);'>
    <div class="inline-block">
      <i class='fa fa-trash-alt'></i></button>
      <button type='button' class='btn btn-outline-success align-self-center legendeQR-close-btn' onclick='moveUp(this);'>
      <i class='fa fa-arrow-up'></i></button>
      <button type='button' class='btn btn-outline-success align-self-center legendeQR-close-btn' onclick='moveDown(this);'>
      <i class='fa fa-arrow-down'></i></button>`;
  textareaLegende.setAttribute("class", "d-flex align-items-start legendeQR");
  textareaLegende.setAttribute("id", "legendeTextarea");

  document.getElementById('cible').appendChild(textareaLegende);
}

//verifier si le nombre de caractère maximal est respecté, si ce n'est pas le cas on affiche une pop up d'informations
function verifNombreCaractere(num) {
  $('#messages').empty();
  if(document.getElementById('textarea'+num).value.length >= $('#textarea'+num).attr('maxlength')) {
    messageInfos("La limite de caractère est atteinte (255 caractères)","warning");
  }
}

function supprimerChampLegende(e) {
  numTextArea--;
  $(e).parents('div#legendeTextarea').remove();
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
function moveUp(e) {
  let prev = $(e).parents('.legendeQR').prev();
  let div = $(e).parents('.legendeQR');

  if (prev.length > 0) {
    div.remove();
    div.insertBefore(prev);
  }
}

// déplacer en dessous du champ suivant
function moveDown(e) {
  let next = $(e).parents('.legendeQR').next();
  let div = $(e).parents('.legendeQR');

  if (next.length > 0) {
    div.remove();
    div.insertAfter(next);
  }
}
