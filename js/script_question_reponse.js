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
  var settings = require("electron-settings");

  if (settings.has("defaultColor")) {
    $("#qrColor").val(settings.get("defaultColor"));
  }

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
    //Ajouter au tableau la nouvelle valeur
    projet.addReponse(new Reponse($('#reponseTextAreaId').val(), $("#qrColor").val()));

    //fermer la pop-up
    $("#newReponseModalId .close").click();
    $("#messageReponseModalError").hide();
    updateReponses();

    return true;
  });

  //cet evenement permet l'affectation d'une reponse a la question selectionnée
  $("#chooseReponseBtnId").click(function() {
    for (let ques_item of projet.getQuestions()) {
      if (ques_item.getName() === $("#questionsId option:selected").text()) {
        for (let rep_itemUid of ques_item.getReponsesUIDs()) {
          if (rep_itemUid === $("#reponsesChooseSelectId option:selected").val()) {
            return;
          }
        }
        ques_item.addReponse($("#reponsesChooseSelectId option:selected").val());
        break;
      }
    }

    updateReponses();
    $("#chooseReponseModalId .close").click();
  });


  //Evenement quand la liste deroulante de la question change
  $("#questionsId").change(function() {
    updateReponses();
  });

  //Previsualiser le QRcode Question
  $("#previwQuesQRCodeId").click(function() {
    for (let ques_item of projet.getQuestions()) {
      console.log(JSON.parse($("#questionsId").val()));
      console.log(ques_item.getId());
      if (JSON.parse($("#questionsId").val()) == ques_item.getId()) {
        previewQRCode(ques_item, $('#qrView')[0], "type_question");
        break;
      }
    }
  });

  /* Methode qui genere un dossier avec un fichier json comportant tous les informations
   sur les questions et reponse du projets ainsi que les qrcodes de ces questions_reponses*/
  $("#saveQRCode").click(function() {
    var dir_path = dialog.showOpenDialog({title: 'Sélectionnez un dossier', properties: ['openDirectory']});
    if(dir_path !== undefined){
      var facade = new FacadeController();
      projet.setName($("#projectId").val());
      dir_path += "/" + projet.getName();

      var fs = require('fs');
      if(!fs.existsSync(dir_path)){
        fs.mkdirSync(dir_path);
      }

      $.each(projet.getQuestions(), function(id, question){
        let div = document.createElement('div');
        facade.genererQRCode(div, question);
        saveQRCodeImage(div, question, dir_path);
      });

      $.each(projet.getReponses(), function(id, reponse){
        let div = document.createElement('div');
        facade.genererQRCode(div, reponse);
        saveQRCodeImage(div, reponse, dir_path);
      });
    }
  });

  //Import d'un projet existant
  $('#importProjectBtnId').click(function() {
    var dir_path = dialog.showOpenDialog({title: 'Sélectionnez le projet', properties: ['openDirectory']});
    projet = new Projet();
    var path_split = dir_path[0].split('/');
    projet.projet.nom = path_split[path_split.length-1];
    $("#projectId").val(path_split[path_split.length-1]);

    let facade = new FacadeController();

    var fs = require('fs');

    fs.readdir(dir_path[0], (err, files) => {
      files.forEach(file => {
        var file_path = dir_path + "/" + file;
        let blob = null;
        let xhr = new XMLHttpRequest();
        xhr.open("GET", file_path);
        xhr.responseType = "blob"; //force the HTTP response, response-type header to be blob
        xhr.onload = function() {
          blob = xhr.response; //xhr.response is now a blob object
          facade.importQRCode(blob, importQuestionReponse);
        }
        xhr.send();
      });
    });
  });

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

function updateReponses(){
  var id_question = $("#questionsId option:selected").val();
  var question = null;
  if(id_question !== 'noquest'){
    question = projet.getQuestionById(id_question);
  }

  $("#reponsesDivLabelsId").empty();
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

//Cette fonction sauvegardel'image du qrcode dans un div pour le pouvoir generer apres
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

//Renvoie un Array des valeur d'une liste deroulante
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
