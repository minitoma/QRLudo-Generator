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

  //Clear Question Form
  $("#addNewQuesBtnId").click(function() {
    clearModalForm('newQuestionModalId');
  });

  //Clear Reponse Form
  $("#addNewRepBtnId").click(function() {
    clearModalForm('newReponseModalId');
  });

  //Clear Choose Reponse form then load the combobox with all the reponses in the project.
  $("#addNewChooseRepBtnId").click(function() {
    $("#reponsesChooseSelectId").empty();
    $('#reponsesChooseSelectId').append($('<option>', {
      val: "norep",
      text: "---Selectionner Une Reponse---"
    }));
    $.each(projet.getReponses(), function(i, val) {
      $('#reponsesChooseSelectId').append($('<option>', {
        val: val.getId(),
        text: val.getName()
      }));
    });
  });

  //Ajout d'une nouvelle question
  $("#addQuestionBtnId").click(function() {
    if ($('#questionTextAreaId').val() === "") return false; // si le champ est vide on sort
    //sortir de la fonction si le champ entré existe deja
    let existe = false;
    $('select#questionsId').find('option').each(function() {
      if ($(this).text() === $('#questionTextAreaId').val()) {
        existe = true;
        return;
      }
    });
    if (existe){
      $("#messageQuestionModalError").show();
      return false;
    }

    //Ajouter au projet la nouvelle question
    let nouvques = new Question($('#questionTextAreaId').val(), [], $("#qrColor").val());
    projet.addQuestion(nouvques);

    //Ajouter a la liste deroulante la nouvelle valeur
    $('#questionsId').append($('<option>', {
      val: nouvques.getId(),
      text: $('#questionTextAreaId').val()
    }));
    //fermer la pop-up
    $("#questionsId").val(nouvques.getId()).change();
    $("#messageQuestionModalError").hide();
    $("#newQuestionModalId .close").click();
    return true;
  });

  //Ajout d'une nouvelle reponse
  $("#addReponseBtnId").click(function() {
    if ($('#reponseTextAreaId').val() === "") return false; // si le champ est vide on sort
    //sortir de la fonction si le champ entré existe deja
    let existe = false;
    $.each(projet.getReponses(), function(i, val) {
      if (val.getName() === $('#reponseTextAreaId').val()) {
        existe = true;
        return;
      }
    });
    if (existe){
      $("#messageReponseModalError").show();
      return false;
    }
    //Ajouter au projet la nouvelle réponse
    projet.addReponse(new Reponse($('#reponseTextAreaId').val(), $("#qrColor").val()));

    //fermer la pop-up
    $("#newReponseModalId .close").click();
    $("#messageReponseModalError").hide();

    //On met à jour l'affichage des réponses
    updateReponses();

    return true;
  });

  //Evenement quand la liste deroulante de la question change
  $("#questionsId").change(function() {
    updateReponses();
  });

  //Previsualiser le QRcode Question
  $("#previwQuesQRCodeId").click(function() {
    for (let ques_item of projet.getQuestions()) {
      if (JSON.parse($("#questionsId").val()) == ques_item.getId()) {
        previewQRCode(ques_item, $('#qrView')[0], "type_question");
        break;
      }
    }
  });

  /*Permet d'exporter un Projet
  On enregistre toutes les questions et réponses du projet dans le répertoire sélectionné
  par l'utilisateur*/
  $("#saveQRCode").click(function() {
    //Permet de sélectinner le répertoire où le projet va être enregistré
    var dir_path = dialog.showOpenDialog({title: 'Sélectionnez un dossier', properties: ['openDirectory']});
    if(dir_path !== undefined){
      var facade = new FacadeController();
      projet.setName($("#projectId").val());
      dir_path += "/" + projet.getName();

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
    }
  });

  //Import d'un projet existant à partir d'un répertoire
  $('#importProjectBtnId').click(function() {
    //Permet de sélectionner le répertoire du projet
    var dir_path = dialog.showOpenDialog({title: 'Sélectionnez le projet', properties: ['openDirectory']});
    projet = new Projet();
    var path_split = dir_path[0].split('/');
    //On récupère le nom du projet
    projet.projet.nom = path_split[path_split.length-1];
    $("#projectId").val(path_split[path_split.length-1]);

    let facade = new FacadeController();

    var fs = require('fs');

    //Pour chaque fichier du répertoire
    fs.readdir(dir_path[0], (err, files) => {
      files.forEach(file => {
        var file_path = dir_path + "/" + file;
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
  });

  //Permet de supprimer une question d'un projet
  $("#deleteQuestionBtn").on("click", function(){
    var id_question = $("#questionsId option:selected").val();
    if(id_question !== 'noquest'){
      projet.removeQuestion(JSON.parse(id_question));
      $("#questionsId option:selected").remove();
    }
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

//Méthode appelée lors de l'import d'un qrcode Question/Réponse
//Permet d'ajouter au projet les qrcodes
function importQuestionReponse(qrcode){
  if(qrcode.getType()==='question'){
    projet.addQuestion(qrcode);
    $('#questionsId').append($('<option>', {
        val: qrcode.getId(),
        text: qrcode.getName()
    }));
  }
  else if (qrcode.getType()==='reponse') {
    projet.addReponse(qrcode);
  }

  updateReponses();
}

function toggleEditMessage(totoggle){
  totoggle.parent('div').find("div").toggle();
}

//Permet de mettre à jour l'affichage des réponses en fonction de la question sélectionnée
function updateReponses(){
  //On récupère l'id de la question sélectionnée
  var id_question = $("#questionsId option:selected").val();
  var question = null;

  //Si c'est bien l'i d'une question (noquest est la valeur du message par défaut)
  //alors on récupère la question dans le projet
  if(id_question !== 'noquest'){
    question = projet.getQuestionById(id_question);
  }

  //On vide le div des réponses
  $("#reponsesDivLabelsId").empty();

  //Et pour chaque réponses on crée une nouvelle ligne
  $.each(projet.getReponses(), function(i, val) {

    var str_checked = '';
    var str_message_value = '';
    if(question !== null){
      var rep = question.getReponseById(val.qrcode.id);
      if(rep!==null){
        str_checked = 'checked';
        str_message_value = rep.message;
      }
    }

    var new_reponse_div = "<div class='form-inline'><label class='form-control control-label col-md-6' style='padding-top:10px;'>" + val.getName() + "</label>" +
      "<input class='form-check-input' type='checkbox' id='" + val.getId() + "' onclick='changeReponse($(this))' " + str_checked + "/>" +
      "<button id='" + val.getId() + "' type='button' name='rep[]' class='btn btn-outline-success' onclick='deleteReponse($(this));'><i class='fa fa-trash-alt'></i></button>" +
      "<button type='button' name='previwRepQRCodeName' class='btn btn-outline-success' onclick='previewRep($(this));'><i class='fa fa-qrcode'></i></button>" +
      "<button type='button' name='showEditMessage' class='btn btn-outline-success' onclick='toggleEditMessage($(this));'><i class='fa fa-edit'></i></button>" +
      "<div class='form-inline' id='customMessageDiv' style='display:none;'>" +
        "<input class='form-control control-label col-md-6' type='text' id='" + val.getId() + "' name='message' value='" + str_message_value + "'/>"+
        "<button class='btn btn-outline-success' onclick='setCustomMessage($(this));'><i class='fas fa-check'></i></button>" +
      "</div></div>"
    $("#reponsesDivLabelsId").append(new_reponse_div);
  });
}

//Permet d'ajouter ou de supprimer une réponse à une question
//Cette méthode est appelée lors du changement d'état des checkboxes
function changeReponse(checkbox){
  var id_question = $("#questionsId option:selected").val();
  //si une question est selectionnée
  if(id_question !== 'noquest'){
    for (let ques_item of projet.getQuestions()) {
      if (id_question == ques_item.getId()) {
        id_reponse = JSON.parse($(checkbox).attr('id'));
        if($(checkbox).prop('checked')){
          ques_item.addReponse(id_reponse);
        }
        else{
          ques_item.removeReponse(id_reponse);
        }
      }
    }
  }
}

function setCustomMessage(button){
  var id_question = JSON.parse($("#questionsId option:selected").val());
  if(id_question!=='noquest'){
    for(let question of projet.getQuestions()){
      if(question.qrcode.id === id_question){
        var input_text = button.parent('div').find("input");
        question.setMessage(JSON.parse($(input_text).attr('id')), $(input_text).val());
      }
    }
  }
}

//Cette fonction sauvegarde l'image du qrcode dans un div pour le pouvoir generer apres
function saveQRCodeImage(div, qrcode, directoryName) {
  let img = $(div).children()[0].src;
  let data = img.replace(/^data:image\/\w+;base64,/, '');
  fs.writeFile(`${directoryName}/${qrcode.getName()}.jpeg`, data, {
    encoding: 'base64'
  }, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
}

//Cette Fonction Supprime Une reponse a une question
function deleteReponse(todelete) {
  projet.removeReponse(JSON.parse(todelete.attr('id')));
  updateReponses();
}

function activerSave(){
  if($("#projectId").val().length > 0){
    $("#saveQRCode").attr('disabled', false);
  }
  else{
    $("#saveQRCode").attr('disabled', true);
  }
}

// Previsualiser les reponses
function previewRep(topreview) {
  let rep = projet.getReponsesById(topreview.prev().attr("id"));
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

//Renvoie un Array des valeurs d'une liste deroulante
function selectOptionsValuesAsArray(selectId) {
  let resArray = [];
  $('select#' + selectId).find('option').each(function() {
    resArray.push($(this).val());
  });
  return resArray;
}

//Mettre les champs d'un modal vides
function clearModalForm(modal_id) {
  $('#' + modal_id).find('form')[0].reset();
}
