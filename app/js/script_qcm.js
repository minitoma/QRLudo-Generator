/**
 * @Date:   2018-11-23T11:47:00+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-04T21:15:05+01:00
 */


var projet = new Projet();
var currentQuestion = null;

$(document).ready(function() {
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
    $("#alertQuestionExistError").hide();

    //sortir de la fonction si la question existe déjà
    let existe = false;
    $.each(projet.getQuestions(), function(i,val) {
      if(val.getName() === $('#newQuestionText').val()) {
        existe = true;
        return;
      }
    });
    if(existe) {
      $("#alertQuestionExistError").show();
      return false;
    }

    //Ajouter au projet la nouvelle question
    let nouvques = new Question($('#newQuestionText').val(), [], $("#qrColor").val());
    projet.addQuestion(nouvques);

    addQuestionLine(nouvques);
    currentQuestion = nouvques; //

    $('#newQuestionText').val("");
    return true;
  });


  $("#addNewRep").click(function(e){
    e.preventDefault();
    $("#messageReponseSansQuestionError").hide();
    $("#messageReponseVideError").hide();
    $("#messageRetourVocalVideError").hide();
    $("#messageReponseExistError").hide();

    //On verifie qu'il y a une question de créée
    if (currentQuestion == null) {
      $("#messageReponseSansQuestionError").show();
      return false;
    }

    //On verifie que le texte de la reponse n'est pas vide
    if ($('#newReponseText').val() === ""){
      $("#messageReponseVideError").show();
      return false; // si le champ est vide on sort
    }

    //On verifie que le texte du retour vocal n'est pas vide
    if($('#newReponseVocalText').val() === "") {
      $("#messageRetourVocalVideError").show();
      return false;
    }


    var new_rep = new Reponse($('#newReponseText').val(), $("#qrColor").val());
    var new_rep_vocal = $('#newReponseVocalText').val();

    //sortir de la fonction si la reponse existe déjà pour la question courante
    let existe = false;
    $.each(projet.getReponsesFromQuestion(new_rep.getId(), currentQuestion.getId()), function(i, val) {
      if (projet.getReponseById(val.id).getName() === $('#newReponseText').val()) {
        existe = true;
        return;
      }
    });
    if (existe){
      $("#messageReponseExistError").show();
      return false;
    }

    //Ajouter au projet la nouvelle réponse
    projet.addReponse(new_rep);

    //Ajouter la reponse à la question courante
    currentQuestion.addReponse(new_rep.getId(),new_rep_vocal);

    //addReponseLine(new_rep);
    addReponseLineToQuestionDiv(currentQuestion, new_rep);


    //Suppression des données dans les champs de tests pour ecrire une nouvelle reponses
    $('#newReponseText').val('');
    $('#newReponseVocalText').val('');

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
  console.log("ok");
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
