
function genererJson() {
  // Si le champs "QuestionQCM" est rempli, nous sommes dans l'onglet QCM
  // Sinon, nous sommes dans l'onglet QuestionOuverte
  if($("#QuestionQCM").val() != "") {
    genererJsonQCM();
  } else {
    genererJsonQuestionOuverte();
  }
}

var questionQCM;
var questionOuverte;

function genererJsonQCM(){
  questionOuverte = null;
  var questionText = $("#QuestionQCM").val();
  var reponseParIdentifiant = $("#reponseParIdentifiant").is(':checked');
  var messageBonneReponse = $("#MessageBonnereponseQCM").val();
  var messageMauvaiseReponse = $("#MessageMauvaisereponseQCM").val();

  var reponses = [];
  // Ajout de la réponse 1 
  var controlLabel1 = "réponse numéro 1";
  var isGoodAnswer1 = $("#divQuestion1 #gridCheck1").is(':checked');
  var responseText1 = $("#divQuestion1 #reponseinitiale").val();
  let reponse1 = new ReponseVocale(controlLabel1, isGoodAnswer1, responseText1);
  reponses.push([reponse1.getNumeroEnigme(), reponse1.getEstBonneReponse(), reponse1.getTextQuestion()]);

  // Ajout des autres réponses
  $("#repContainer .form-row").each(function(index){
    console.log(index);
    var controlLabel = "réponse numéro ".concat(index + 2);
    var isGoodAnswer = $(this).find("#gridCheck".concat(index + 2)).is(':checked');
    var responseText = $(this).find("#reponse".concat(index + 2)).val();
    let reponse = new ReponseVocale(controlLabel, isGoodAnswer, responseText);
    reponses.push([reponse.getNumeroEnigme(), reponse.getEstBonneReponse(), reponse.getTextQuestion()]);
  });

  questionQCM = new QRCodeQCM(questionText, reponses, reponseParIdentifiant, messageBonneReponse, messageMauvaiseReponse);

  console.log(questionQCM.qrcode);
  questionQCMQRCode = questionQCM.qrcode
  // On génére le QrCode a afficher
  previewQRCodeQCM();
  // On affiche le qrCode
  $('#qrView').show();

}

function previewQRCodeQCM() {
  previewQRCode(questionQCM, $('#qrView')[0]);
}

function genererJsonQuestionOuverte(){
  questionQCM = null;
  var questionText = $("#Question").val();
  var reponseText = $("#Bonnereponse").val();
  var messageBonneReponse = $("#MessageBonnereponse").val();
  var messageMauvaiseReponse = $("#MessageMauvaisereponse").val();

  questionOuverte = new QRCodeQuestionOuverte(questionText, reponseText, messageBonneReponse, messageMauvaiseReponse);

  console.log(questionOuverte.qrcode);

  // On génére le QrCode a afficher
  previewQRCodeQuestionOuverte();
  // On affiche le qrCode
  $('#qrView').show();

}

function previewQRCodeQuestionOuverte() {
  previewQRCode(questionOuverte, $('#qrView')[0]);
}

// generate and print qr code
function previewQRCode(qrcode, div) {
  let facade = new FacadeController();
  facade.genererQRCode(div, qrcode);
}



var projet = new Projet();


$(document).ready(function() {

  //méthode gérant la continuité
  enregistrement();

  // Ajouter une nouvelle Reponse une fois qu'on va clicker sur la button Ajouterreponse
  $("#ajouterQuestion").click(function () {
    Ajouternouvellereponse();

  })
});

//function Ajouter une nouvelle Reponse
var compteurReponse = 1;
function Ajouternouvellereponse(reponse){
  compteurReponse++;
  if (compteurReponse < 30) {
    type = "Rreponse";
    let reponse = document.createElement('div');
    reponse.innerHTML = `<div class="form-row" id="divQuestion` + compteurReponse + `">
                            <div class="form-group col-md-3">
                                  <label class="control-label">Réponse `+ compteurReponse + ` :</label>
                                </div>
                         <div class="form-group col-md-2">
                                   <input class="form-check-input" type="checkbox" name="gridRadios" id="gridCheck`+ compteurReponse + `" style="width:70px;" 
                                      value="option"` + compteurReponse + `" >
                                      <label class="form-check-label" for="gridCheck`+ compteurReponse + `">
                            </div>
                              <div class="form-group col-md-1">
                                  <button id="deleteQRCode`+ compteurReponse + `" type="button"
                                      class="btn btn-outline-success align-self-center" onclick="supprLigne(` + compteurReponse + ",\'" + type + `\');">
                                      <i class="fa fa-trash"></i></button>
                                      </div>
                              </div>`;

      let container = $("#repContainer");
      container.append(reponse);
    }

}

//Pour supprimer une énigme ou bien une réponse 
function supprLigne(idLigne, element) {
  if (element == "Rreponse") {
    compteurReponse--;
    $("#divQuestion" + idLigne).on('click', function() {
      $(this).remove();
      for(let cpt = idLigne; cpt <= compteurReponse; cpt++) {
        let id = cpt+1;
        let div = $("#divQuestion" + id)[0].getElementsByTagName("div");
        div[0].getElementsByTagName("label")[0].innerHTML = "Réponse " + cpt + " :";
        div[1].getElementsByTagName("input")[0].id = "gridCheck" + cpt;
        div[1].getElementsByTagName("label")[0].for = "gridCheck" + cpt;
        div[2].getElementsByTagName("input")[0].id = "reponse" + cpt;
        div[3].getElementsByTagName("button")[0].id = "deleteQRCode" + cpt;
        div[3].getElementsByTagName("button")[0].setAttribute("onclick", "supprLigne(" + cpt + ",\'" + element +"\')");
        $("#divQuestion" + id)[0].id = "divQuestion" + cpt;
      }
    });
  }
}

$(document).ready(function() {
  $('div.info-content').css('display', 'none');

  $("a.nav-link").click(e => {
    e.preventDefault();
    let element = e.target;
    let tab = $(element).attr('href');

    $('a').attr('class', 'nav-item nav-link');
    $('div.tab-pane').attr('class', 'tab-pane');

    $(element).addClass('active');
    $(tab).addClass('active');
  });

  $('.tab-content').find('a').click(e => {
    let href = $(e.target).attr('href');
    let display = $(href).css('display');

    if (display == 'block')
      $(href).fadeOut();
    else
      $(href).fadeIn();
  });
});

//script 
$("#emptyFields").click(function(){
    viderChamps();
  });

  $("#saveQRCode").click(e => {
    saveQRCodeImage(questionQCM, questionOuverte);
  });


function viderChamps(){
  $('#Question').val('');
  $('#Bonnereponse').val('');
  $('#MessageBonnereponse').val('');
  $('#MessageMauvaisereponse').val('');
  $('#reponseinitiale').val('');
  $('#QuestionQCM').val('');
  if($("#checkboxQR").is(':checked') == true){
    console.log("couco");
    $('#checkboxQR').prop('checked', false);
    console.log("dd")
  }
  $('#gridCheck1').prop('checked', false);
  $('#MessageMauvaisereponseQCM').val('');
  $('#MessageBonnereponseQCM').val('');
  //$("#repContainer").empty();
  $("#repContainer").hide();

  deleteStore(`Question`);

  deleteStore(`Bonnereponse`);

  deleteStore('MessageBonnereponse');

  deleteStore('MessageMauvaisereponse');

  deleteStore(`reponseinitiale`);

  deleteStore(`QuestionQCM`);

  deleteStore(`MessageMauvaisereponseQCM`);

  deleteStore('MessageBonnereponseQCM');

  compteurReponse = 1; 
}

// save image qr code
function saveQRCodeImage(questionQCM, questionOuverte) {
  const fs = require('fs');

  let img = $('#qrView img')[0].src;
var qrcode
  var data = img.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
  if(questionQCM != null){
    qrcode = questionQCM;
  }
  else if (questionOuverte != null){
    qrcode = questionOuverte
  }
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  console.log(data);
  xhr.open('GET', data, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == xhr.DONE) {
      var filesaver = require('file-saver');
      console.log(xhr.response);
      //Dans les deux cas filsaver.saveAs renvoie rien qui s'apparente à un bolléen
      if (filesaver.saveAs(xhr.response, qrcode.getName() + '.jpeg') == true) {
        console.log(filesaver.saveAs(xhr.response, qrcode.getName() + '.jpeg').getName);
        messageInfos("Le QR code a bien été enregistré", "success"); //message a afficher en haut de la page
      }

    }
  }
  xhr.send();
}






//test1
/*document.getElementById("Question").value = getSavedValue("Question");    // set the value to this input
document.getElementById("Bonnereponse").value = getSavedValue("Bonnereponse");   // set the value to this input
document.getElementById("MessageBonnereponse").value = getSavedValue("MessageBonnereponse");    // set the value to this input
document.getElementById("MessageMauvaisereponse").value = getSavedValue("MessageMauvaisereponse");   // set the value to this input
    var checkbox = document.getElementById('checkboxQR');
    localStorage.setItem('checkboxQR', checkbox.checked); 

function load(){    
    var checked = JSON.parse(localStorage.getItem('checkboxQR'));
    document.getElementById("checkboxQR").checked = checked;
    console.log('zzzz');
}
load();
function saveValue(e){
         var id = e.id;  
         var val = e.value; 
         localStorage.setItem(id, val);
}

        
function getSavedValue  (v){

  if (!localStorage.getItem(v)) {
     return "";
     }
     return localStorage.getItem(v);
}
*/



function enregistrement(){

  if(store.get(`Question`))
    $("#Question").val(store.get(`Question`));
  
//Question = store.get(`Question`);

  if(store.get(`Bonnereponse`) )
    $("#Bonnereponse").val(store.get(`Bonnereponse`));

  if(store.get(`MessageBonnereponse`) )
    $("#MessageBonnereponse").val(store.get(`MessageBonnereponse`));

  if(store.get('MessageMauvaisereponse'))
    $("#MessageMauvaisereponse").val(store.get('MessageMauvaisereponse'));

  if(store.get('QuestionQCM'))
    $("#QuestionQCM").val(store.get('QuestionQCM'));

  if(store.get('MessageMauvaisereponseQCM'))
    $("#MessageMauvaisereponseQCM").val(store.get('MessageMauvaisereponseQCM'));

  if(store.get('MessageBonnereponseQCM'))
    $("#MessageBonnereponseQCM").val(store.get('MessageBonnereponseQCM'));

  if(store.get('reponseinitiale'))
    $("#reponseinitiale").val(store.get('reponseinitiale'));

  /*for(var i = 1; i<compteurReponse+1; i++){
    if(store.get('reponse'+i)){
      console.log('zakkk')
      $("#reposne"+i).val(store.get('reponse'+i));

    }
  }

   for(var i = 1; i<numReponse+1; i++){
    if(store.get('reponse'+i)){


      var new_rep = new QCM(store.get('reponse'+i),store.get('data'+i), store.get('reponseColor'+i)); // cretation d'une nouvelle reponse
      new_rep.setId(store.get('reponseId'+i));
      projet.addReponse(new_rep);

      projet.getQuestion().addReponse(new_rep.getId(), new_rep.getData());
      addReponseLine(new_rep);

    }
  }*/


}



function activerSave(text){
  deleteStore(text);

  var newText = $("#"+text).val();
  store.set(text,newText);
}

function deleteStore(del){
  if(store.get(del) )
    store.delete(del);
}

