/**
 * @Date:   2018-11-23T11:47:00+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-04T21:15:05+01:00
 */


var projet = new ProjetQCM();

$(document).ready(function() {
  $("#play-sound-div").hide();

  //Ajout d'une nouvelle question
  $("#addNewQuesBtnId").click(function() {
    //On verifie si le texte de la question n'est pas vide
    if ($('#newQuestionText').val() === ""){
      $("#alertQuestionVideError").show();
      return; // si le champ est vide on sort
    }
    $("#alertQuestionVideError").hide();
    $("#alertQuestionExistError").hide();


    //On cache le bouton car un QCM ne contient qu'une seule question
    $("#addNewQuesBtnId").hide();

    //Creation de la question dans le projet
    let nouvques = new QuestionQCM($('#newQuestionText').val(), [], $("#qrColor").val());
    projet.setQuestion(nouvques);

    addQuestionLine(nouvques);

    $('#newQuestionText').val("");
    return true;
  });


  $("#addNewRep").click(function(e){
    e.preventDefault();
    $("#messageReponseSansQuestionError").hide();
    $("#messageReponseVideError").hide();
    $("#messageRetourVocalVideError").hide();
    $("#messageReponseExistError").hide();
    $("#messageReponseMaxError").hide();

    //On verifie qu'il y a une question de créée
    if (projet.getQuestion() == null) {
      $("#messageReponseSansQuestionError").show();
      return false;
    }

    //On verifie la condition "4 reponses maximum"
    if(projet.getReponses().length >= 4) {
      $("#messageReponseMaxError").show();
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

    let isAnswer = false;
    if($("#isBonneRepCheckBox").is(":checked")) {
      isAnswer = true;
    }

    var new_rep = new ReponseQCM($('#newReponseText').val(),isAnswer,$("#qrColor").val());
    var new_rep_vocal = $('#newReponseVocalText').val();

    //sortir de la fonction si la reponse existe déjà pour la question
    let existe = false;
    $.each(projet.getReponses(), function(i, val) {
      if (projet.getReponseById(val.getId()).getName() === $('#newReponseText').val()) {
        existe = true;
        return;
      }
    });
    if (existe){
      $("#messageReponseExistError").show();
      return false;
    }

    //Ajouter au projet et à la question la nouvelle réponse
    projet.addReponse(new_rep);
    projet.getQuestion().addReponse(new_rep.getId(), new_rep_vocal);


    addReponseLine(new_rep);

/*
    console.log(projet.getQuestion());
    console.log("--------------------");
    console.log(projet.getReponses());
    console.log("--------------------");
    console.log(projet.getQuestion().getReponses());
*/

    //Suppression des données dans les champs de tests pour ecrire une nouvelle reponses
    $('#newReponseText').val('');
    $('#newReponseVocalText').val('');

    return true;
  });

  /*Permet d'exporter un Projet
  On enregistre la questions et les réponses du projet dans le répertoire sélectionné
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

      //On enregistre la question
      let div = document.createElement('div');
      facade.genererQRCode(div, projet.getQuestion());
      saveQRCodeImage(div, projet.getQuestion(), dir_path);


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
    projet = new ProjetQCM();
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

          //importQCM est un callback, il s'agit de la méthode appliquée
          //par la façade sur le qrcode importé
          //(cf méthode importQCM)
          facade.importQRCode(blob, importQCM);
        }
        xhr.send();
      });
    });
    $("#saveQRCode").attr('disabled', false);
  });

  //Changement couleur
  $("#qrColor").on('change', function(){
    var color = $(this).val();

    projet.getQuestion().setColor(color);

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
  "<button class='btn btn-outline-success float-right' id='" + question.getId() + "' onclick='previewQRCodeQuestion()' onmouseover='afficheInfoBtnQrCode(this,\"question\")' onmouseout='supprimeInfoBtnQrCode(this,\"question\")'><i class='fa fa-qrcode'></i></button>" +
  "<button class='btn btn-outline-success float-right' id='" + question.getId() + "' onclick='lireQuestion(this);'><i class='fa fa-play'></i></button>"  +
  "<div class='alert alert-success fade show float' role='alert' id='infoGenererQrCodeQuestion' style='display:none;font-size:14px;'>Ce bouton permet de pré-visualiser le Qr Code de la question</div>" +
  "</div>" +
  "<label class='control-label'>Réponse(s)</label>" +
  "<div class='reponseDiv' id='" + question.getId() + "'>" +
  "</div>" +
  "</div>";

  $("#questionsDivLabelsId").append(newQuestLine);
}

//Ajout de la reponse dans le div d'une question
function addReponseLine(reponse){
  var infos_rep = projet.getQuestion().getReponseById(reponse.getId());

  var newRepLine = "<div style='height:35px;' id='" + reponse.getId() + "'>" +
  "<li style='color:black;font-size:14px;'>" +
  "<label>" + reponse.getName() + "&nbsp&nbsp</label>" +
  "<em style='color:gray'>" + infos_rep.message + "</em>" +
  "<button class='btn btn-outline-success float-right' id='" + reponse.getId() + "' onclick='deleteReponse(this);'><i class='fa fa-trash-alt'></i></button>" +
  "<button class='btn btn-outline-success float-right' id='" + reponse.getId() + "' onclick='previewQRCodeReponse(this)' onmouseover='afficheInfoBtnQrCode(this,\"reponse\")' onmouseout='supprimeInfoBtnQrCode(this,\"reponse\")'><i class='fa fa-qrcode'></i></button>" +
  "<button class='btn btn-outline-success float-right' id='" + reponse.getId() + "' onclick='lireReponse(this);'><i class='fa fa-play'></i></button>" +
  "<div class='alert alert-success fade show float' role='alert' id='infoGenererQrCodeReponse" + reponse.getId() +"' style='display:none;font-size:15px;'>Ce bouton permet de pré-visualiser le Qr Code de la réponse</div>" +
  "</li>" +
  "</div>";

  $("div#" + projet.getQuestion().getId() + " .reponseDiv").append(newRepLine);
}


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



//Supprimer une question du projet
function deleteQuestion(button){
  var id_question = $(button).attr('id');
  $("div#" + id_question + '.divQuestion').remove();

  projet.removeQuestion(JSON.parse(id_question));

  //On peut ré-afficher le bouton pour ajouter une question
  $("#addNewQuesBtnId").show();

  //On cache les erreurs des réponses si elles sont présentes
  $("#messageReponseSansQuestionError").hide();
  $("#messageReponseVideError").hide();
  $("#messageRetourVocalVideError").hide();
  $("#messageReponseExistError").hide();
  $("#messageReponseMaxError").hide();
}

//Supprimer une réponse du projet
function deleteReponse(button){
  var id_reponse = $(button).attr('id');

  projet.removeReponse(id_reponse);
  $("div#" + id_reponse).remove();

  $("#messageReponseMaxError").hide();
}

//Méthode appelée lors de l'import d'un qrcode QCM
//Permet d'ajouter au projet les qrcodes importés
function importQCM(qrcode){
  if(qrcode.getType()==='questionQCM'){
    // Si la qr code est la question, on l'ajoute au projet, on l'affiche et on cache le bouton d'ajout d'une nouvelle question
    projet.setQuestion(qrcode);
    addQuestionLine(qrcode);

    $("#addNewQuesBtnId").hide();
  }
  else if (qrcode.getType()==='reponseQCM') {

    // Si le qr code est une reponse, on l'ajoute au projet
    projet.addReponse(qrcode);

    var infos_rep = projet.getQuestion().getReponseById(qrcode.getId());
    if(infos_rep !== null) {
      // On ajoute la reponse a la question et on affiche la reponse
      addReponseLine(qrcode, infos_rep.message);
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

function lireQuestion(button){
  var id_question = $(button).attr('id');
  var text_question = $("label#" + id_question + ".questionNameLabel").text();

  playTTS(text_question);
}

function lireReponse(button){
  var id_reponse = $(button).attr('id');
  var text_reponse = $("div#" + id_reponse + " label").text();
  var text_retourVocal = $("div#" + id_reponse + " em").text();

  playTTS(text_reponse + text_retourVocal);
}
