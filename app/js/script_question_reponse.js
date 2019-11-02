/**
 * @Date:   2018-11-23T11:47:00+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-04T21:15:05+01:00
 */

/**
 * Abdessabour HARBOUL
 * 2018
 */

var projet = new Projet();
var currentQuestion = null;


$(document).ready(function() {

  $("#play-sound-div").hide();



  $("#ajoutNewReponse").click(function(){
    console.log("ajout");
  //  $("#dialogAjoutReponse").style.display();
  });
/*

*/

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
    }

    e.preventDefault();
    var settings = require("electron-settings");

    if (settings.has("defaultColor")) {
      $("#qrColor").val(settings.get("defaultColor"));
      let a = $('#legendeTextarea');
      $.each($(".qrData"), function(i, val) {
        $("#cible").empty();
      });
    }
  });


});



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


/*

function addQuestionLine(question){
  var newQuestLine = "<div class='form-control divQuestion' id='" + question.getId() + "' style='margin-top:10px;'>" +
  "<div class='form-group'>" +
  "<label class='control-label text-left questionNameLabel' id='" + question.getId() + "' style='text-align:left!important; color:black;'>" + question.getName() + "</label>" +
  "<button class='btn btn-outline-success float-right' id='" + question.getId() + "' onclick='deleteQuestion(this);'><i class='fa fa-trash-alt'></i></button>" +
  "<button class='btn btn-outline-success float-right' id='" + question.getId() + "' onclick='previewQRCodeQuestion(this)'><i class='fa fa-qrcode'></i></button>" +
  "<button class='btn btn-outline-success float-right' id='" + question.getId() + "' onclick='lireQuestion(this);'><i class='fa fa-play'></i></button>"  +
  "</div>" +
  "<label class='control-label'>Réponse(s)</label>" +
  "<div class='reponseDiv' id='" + question.getId() + "'>" +
  "</div>" +
  "</div>";

  $("#questionsDivLabelsId").append(newQuestLine);
}

//Ajout de la reponse dans le div d'une question
function addReponseLineToQuestionDiv(question, reponse){
  var infos_rep = question.getReponseById(reponse.getId());

  var newRepLine = "<div style='height:35px;' id='" + reponse.getId() + "'>" +
  "<li style='color:black; font-size:15px;'>" +
  "<label>" + reponse.getName() + "&nbsp&nbsp</label>" +
  "<em style='color:gray'>" + infos_rep.message + "</em>" +
  "<button class='btn btn-outline-success float-right' id='" + reponse.getId() + "' onclick='deleteReponse(this," + question.getId() + ");'><i class='fa fa-trash-alt'></i></button>" +
  "<button class='btn btn-outline-success float-right' id='" + reponse.getId() + "' onclick='previewQRCodeReponse(this)' onmouseover='affiche(this)'><i class='fa fa-qrcode'></i></button>" +
  "<button class='btn btn-outline-success float-right' id='" + reponse.getId() + "' onclick='lireReponse(this);'><i class='fa fa-play'></i></button>" +
  "</li>" +
  "</div>";

  $("div#" + question.getId() + ".reponseDiv").append(newRepLine);
}

function affiche(button) {
  var id_question = $(button).attr('id');
  $("div#" + id_question).val('Generer QR Code');
}

// Jamais utilisé ??
function toggleCustomMessageInput(checkbox){
  var id_reponse = $(checkbox).attr('id');
  if($(checkbox).prop('checked')){
    $("#" + id_reponse + ".customMessage").show();
  }
  else{
    $("#" + id_reponse + ".customMessage").hide();
  }
}


//Supprimer une question du projet
function deleteQuestion(button){
  var id_question = $(button).attr('id');
  $("div#" + id_question + '.divQuestion').remove();

  projet.removeQuestion(JSON.parse(id_question));
}

//Supprimer une réponse du projet
function deleteReponse(button, questionId){
  var id_reponse = $(button).attr('id');

  projet.removeReponseFromQuestion(id_reponse, questionId);
  $("div#" + id_reponse).remove();
}

//Méthode appelée lors de l'import d'un qrcode Question/Réponse
//Permet d'ajouter au projet les qrcodes importés
function importQuestionReponse(qrcode){
  if(qrcode.getType()==='question'){
    projet.addQuestion(qrcode);
    addQuestionLine(qrcode);
    $.each(qrcode.getReponses(), function(i, infos_rep){
      //Pour chaque réponse de la question, on vérifie si elle a déjà été importée
      //dans le Projet
      //Si oui, alors on l'ajoute à l'affichage de la question
      var rep = projet.getReponseById(infos_rep.id);
      if(rep !== null){
        addReponseLineToQuestionDiv(qrcode, rep);
      }
    });
  }
  else if (qrcode.getType()==='reponse') {
    projet.addReponse(qrcode);
    addReponseLine(qrcode);
    $.each(projet.getQuestions(), function(i, question){
      //On vérifie si la réponse importée est une réponse
      //aux questions du projet déjà importées
      //Si oui, on ajoute la réponse à l'affichage de la question concernée
      var infos_rep = question.getReponseById(qrcode.getId());
      if(infos_rep !== null){
        addReponseLineToQuestionDiv(question, qrcode);
      }
    });
  }
}

// Jamais utilisé ??
function setCustomMessage(button){
  var id_question = JSON.parse($("#questionsId option:selected").val());
  if(id_question!=='noquest'){
    for(let question of projet.getQuestions()){
      if(question.getId() === id_question){
        var input_text = button.parent('div').find("input");
        question.setMessage(JSON.parse($(input_text).attr('id')), $(input_text).val());
        $('#alertModifMessageOk').show();
        setTimeout(function () {
          $('#alertModifMessageOk').hide();
        }, 10000);
      }
    }
  }
}

//Cette fonction sauvegarde l'image du qrcode dans un div pour le pouvoir generer apres
function saveQRCodeImage(div, qrcode, directoryName) {
  let img = $(div).children()[0].src;
  //let data = img.replace(/^data:image\/\w+;base64,/, '');
  let matches = img.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  let data = new Buffer(matches[2], 'base64');
  var file_name = qrcode.getName().replace(/[^a-zA-Z0-9]+/g, "") + '.jpeg';
  fs.writeFile(path.join(directoryName, file_name), data, (err) => {
    if (err){
      $("#questionsDivLabelsId").append("<div>" + err + "</div>");
    }
    console.log('The file has been saved!');
  });
}

function activerSave(){
  if($("#projectId").val().length > 0){
    $("#saveQRCode").attr('disabled', false);
  }
  else{
    $("#saveQRCode").attr('disabled', true);
  }
}

function previewQRCodeQuestion(button){
  var id_question = $(button).attr('id');
  var question = projet.getQuestionById(id_question);
  previewQRCode(question, $('#qrView')[0], "type_question");
}

// Previsualiser les reponses
function previewQRCodeReponse(button) {
  var id_reponse = $(button).attr('id');
  let rep = projet.getReponseById(id_reponse);
  previewQRCode(rep, $('#qrView')[0], "type_reponse");
}

// generate and print qr code
function previewQRCode(qrcode, div, type) {
  let facade = new FacadeController();
  if (type == "type_question"){
    $.each($("#reponsesDivLabelsId div input"), function(i, val){
      if(val.value !== ''){
        qrcode.setMessage(val.id, val.value);
      }
    });

  }
  facade.genererQRCode(div, qrcode);
}

function lireQuestion(button){
  var id_question = $(button).attr('id');
  var text_question = $("label#" + id_question + ".questionNameLabel").text();

  playTTS(text_question);
}

function lireReponse(button){
  var id_reponse = $(button).attr('id');
  var text_reponse = $("div#" + id_reponse).text();

  playTTS(text_reponse)
}
*/

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

function setAttributes(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

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
  baliseButtonUp.addEventListener("click", upItem);

  //fonctinalité bouton down  &&
  setAttributes(baliseIDown, {"class": "fa fa-arrow-down", "height":"8px", "width":"8px"});
  baliseButtonDown.setAttribute("class","btn btn-outline-success  ");
  baliseButtonDown.appendChild(baliseIDown);
  baliseButtonDown.setAttribute("id", name+'Down');
  baliseButtonDown.addEventListener("click", downItem);


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

  txtZone.appendChild(baliseDiv);


}
}
