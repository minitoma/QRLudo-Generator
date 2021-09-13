/**
 * @Date:   2018-12-06T16:32:33+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2019-01-16T23:37:53+01:00
 */


$().ready(function () {
  enregistrement();
  store.delete(`numFich`);
  store.set(`numFich`, numFich);

  $("#play-sound-div").hide();


  /** Genere le qrCode multiple */
  $("#preview").on('click', function () {

    affichageLigneParDefault();

    let qrColor = $("#qrColor").val();
    controllerMultiple.setQRCodeMultiple(new QRCodeMultipleJson(document.getElementById('qrName').value, [], qrColor));


    /** Ajoute les donnees json de chaque qrCode unique dans le qrCode multiple */
    let qrcodes = controllerMultiple.getQRCodeAtomiqueArray();
    let qrcodeEns = controllerMultiple.getQRCodeMultiple();


    for (let i = 0; i < qrcodes.length; i++) {
      qrcodeEns.ajouterQrCode(qrcodes[i]);
    }
    console.log("-----------------");
    console.log(qrcodes);
    let facade = new FacadeController();
    facade.genererQRCode($('#qrView')[0], qrcodeEns);
    //console.log($('#qrView')[0]);

    $('#saveQRCode').attr('disabled', false);
  });

  //$("#empty").on('click',viderZone);
  $("#emptyFields").on('click', function () {
    viderZone();
  })

  $("#saveQRCode").on('click', e => {
    saveQRCodeImage();
  });

  if (document.getElementById('qrName').value.length === 0) {
    $('#preview #empty').attr('disabled', true);
  }

  if (numFich > 0)
    document.getElementById('preview').disabled = false;
});

var dropZone = document.getElementById('dropZone');
var txtZone = document.getElementById('txtZone');

var txtDragAndDrop = document.createElement("P");

txtDragAndDrop.setAttribute("id", "txtDragAndDrop");
txtDragAndDrop.setAttribute("class", "col-sm-7");
txtDragAndDrop.setAttribute("style", "text-align: center; margin-top: 15%");
txtDragAndDrop.innerText = "Déposez vos fichiers ici";

txtZone.appendChild(txtDragAndDrop);
/** Ce declenche quand un element entre dans la zone de drop */
dropZone.ondragenter = function (e) { };

/** Ce declenche quand un element quitte la zone de drop */
dropZone.ondragleave = function (e) { };

/** Ce declenche quand un element se deplace dans la zone de drop */
dropZone.ondragover = function (e) {
  e.preventDefault();
};

/** Ce declenche quand un element est depose dans la zone de drop */
dropZone.ondrop = function (e) {
  e.preventDefault();

  console.log(e);

  let afficherPopUp = false;
  let nomFichierIdentique = "";

  /** Parcours le ou les fichiers drop dans la zone */
  for (let i = 0; i < e.dataTransfer.files.length; i++) {
    let qrFile = e.dataTransfer.files[i];

    controllerMultiple.isUnique(qrFile, qrcode => {
      //TODO Ici changer le "ensemble" en "multiple"
      if (qrcode.getType() != "ensemble") {
        let words = qrFile.name.split(".");
        if (!controllerMultiple.occurenceFichier(words[0])) {
          genererLigne(words[0], numFich);
          console.log(numFich);
          store.set(`fichierDrop${numFich}`, words[0]);
          numFich++;
          store.set(`numFich`, numFich);
          controllerMultiple.recuperationQrCodeUnique(qrFile);
        } else {
          afficherPopUp = true;
          nomFichierIdentique += "\t" + words[0] + "\n";
        }
      } else {
        messageInfos("Impossible de mettre un qrcode multiple dans un qrcode multiple. Veuillez mettre que des qrcodes uniques", "danger");
      }
    });

  }

  console.log('Element déposer dans la zone de drop ' + controllerMultiple.getQRCodeAtomiqueArray());

  /** Affiche un popup avec le nom des fichiers qui n'ont pu être ajouté */
  if (afficherPopUp) {
    messageInfos("Un ou plusieurs fichiers ont le même nom : " + nomFichierIdentique, "warning");
  }
  activer_button();
};

function ajoutQrCcode() {

  let qrColor = $('#qrColor').val();
  var qrName = $("#nomQR").val();
  var donnee = $("#ContenuQR").val();
  var qrData = [];
  qrData.push(donnee);

  /** Reset de la boite de dialogue */
  document.getElementById("nomQR").value = "";
  document.getElementById("ContenuQR").value = "";

  let newQrUnique = new QRCodeUnique(qrName, qrData, qrColor);
  console.log(newQrUnique);
  genererLigne(qrName, numFich);

  store.set(`fichierDrop${numFich}`, qrName);
  numFich++;
  store.set(`numFich`, numFich);

  controllerMultiple.ajoutQRcode(newQrUnique);

  console.log(controllerMultiple.getQRCodeAtomiqueArray());
  activer_button();

  document.getElementById("saveQRCode").disabled = true;
}

/** permet la continuité entre les onflet spécifiquement pour l'onglet multiple */
function enregistrement() {

  if (store.get(`numFich`)) {
    numFich = store.get(`numFich`);
  }

  /** vérifier si un enregistrement du titre existe */
  if (store.get(`titremultiple`)) {
    $('#qrName').val(store.get(`titremultiple`));
  }

  for (var i = 0; i < numFich; i++) {
    if (store.get(`fichierDrop${i}`)) {
      genererLigne(store.get(`fichierDrop${i}`));
    }
  }
}

function setAttributes(el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}
/**
 * Genere une ligne dans la zone de drop en fonction des fichiers drop dans la zone
 * Chaque ligne est clickable pour affichier le qrCode unique
 * Chaque ligne a un bouton pour supprimer la ligne
 */
function genererLigne(name, numLigne) {
  $('#txtDragAndDrop').hide();

  let baliseDiv = document.createElement("DIV");
  let baliseSpan = document.createElement("SPAN");
  let textDiv = document.createTextNode(name);

  let baliseButtonDelete = document.createElement("BUTTON");
  let baliseIDelete = document.createElement("I");

  let baliseButtonUp = document.createElement("BUTTON");
  let baliseIUp = document.createElement("I");

  let baliseButtonDown = document.createElement("BUTTON");
  let baliseIDown = document.createElement("I");

  let balisePrevisualisation = document.createElement("BUTTON");
  let baliseIPrevisualisation = document.createElement("I");

  let baliseLabel = document.createElement("LABEL");
  baliseLabel.setAttribute("class", "btn");
  baliseLabel.innerHTML = name;

  /** fonctionnalité bouton delete   && */
  setAttributes(baliseIDelete, { "class": "fa fa-trash-alt ", "height": "8px", "width": "8px" });
  baliseButtonDelete.addEventListener("click", effacerLigne);
  baliseButtonDelete.setAttribute("class", "btn btn-outline-success float-right");
  baliseButtonDelete.setAttribute("padding", "10px 10px");
  baliseButtonDelete.appendChild(baliseIDelete);

  /** fonctionnalité bouton up  && */
  setAttributes(baliseIUp, { "class": "fa fa-arrow-up ", "height": "8px", "width": "8px" });
  baliseButtonUp.setAttribute("class", "btn btn-outline-success float-right ");
  baliseButtonUp.appendChild(baliseIUp);
  baliseButtonUp.setAttribute("id", name + 'Up');
  baliseButtonUp.addEventListener("click", upItem);

  /** fonctionnalité bouton down  && */
  setAttributes(baliseIDown, { "class": "fa fa-arrow-down ", "height": "8px", "width": "8px" });
  baliseButtonDown.setAttribute("class", "btn btn-outline-success float-right ");
  baliseButtonDown.appendChild(baliseIDown);
  baliseButtonDown.setAttribute("id", name + 'Down');
  baliseButtonDown.addEventListener("click", downItem);

  /** fonctionnalité bouton previsualisation */
  setAttributes(baliseIPrevisualisation, { "class": "fa fa-qrcode", "height": "8px", "width": "8px" });
  balisePrevisualisation.setAttribute("class", "btn btn-outline-success float-right");
  balisePrevisualisation.setAttribute("id", name + 'Previsualisation');
  balisePrevisualisation.addEventListener("click", afficherQrCode)
  balisePrevisualisation.appendChild(baliseIPrevisualisation);

  /** fonctionnalité nom qrcode */
  baliseSpan.appendChild(baliseLabel);
  baliseSpan.setAttribute("style", "white-space: nowrap; padding:5px; font-size:0.7em;");
  baliseSpan.setAttribute("class", "qrData text-left ");
  baliseSpan.setAttribute("name", "qrCode");

  //baliseDiv.addEventListener("click", afficherQrCode);
  baliseDiv.setAttribute("style", "height:40px");
  baliseDiv.appendChild(baliseSpan);
  baliseDiv.id = name;

  baliseDiv.appendChild(baliseButtonDelete);
  baliseDiv.appendChild(balisePrevisualisation)
  baliseDiv.appendChild(baliseButtonUp);
  baliseDiv.appendChild(baliseButtonDown);

  txtZone.appendChild(baliseDiv);
}

/** Affiche le qrCode unique lie à la ligne cliquable */
function afficherQrCode(e) {
  let item = e.target;
  let id = this.id;
  console.log(this);
  console.log(item);
  affichageLigneParDefault();


  let qrcodes = controllerMultiple.getQRCodeAtomiqueArray();
  /** Affiche le QR Code que l'on vient de selectionner */
  for (let i = 0; i < qrcodes.length; i++) {
    if (qrcodes[i].getName() + "Previsualisation" == id) {
      let facade = new FacadeController();
      facade.genererQRCode($('#qrView')[0], qrcodes[i]);
      controllerMultiple.setQRCodeSelectionne(qrcodes[i]);
    }
  }

  console.log(controllerMultiple.getQRCodeSelectionne());
}

/** Supprime une ligne dans la zone de drop */
function effacerLigne() {
  let id = this.parentNode.id;

  for (var i = 0; i < numFich; i++) {
    if (store.get(`fichierDrop${i}`) == id) {
      store.delete(`fichierDrop${i}`);
    }
  }
  /** Supprime la ligne html lie au fichier */
  for (let i = 0; i <= txtZone.childElementCount; i++) {
    if (txtZone.childNodes[i].id == id) {
      txtZone.removeChild(txtZone.childNodes[i]);
    }
  }

  /** Supprime le fichier dans le tableau files */
  let qrCodes = controllerMultiple.getQRCodeAtomiqueArray();
  console.log("before suppress", qrCodes);
  console.log(id);
  console.log(qrCodes.filter(item => item.getName() != id));
  controllerMultiple.setQRCodeAtomiqueArray(qrCodes.filter(item => item.getName() != id));
  console.log("after suppress", qrCodes);

  /** verification qu'il ne reste plus delement pour remetre le text du dop */
  if ($("#txtZone div").length == 0) {
    console.log("coucou");
    $('#txtDragAndDrop').show();
  }
}

/** Vide les tableaux qrCodes, files et les lignes de la zone drop */
function viderZone() {
  controllerMultiple = new ControllerMultiple();
  $('#qrName').val('');
  $(txtZone).empty();
  txtZone.appendChild(txtDragAndDrop);
  $('#txtDragAndDrop').show();

  /** Permet la suppression des elements du store créé dans le script_multiple */
  if (store.get(`numFich`)) {
    store.delete(`numFich`);
  }

  /** vérifier si un enregistrement du titre existe */
  if (store.get(`titremultiple`)) {
    store.delete(`titremultiple`);
  }

  for (var i = 0; i < numFich; i++) {
    if (store.get(`fichierDrop${i}`)) {
      store.delete(`fichierDrop${i}`);
    }
  }
  numFich = 0;
}

/** Redonne l'apparance par default d'une ligne */
function affichageLigneParDefault() {
  $('#txtZone').find('span').css('background-color', '')
}

/** Active le button vider et generer apres avoir donne un nom au qrCode */
function activer_button() {
  /** Permet l'enregistrement du titre dans le store */
  store.delete(`titremultiple`);
  var titre = document.getElementById('qrName').value;
  store.set(`titremultiple`, titre);

  //if (document.getElementById('qrName').value.length > 0) {
  $('#preview ,#empty').attr('disabled', false);
  //}
}

/** save image qr code */
function saveQRCodeImage() {
  const fs = require('fs');

  let qrcode = controllerMultiple.getQRCodeMultiple();
  let img = $('#qrView img')[0].src;

  // var data = img.replace(/^data:image\/\w+;base64,/, '');

  var data = img.replace(/^data:image\/[^;]/, 'data:application/octet-stream');

  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  console.log(data);
  xhr.open('GET', data, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == xhr.DONE) {
      var filesaver = require('file-saver');
      console.log(xhr.response);
      filesaver.saveAs(xhr.response, qrcode.getName() + '.jpeg');
    }
  }

  xhr.send();
}


/** fonction deplacement de fichier vers le haut ou bas  &&& */
function upItem(e) {
  let parentElement = $(this).parent();

  /** Gere la continuité sur le moveUp : */
  let parentElementVal = parentElement.attr('id');
  let prevVal = $(parentElement).prev().attr('id');
  /** Permet de savoir le numFich qui correspond au fichier appelé avec le bouton */
  var tmpVal = 0;

  for (var i = 0; i < numFich; i++) {
    if (store.get(`fichierDrop${i}`) == parentElementVal)
      tmpVal = i;
    if (store.get(`fichierDrop${i}`) == prevVal)
      store.set(`fichierDrop${i}`, parentElementVal);
  }
  store.set(`fichierDrop${tmpVal}`, prevVal);

  $(parentElement).insertBefore($(parentElement).prev());
}

/** fonction deplacement de fichier vers bas  &&& */
function downItem(e) {
  let parentElement = $(this).parent();

  /** Gere la continuité sur le moveUp : */
  let parentElementVal = parentElement.attr('id');
  let nextVal = $(parentElement).next().attr('id');
  /** Permet de savoir le numFich qui correspond au fichier appelé avec le bouton */
  var tmpVal = 0;

  for (var i = 0; i < numFich; i++) {
    if (store.get(`fichierDrop${i}`) == parentElementVal)
      tmpVal = i;
    if (store.get(`fichierDrop${i}`) == nextVal)
      store.set(`fichierDrop${i}`, parentElementVal);
  }
  store.set(`fichierDrop${tmpVal}`, nextVal);

  $(parentElement).insertAfter($(parentElement).next());
}

//pour ouvrir la page info.html quand on clique sur le bouton info du haut
$("#infos-multiple").on('click', function () {
  require('@electron/remote').getGlobal('sharedObject').someProperty = 'multiple'
  $("#charger-page").load(path.join(__dirname.match(`.*app`)[0], '/rendererProcess/view/aide/info.html'));
});