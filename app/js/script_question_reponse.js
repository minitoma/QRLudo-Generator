
/**
 * BAH Marouwane
 * 2019
 */

var projet = new Projet();

nombre_question=0;

$(document).ready(function() {

  $("#play-sound-div").hide();

  //fonction pour ajouter un nouvelle reponse
  $("#validerDataDialog").click(function(){

      let identifiant= $('#newId').val();
      let reponseVocale = $("#newContenuVocal").val();
      let qrColor = $('#qrColor').val();
      let qrData = [];

        //On verifie qu'il y a une question de créée
        if (projet.getQuestion() == null) {
          alert ("pas de question");
          return ;
        }

        //On verifie que le texte de la reponse n'est pas vide
        if (identifiant === ""){
          alert("pas d'identifiant")
          return ; // si le champ est vide on sort
        }
        //On verifie que le texte du retour vocal n'est pas vide
        if(reponseVocale=== "") {
          alert("pas de reponse volacal");
          return;
        }

        var new_rep = new Reponse(identifiant, $("#qrColor").val());
        var new_rep_vocal = reponseVocale;

        //sortir de la fonction si la reponse existe déjà pour la question
        let existe = false;
        $.each(projet.getReponses(), function(i, val) {
          if (projet.getReponseById(val.getId()).getName() === identifiant){
            existe = true;
            return;
          }
        });
        if (existe){
          alert ("Cette Reponse exite deja");
          return false;
        }

        //Ajouter au projet et à la question la nouvelle réponse
        projet.addReponse(new_rep);
        //console.log('id='+new_rep.getId() );

        projet.getQuestion().addReponse( (new_rep.getId() ), new_rep_vocal);
        //console.log(projet.getQuestion());

        addReponseLine(new_rep);

      //  console.log(new_rep_vocal);
        console.log(projet.getQuestion());
        console.log("--------------------");
        console.log(projet.getReponses());
        console.log("--------------------");
        console.log(projet.getQuestion().getReponses());

        return true;

  });

//fonction pour e
  $("#preview").click(function() {
    $("#ajoutNewReponse").attr('disabled', false);

    let question= $('#newQuestionText').val();
    let bonneReponse = $('#newBonneReponsenText').val();
    let mauvaiseReponse = $('#newMauvaiseReponseText').val();
    let qrColor = $('#qrColor').val();
    let qrData = [];

    //On verifie si le texte de la question n'est pas vide
    if (question=== ""){
      alert("Veuillez saisir une Question d'abord");
          return; // si le champ est vide on sort
    }
    else if (bonneReponse=== ""){
      alert("Veuillez saisir le message de bonne réponse à la  question");
          return; // si le champ est vide on sort
    }
    else if (mauvaiseReponse=== ""){
      alert("Veuillez saisir le message de mauvaise  réponse à la question");
          return; // si le champ est vide on sort
    }
    else {
      let nouvQuestion = new Question (question,bonneReponse,mauvaiseReponse, qrData , $("#qrColor").val());
      projet.setQuestion(nouvQuestion);

      //addQuestionLine(nouvQuestion);
      var questions = projet.getQuestion();
      previewQRCode(questions, $('#qrView')[0]);
      $('#qrView').show();
    }
  });

  $('button#annuler').click(e => {
    //aficher popup quand on click sur reinitialiser
    // cache le qr générer & desactivation du bouton exporter
    var popUpQuiter = confirm("Etes vous sûr de vouloir réinitialiser?");
    if (popUpQuiter==true){
      $('#qrView').hide();
      $('#saveQRCode').attr('disabled', true);
      $("#ajoutNewReponse").attr('disabled', true);
      viderZone();
    }
  });
});

function addReponseLine(reponse){
  txtDragAndDrop.remove();

  var infos_rep = projet.getQuestion().getReponseById(reponse.getId());

  var newRepLine = "<div style='height:35px;' id='" + reponse.getId() + "'>" +
  "<li style='color:black;font-size:14px;'>" +
  "<label>" + reponse.getName() + "&nbsp&nbsp</label>" +
  "<em style='color:gray'>" + infos_rep.message + "</em>" +
  "<button class='btn btn-outline-success float-right' id='" + reponse.getId() + "' onclick='deleteReponse(this);'><i class='fa fa-trash-alt'></i></button>" +
  "<button class='btn btn-outline-success float-right' id='" + reponse.getId() + "' onclick='lireReponse(this);'><i class='fa fa-play'></i></button>" +
  "<div class='alert alert-success fade show float' role='alert' id='infoGenererQrCodeReponse" + reponse.getId() +"' style='display:none;font-size:15px;'>Ce bouton permet de pré-visualiser le Qr Code de la réponse</div>" +
  "</li>" +
  "</div>";

  nombre_question++;
  $("#cible").append(newRepLine);
}

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
  $("#saveQRCode").click(e => {
    saveQRCodeImage();
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
    //On verifie qu'il y a une question de créée
    if (projet.getQuestion() == null) {
      alert ("pas de question");
      return ;
    }
    else {
      txtDragAndDrop.remove();
    }

    // Parcours le ou les fichiers drop dans la zone
    for (let i = 0; i < e.dataTransfer.files.length; i++) {
      let qrFile = e.dataTransfer.files[i];


      facade =  new FacadeController();
      facade.importQRCodeJson(qrFile, qrCode =>{
        if (qrCode.getType() == 'xl' || qrCode.getType() == 'unique' || qrCode.getType() == 'reponse'){
          let qrId = qrCode.getId();
          let qrData = qrCode.getData();
          let qrName = qrCode.getName();

          console.log(qrId);
          console.log( qrData);

          var new_rep = new Reponse(qrName, $("#qrColor").val()); // cretation d'une nouvelle reponse
          new_rep.setId(qrId);        // changemnt de l'id de la nouvelle reponse avec l'id du qr imprté
          new_rep.setData(qrData);
          var new_rep_vocal = qrData;

          //sortir de la fonction si la reponse existe déjà pour la question
          let existe = false;
          $.each(projet.getReponses(), function(i, val) {
            if (projet.getReponseById(val.getId()).getName() === qrName){
              existe = true;
            }
          });
          if (existe){
            alert ("Cette Reponse exite deja");
            return ;
          }

          //verification que le QR code a un id     &&
          if(qrCode.getId() == null){
            alert ("Votre Qr Code n'a pas d'identifiant ERROR!");
            return ;
          }

          //Ajouter au projet et à la question la nouvelle réponse
          projet.addReponse(new_rep);
          //console.log('id='+new_rep.getId() );
          projet.getQuestion().addReponse( (new_rep.getId() ), new_rep_vocal);
          //console.log(projet.getQuestion());
          addReponseLine(new_rep);

        //  console.log(new_rep_vocal);
          console.log(projet.getQuestion());
          console.log("--------------------");
          console.log(projet.getReponses());
          console.log("--------------------");
          console.log(projet.getQuestion().getReponses());
        }
        else
          alert("Mauvais format de qr Code ! ");
     });
    }
  };


//Permet d'afficher une information sur le bouton pour generer les qr code
function afficheInfoBtnQrCode(button, cible){
  if(cible == "question") {
    $("#infoGenererQrCodeQuestion").show();
  }
  else if(cible == "reponse"){
    var id_reponse = $(button).attr('id');
    $("div#infoGenererQrCodeReponse" + id_reponse).show();
  }
}

//Permet d'enlever l'information sur le bouton pour generer les qr code
function supprimeInfoBtnQrCode(button, cible){
  if(cible == "question") {
    $("#infoGenererQrCodeQuestion").hide();
  }
  else if(cible == "reponse"){
      var id_reponse = $(button).attr('id');
      $("#infoGenererQrCodeReponse" + id_reponse).hide();
  }
}

//Supprimer une réponse du projet
function deleteReponse(button){
  var id_reponse = $(button).attr('id');

  projet.removeReponse(id_reponse);
  $("div#" + id_reponse).remove();

  console.log(projet.getQuestion());
  console.log("--------------------");
}

//Cette fonction sauvegarde l'image du qrcode dans un div pour le pouvoir generer apres
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

function previewQRCodeQuestion(){
  var question = projet.getQuestion();
  previewQRCode(question, $('#qrView')[0]);
}

// Previsualiser les reponses
function previewQRCodeReponse(button) {
  var id_reponse = $(button).attr('id');
  let rep = projet.getReponseById(id_reponse);
  previewQRCode(rep, $('#qrView')[0]);
}

// generate and print qr code
function previewQRCode(qrcode, div) {
  let facade = new FacadeController();

  facade.genererQRCode(div, qrcode);
}

function lireReponse(button){
  var id_reponse = $(button).attr('id');
  var text_reponse = $("div#" + id_reponse + " label").text();
  var text_retourVocal = $("div#" + id_reponse + " em").text();

  playTTS(text_reponse + text_retourVocal);
}
