/**
 * @Date:   2018-12-06T16:32:33+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2019-01-16T23:37:53+01:00
 */

$().ready(function() {
  $("#play-sound-div").hide();

  // Genere le qrCode Ensemble
  $("#preview").click(function() {

    affichageLigneParDefault();

    let qrColor = $("#qrColor").val();
    controllerEnsemble.setQRCodeEnsemble(new QRCodeEnsembleJson(document.getElementById('qrName').value, [], qrColor));


    // Ajoute les donnees json de chaque qrCode unique dans le qrCode ensemble
    let qrcodes = controllerEnsemble.getQRCodeAtomiqueArray();
    let qrcodeEns = controllerEnsemble.getQRCodeEnsemble();

    for (let i = 0; i < qrcodes.length; i++) {
      qrcodeEns.ajouterQrCode(qrcodes[i]);
    }

    let facade = new FacadeController();
    facade.genererQRCode($('#qrView')[0], qrcodeEns);

    $('#saveQRCode').attr('disabled', false);
  });

  // Vide les tableaux qrCodes, files et les lignes de la zone drop
  $("#empty").click(function() {
    controllerEnsemble = new ControllerEnsemble();
    $('#qrName').val('');
    $(txtZone).empty();
    txtZone.appendChild(txtDragAndDrop);
  });

  $("#saveQRCode").click(e => {
    saveQRCodeImage();
  });

  if (document.getElementById('qrName').value.length === 0) {
    $('#preview #empty').attr('disabled', true);
  }
});

var dropZone = document.getElementById('dropZone');
var txtZone = document.getElementById('txtZone');

var txtDragAndDrop = document.createElement("P");

txtDragAndDrop.setAttribute("id", "txtDragAndDrop");
txtDragAndDrop.setAttribute("class", "col-sm-7");
txtDragAndDrop.setAttribute("style", "text-align: center; margin-top: 15%");
txtDragAndDrop.innerText = "Déposez vos fichiers ici";

txtZone.appendChild(txtDragAndDrop);
// Ce declenche quand un element entre dans la zone de drop
dropZone.ondragenter = function(e) {};

// Ce declenche quand un element quitte la zone de drop
dropZone.ondragleave = function(e) {};

// Ce declenche quand un element se deplace dans la zone de drop
dropZone.ondragover = function(e) {
  e.preventDefault();
};

// Ce declenche quand un element est depose dans la zone de drop
dropZone.ondrop = function(e) {
  e.preventDefault();

  txtDragAndDrop.remove();

  let afficherPopUp = false;
  let nomFichierIdentique = "";

  // Parcours le ou les fichiers drop dans la zone
  for (let i = 0; i < e.dataTransfer.files.length; i++) {
    let qrFile = e.dataTransfer.files[i];

    controllerEnsemble.isUnique(qrFile, qrcode => {
      if (qrcode.getType() != "ensemble") {
        let words = qrFile.name.split(".");
        if (!controllerEnsemble.occurenceFichier(words[0])) {
          genererLigne(words[0]);
          controllerEnsemble.recuperationQrCodeUnique(qrFile);
        } else {
          afficherPopUp = true;
          nomFichierIdentique += "\t" + words[0] + "\n";
        }
      } else {
        messageInfos("Impossible de mettre un qrcode ensemble dans un qrcode ensemble. Veuillez mettre que des qrcodes uniques", "danger");
      }
    });

  }

  // Affiche un popup avec le nom des fichiers qui n'ont pu être ajouté
  if (afficherPopUp) {
    messageInfos("Un ou plusieurs fichiers ont le même nom : " + nomFichierIdentique, "warning");
  }
  activer_button();
};

/*
 * Genere une ligne dans la zone de drop en fonction des fichiers drop dans la zone
 * Chaque ligne est clickable pour affichier le qrCode unique
 * Chaque ligne a un bouton pour supprimer la ligne
 */
function genererLigne(name) {
  let baliseDiv = document.createElement("DIV");
  let baliseSpan = document.createElement("SPAN");
  let baliseButton = document.createElement("BUTTON");
  let baliseI = document.createElement("I");
  let textDiv = document.createTextNode(name);

  baliseI.setAttribute("class", "fa fa-eraser");
  baliseI.setAttribute("style", "height:12px; width:12px;");

  baliseButton.addEventListener("click", effacerLigne);
  baliseButton.setAttribute("class", "btn btn-outline-success");
  baliseButton.appendChild(baliseI);

  baliseSpan.appendChild(textDiv);
  baliseSpan.setAttribute("style", "white-space: nowrap; padding:5px; font-size:0.7em;");
  baliseSpan.setAttribute("class", "qrData");
  baliseSpan.setAttribute("name", "qrCode");

  baliseDiv.addEventListener("click", afficherQrCode);
  baliseDiv.appendChild(baliseButton);
  baliseDiv.appendChild(baliseSpan);
  baliseDiv.id = name;

  txtZone.appendChild(baliseDiv);
}

// Affiche le qrCode unique lie à la ligne cliquable
function afficherQrCode(e) {
  let item = e.target;
  let id = this.id;
  console.log(this);
  console.log(item);
  affichageLigneParDefault();

  this.querySelector("span").setAttribute("style", "white-space: nowrap; padding:5px; font-size:0.7em; background-color:#99cc00;");

  let qrcodes = controllerEnsemble.getQRCodeAtomiqueArray();
  // Affiche le qrCode que l'on vien de selectionner
  for (let i = 0; i < qrcodes.length; i++) {
    if (qrcodes[i].getName() == id) {
      let facade = new FacadeController();
      facade.genererQRCode($('#qrView')[0], qrcodes[i]);
      controllerEnsemble.setQRCodeSelectionne(qrcodes[i]);
    }
  }

  console.log(controllerEnsemble.getQRCodeSelectionne());
  // qrCodesUniqueSelectionne = this;
}


// Supprime une ligne dans la zone de drop
function effacerLigne() {
  let id = this.parentNode.id;
  // let qrCodeTmp = [];

  // Supprime la ligne html lie au fichier
  for (let i = 1; i <= txtZone.childElementCount; i++) {
    if (txtZone.childNodes[i].id == id) {
      txtZone.removeChild(txtZone.childNodes[i]);
    }
  }

  // Supprime le fichier dans le tableau files
  let qrCodes = controllerEnsemble.getQRCodeAtomiqueArray();
  console.log("before suppress", qrCodes);
  console.log(id);
  console.log(qrCodes.filter(item => item.getName() != id));
  controllerEnsemble.setQRCodeAtomiqueArray(qrCodes.filter(item => item.getName() != id));
  console.log("after suppress", qrCodes);
}


// Redonne l'apparance par default d'une ligne
function affichageLigneParDefault() {
  $('#txtZone').find('span').css('background-color', '')
}

// Active le button vider et generer apres avoir donne un nom au qrCode
function activer_button() {
  if (document.getElementById('qrName').value.length > 0) {
    $('#preview ,#empty').attr('disabled', false);
  }
}

// save image qr code
function saveQRCodeImage() {
  const fs = require('fs');

  let qrcode = controllerEnsemble.getQRCodeEnsemble();
  let img = $('#qrView img')[0].src;

  // var data = img.replace(/^data:image\/\w+;base64,/, '');

  var data = img.replace(/^data:image\/[^;]/, 'data:application/octet-stream');

  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  console.log(data);
  xhr.open('GET', data, true);

  xhr.onreadystatechange = function() {
    if (xhr.readyState == xhr.DONE) {
      var filesaver = require('file-saver');
      console.log(xhr.response);
      filesaver.saveAs(xhr.response, qrcode.getName() + '.jpeg');
    }
  }

  xhr.send();
}
