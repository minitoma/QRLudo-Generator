
/**
 * BAH Marouwane
 * 2019
 */



nombre_question=0;
function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

$(document).ready(function() {

  $("#play-sound-div").hide();

  //fonction pour ajouter un nouvelle reponse
  $("#validerDataDialog").click(function(){

    txtDragAndDrop.remove();
    
    var identifiant = $("#newId").val();
    //console.log(id);

    let baliseDiv = document.createElement("DIV");
    let baliseSpan = document.createElement("SPAN");
    let textDiv = document.createTextNode(identifiant);
    let baliseButtonDelete = document.createElement("BUTTON");
    let baliseIDelete = document.createElement("I");

    //fonctionatité bouton delete   &&
    setAttributes(baliseIDelete, {"class": "fa fa-trash-alt", "height":"8px", "width":"8px"});
    baliseButtonDelete.addEventListener("click", effacerLigne);
    baliseButtonDelete.setAttribute("class", "btn btn-outline-success align-self-center legendeQR-close-btn");
    baliseButtonDelete.setAttribute("padding", "10px 10px");
    baliseButtonDelete.appendChild(baliseIDelete);

    //fonctionatité nom qrcode
    baliseSpan.appendChild(textDiv);
    baliseSpan.setAttribute("style", "white-space: nowrap; padding:5px; font-size:0.7em;");
    baliseSpan.setAttribute("class", "qrData ");
    baliseSpan.setAttribute("name", "qrCode");

    baliseDiv.appendChild(baliseSpan);
    baliseDiv.appendChild(baliseButtonDelete);

    baliseDiv.id="question"+nombre_question;
    baliseDiv.name=identifiant;

    nombre_question++;

    $("#cible").append(baliseDiv);

  });


  $("#ajoutNewReponse").click(function(){
    console.log("ajout");
  //  $("#dialogAjoutReponse").style.display();
  });
/*

*/
//fonction pour e
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



  $('button#annuler').click(e => {

    //aficher popup quand on click sur reinitialiser
    // cache le qr générer & desactivation du bouton exporter
    var popUpQuiter = confirm("Etes vous sûr de vouloir réinitialiser?");
    if (popUpQuiter==true){
      $('#qrView').hide();
      $('#saveQRCode').attr('disabled', true);
      $('#preview').attr('disabled', true);
        (viderZone());
    }

  });


});
function viderZone(){
    controllerEnsemble = new ControllerEnsemble();
    $('#qrName').val('');
    $(txtZone).empty();
    $("#cible").empty();
    txtZone.appendChild(txtDragAndDrop);

}

// Supprime une ligne dans la zone de drop
function effacerLigne() {
  //recuperation de id de l'element
  let idElement = $($(this).parent()).attr('id');

  $("#"+idElement).remove();


}

  // Redonne l'apparance par default d'une ligne
  function affichageLigneParDefault() {
    $('#txtZone').find('span').css('background-color', '')
  }

  /*Permet d'exporter un Projet
  On enregistre toutes les questions et réponses du projet dans le répertoire sélectionné
  par l'utilisateur*/
  $("#saveQRCode").click(function() {
    //Permet de sélectinner le répertoire où le projet va être enregistré
    var dir_path = dialog.showOpenDialog({title: 'Sélectionnez un dossier', properties: ['openDirectory']})[0];

    if(dir_path !== undefined){
      var facade = new FacadeController();
      projet.setName($("#projectId").val());

      var dir_path = path.join(dir_path, projet.getName());

      var fs = require('fs');
      if(!fs.existsSync(dir_path)){
        fs.mkdirSync(dir_path);
      }

      //On enregistre chaque question
      $.each(projet.getQuestions(), function(id, question){
        let div = document.createElement('div');
        facade.genererQRCode(div, question);
        saveQRCodeImage(div, question, dir_path);
      });

      //Idem pour les réponses
      $.each(projet.getReponses(), function(id, reponse){
        let div = document.createElement('div');
        facade.genererQRCode(div, reponse);
        saveQRCodeImage(div, reponse, dir_path);
      });

      $("#alertExportationOk").show();
      setTimeout(function () {
        $('#alertExportationOk').hide();
      }, 10000);
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


  };



  /*
   * Genere une ligne dans la zone de drop en fonction des fichiers drop dans la zone
   * Chaque ligne est clickable pour affichier le qrCode unique
   * Chaque ligne a un bouton pour supprimer la ligne
   */
  function genererLigne(name) {
    let baliseDiv = document.createElement("DIV");
    let baliseSpan = document.createElement("SPAN");
    let textDiv = document.createTextNode(name);

    let baliseButtonDelete = document.createElement("BUTTON");
    let baliseIDelete = document.createElement("I");


    let baliseButtonUp = document.createElement("BUTTON");
    let baliseIUp = document.createElement("I");

    let baliseButtonDown= document.createElement("BUTTON");
    let baliseIDown = document.createElement("I");


    //fonctionatité bouton delete   &&
    setAttributes(baliseIDelete, {"class": "fa fa-trash-alt", "height":"8px", "width":"8px"});
    baliseButtonDelete.addEventListener("click", effacerLigne);
    baliseButtonDelete.setAttribute("class", "btn btn-outline-success align-self-center legendeQR-close-btn");
    baliseButtonDelete.setAttribute("padding", "10px 10px");
    baliseButtonDelete.appendChild(baliseIDelete);

    //fonctinalité bouton up  &&
    setAttributes(baliseIUp, {"class": "fa fa-arrow-up", "height":"8px", "width":"8px"});
    baliseButtonUp.setAttribute("class","btn btn-outline-success align-self-center legendeQR-close-btn ");
    baliseButtonUp.appendChild(baliseIUp);
    baliseButtonUp.setAttribute("id", name+'Up');


    //fonctinalité bouton down  &&
    setAttributes(baliseIDown, {"class": "fa fa-arrow-down", "height":"8px", "width":"8px"});
    baliseButtonDown.setAttribute("class","btn btn-outline-success  ");
    baliseButtonDown.appendChild(baliseIDown);
    baliseButtonDown.setAttribute("id", name+'Down');



    //fonctionatité nom qrcode
    baliseSpan.appendChild(textDiv);
    baliseSpan.setAttribute("style", "white-space: nowrap; padding:5px; font-size:0.7em;");
    baliseSpan.setAttribute("class", "qrData ");
    baliseSpan.setAttribute("name", "qrCode");



    baliseDiv.addEventListener("click", afficherQrCode);
    baliseDiv.appendChild(baliseSpan);
    baliseDiv.id = name;

    baliseDiv.appendChild(baliseButtonDelete);
    baliseDiv.appendChild(baliseButtonUp);
    baliseDiv.appendChild(baliseButtonDown);

    //txtZone.appendChild(baliseDiv);
    $("#cible").append(baliseDiv);

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
/*

*/
