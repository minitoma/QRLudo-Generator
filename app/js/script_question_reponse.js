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

$(document).ready(function() {
  //Affichage de la couleur par défaut des paramètres
  var settings = require("electron-settings");
  if (settings.has("defaultColor")) {
    $("#qrColor").val(settings.get("defaultColor"));
  }

  $("#play-sound-div").hide();

  //Ajout d'une nouvelle question
  $("#addNewQuesBtnId").click(function() {
    if ($('#newQuestionText').val() === ""){
      $("#alertQuestionVideError").show();
      setTimeout(function () {
        $('#alertQuestionVideError').hide();
      }, 10000);
      return; // si le champ est vide on sort
    }
    $("#alertQuestionVideError").hide();

    //Ajouter au projet la nouvelle question
    let nouvques = new Question($('#newQuestionText').val(), [], $("#qrColor").val());
    projet.addQuestion(nouvques);

    addQuestionLine(nouvques);

    //On ouvre le modal de modification de la question
    $("#" + nouvques.getId() + ".editQuestion").click();

    $('#newQuestionText').val("");
    return true;
  });

  $("#addNewRepBtnId").click(function(e){
    e.preventDefault();
    $("#alertReponseExistanteError").hide();
    $("#alertReponseVideError").hide();

    if ($('#newReponseText').val() === ""){
      $("#alertReponseVideError").show();
      return; // si le champ est vide on sort
    }
    //sortir de la fonction si le champ entré existe deja
    let existe = false;
    $.each(projet.getReponses(), function(i, val) {
      if (val.getName() === $('#newReponseText').val()) {
        existe = true;
        return;
      }
    });
    if (existe){
      $("#alertReponseExistanteError").show();
      return;
    }

    var new_rep = new Reponse($('#newReponseText').val(), $("#qrColor").val());
    //Ajouter au projet la nouvelle réponse
    projet.addReponse(new_rep);

    addReponseLine(new_rep);

    $('#newReponseText').val('');

    return true;
  });

  $("#addNewRepBtnModalId").click(function(e){
    e.preventDefault();
    $("#messageReponseVideModalError").hide();
    $("#messageReponseModalError").hide();

    if ($('#newReponseModalText').val() === ""){
      $("#messageReponseVideModalError").show();
      return false; // si le champ est vide on sort
    }
    //sortir de la fonction si le champ entré existe deja
    let existe = false;
    $.each(projet.getReponses(), function(i, val) {
      if (val.getName() === $('#newReponseModalText').val()) {
        existe = true;
        return;
      }
    });
    if (existe){
      $("#messageReponseModalError").show();
      return false;
    }

    var new_rep = new Reponse($('#newReponseModalText').val(), $("#qrColor").val());
    //Ajouter au projet la nouvelle réponse
    projet.addReponse(new_rep);

    addReponseLine(new_rep);

    //Par défaut, la réponse ajoutée est checkée
    $("#" + new_rep.getId() +".reponseCheckbox").prop('checked', true);
    $('#newReponseModalText').val('');

    return true;
  });

  $("#validateeditQuestionModal").click(function(e){
    var id_question = JSON.parse($("#editQuestionModalIdQuestion").val());
    var nom_question = $("#editQuestionModalQuestion").val();

    if(nom_question === '') return false;
    var question = projet.getQuestionById(id_question);

    question.setName(nom_question);
    $("#" + id_question + '.questionNameLabel').text(nom_question);

    question.removeAllReponses()
    $("div#" + id_question + ".reponseDiv").empty();
    $.each($(".reponseCheckbox"), function(i, checkbox){
      if($(checkbox).prop('checked')){
        var id_rep = $(checkbox).attr('id');
        var custom_message = $("#" + id_rep + ".customMessage").val();
        question.addReponse(id_rep, custom_message);
        var rep = projet.getReponseById(id_rep);
        addReponseLineToQuestionDiv(question, rep);
      }
    });

    $("#editQuestionModal .close").click();

    return true;
  });

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

  //Import d'un projet existant à partir d'un répertoire
  $('#importProjectBtnId').click(function() {
    //Permet de sélectionner le répertoire du projet
    var dir_path = dialog.showOpenDialog({title: 'Sélectionnez le projet', properties: ['openDirectory']})[0];
    projet = new Projet();
    var path_split = dir_path.split(path.sep);
    //On récupère le nom du projet
    projet.setName(path_split[path_split.length-1]);
    $("#projectId").val(path_split[path_split.length-1]);
    $("#reponsesListModal").empty();
    $("#questionsDivLabelsId").empty();

    let facade = new FacadeController();

    var fs = require('fs');

    //Pour chaque fichier du répertoire
    fs.readdir(dir_path, (err, files) => {
      $.each(files, function(i, file){
        console.log(file);
        var file_path = path.join(dir_path,file);
        let blob = null;
        //On crée une requête xmlhttp pour récupérer le blob du fichier
        let xhr = new XMLHttpRequest();
        xhr.open("GET", file_path);
        xhr.responseType = "blob";
        xhr.onload = function() {
          blob = xhr.response;
          //Puis on importe le qrcode à partir du blob récupéré

          //importQuestionReponse est un callback, il s'agit de la méthode appliquée
          //par la façade sur le qrcode importé
          //(cf méthode importQuestionReponse)
          facade.importQRCode(blob, importQuestionReponse);
        }
        xhr.send();
      });
    });
    $("#saveQRCode").attr('disabled', false);
  });

  //Changement couleur
  $("#qrColor").on('change', function(){
    var color = $(this).val();
    $.each(projet.getQuestions(), function(i, question){
      question.setColor(color);
    });

    $.each(projet.getReponses(), function(i, reponse){
      reponse.setColor(color);
    });
  });
});

function addQuestionLine(question){
  var new_question_ligne = "<div class='form-control divQuestion' id='" + question.getId() + "' style='margin-top:10px;'>" +
  "<div class='form-group'>" +
  "<label class='control-label text-left questionNameLabel' id='" + question.getId() + "' style='text-align:left!important; color:black;'>" + question.getName() + "</label>" +
  "<button class='btn btn-outline-success float-right' id='" + question.getId() + "' onclick='deleteQuestion(this);'><i class='fa fa-trash-alt'></i></button>" +
  "<button class='btn btn-outline-success float-right' id='" + question.getId() + "' onclick='previewQRCodeQuestion(this)'><i class='fa fa-qrcode'></i></button>" +
  "<button class='btn btn-outline-success float-right editQuestion' id='" + question.getId() + "' data-toggle='modal' data-target='#editQuestionModal' onclick='editQuestion(this);'><i class='fa fa-edit'></i></button>"  +
  "<button class='btn btn-outline-success float-right' id='" + question.getId() + "' onclick='lireQuestion(this);'><i class='fa fa-play'></i></button>"  +
  "</div>" +
  "<label class='control-label'>Réponse(s)</label>" +
  "<div class='reponseDiv' id='" + question.getId() + "'>" +
  "</div>" +
  "</div>";

  $("#questionsDivLabelsId").append(new_question_ligne);
}

function addReponseLine(reponse){
  var settings = require("electron-settings");
  var default_message = settings.get("defaultBonneReponse");

  //Ajout dans le modal de modification d'une réponse
  var new_ligne_reponse_modal = "<div class='form-group divReponseLigneModal' id='" + reponse.getId() + "'>" +
  "<input class='form-check-input reponseCheckbox' type='checkbox' id='" + reponse.getId() + "' onclick='toggleCustomMessageInput(this);'/>" +
  "<p>" + reponse.getName() + "</p>" +
  "<input type='text' id='" + reponse.getId() + "' class='customMessage col-lg-12' placeholder='Saisissez le message de la réponse'/></div>";
  $("#reponsesListModal").append(new_ligne_reponse_modal);

  //Ajout dans le panel des réponses
  var new_ligne_reponse_panel = "<div class='form-group divReponseLignePanel' id='" + reponse.getId() + "'>" +
  "<label class='control-label text-left reponseNameLabel' id='" + reponse.getId() +  "'>" + reponse.getName()+ "</label>" +
  "<button class='btn btn-outline-success float-right' id='" + reponse.getId() + "' onclick='deleteReponse(this);'><i class='fa fa-trash-alt'></i></button>" +
  "<button class='btn btn-outline-success float-right' id='" + reponse.getId() + "' onclick='previewQRCodeReponse(this)'><i class='fa fa-qrcode'></i></button>" +
  "<button class='btn btn-outline-success float-right' id='" + reponse.getId() + "' onclick='lireReponse(this);'><i class='fa fa-play'></i></button>"  +
  "</div>";

  $("#reponsesDivLabelsId").append(new_ligne_reponse_panel);
}

function addReponseLineToQuestionDiv(question, reponse){
  var infos_rep = question.getReponseById(reponse.getId());
  $("div#" + question.getId() + ".reponseDiv").append("<li style='color:black;' id='" + reponse.getId() + "'>" + reponse.getName() + " <em style='color:gray'>" + infos_rep.message + "</em></li>");
}

function toggleCustomMessageInput(checkbox){
  var id_reponse = $(checkbox).attr('id');
  if($(checkbox).prop('checked')){
    $("#" + id_reponse + ".customMessage").show();
  }
  else{
    $("#" + id_reponse + ".customMessage").hide();
  }
}

//Préparation du modal editQuestionModal qui permet de modifier une question
function editQuestion(button){
  console.log("click");


  var id = $(button).attr('id');
  var ques = projet.getQuestionById(id);

  //Ajout du texte de la question, dans l'input qui permet de modifier le texte
  $("#editQuestionModalQuestion").val(ques.getName());
  $("#editQuestionModalIdQuestion").val(id);

  //Pour chaque checkbox du modal, on vérifie si la réponse correspondante fait partie
  //des réponses de la question
  //Si oui, on checke la checkbox
  $.each($(".reponseCheckbox"), function(i, checkbox){
    var id_rep = $(checkbox).attr('id');
    $(checkbox).prop('checked', false);
    $("#" + id_rep + ".customMessage").hide();
    $("#" + id_rep + ".customMessage").val('');
    var reponse = ques.getReponseById(id_rep);
    if(reponse !== null){
      $(checkbox).prop('checked', true);
      $("#" + id_rep + ".customMessage").show();
      $("#" + id_rep + ".customMessage").val(reponse.message);
    }
  });

  //On vide le champ texte de la réponse et on cache les alerts
  $("#newReponseModalText").val('');
  $("#messageReponseModalError").hide();
  $("#messageReponseVideModalError").hide();
}

//Supprimer une question du projet
function deleteQuestion(button){
  var id_question = $(button).attr('id');
  $("div#" + id_question + '.divQuestion').remove();
  projet.removeQuestion(JSON.parse(id_question));
}

//Supprimer une réponse du projet
function deleteReponse(button){
  var id_reponse = $(button).attr('id');
  $("div#" + id_reponse + '.divReponseLigneModal').remove();
  $("div#" + id_reponse + '.divReponseLignePanel').remove();
  projet.removeReponse(id_reponse);

  //Update des affichages des questions
  $.each($(".divQuestion"), function(i, div){
    var reponsesDiv = $(div).children(".reponseDiv");
    $(reponsesDiv).find("li#" + id_reponse).remove();
  });
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
  var text_reponse = $("label#" + id_reponse + ".reponseNameLabel").text();

  playTTS(text_reponse)
}
