
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

function genererJsonQCM(){
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

  // On génére le QrCode a afficher
  previewQRCodeQCM();
  // On affiche le qrCode
  $('#qrView').show();

}

function previewQRCodeQCM() {
  previewQRCode(questionQCM, $('#qrView')[0]);
}


var questionOuverte;

function genererJsonQuestionOuverte(){

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

// Ajouter une nouvelle Reponse une fois qu'on va clicker sur la button Ajouterreponse

var compteurReponse = 1;
$("#ajouterQuestion").click(function () {
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
                          <div class="form-group col-md-6">
                                 <input type="text" class="form-control col-sm-6" id="reponse`+ compteurReponse + `" rows="2" name="nomprojet"
                                placeholder="Réponse" />
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
});

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
  })


function viderChamps(){
  document.getElementById("Question").value="";
  document.getElementById("Bonnereponse").value="";
  document.getElementById("MessageBonnereponse").value="";
  document.getElementById("MessageMauvaisereponse").value="";
  document.getElementById("reponseinitiale").value="";
  document.getElementById("QuestionQCM").value="";
  $('#reponseParIdentifiant').prop('checked', false);
  $('#gridCheck1').prop('checked', false);
  document.getElementById("MessageBonnereponseQCM").value="";
  document.getElementById("MessageMauvaisereponseQCM").value="";
  
  $("#repContainer").empty();

  compteurReponse = 1; 
}
