
var question;

function genererJson(){
  var questionText = $("#projectId").val();
  var isLetter = $("#label2").is(':checked');
  var messageBonneReponse = $("#bonneReponse").val();
  var messageMauvaiseReponse = $("#mauvaiseReponse").val();

  var reponses = [];
  $("#repContainer .form-row").each(function(){
    var controlLabel = $(this).find(".control-label").html();
    var isGoodAnswer = $(this).find(".isGoodAnswer").is(':checked');
    var responseText = $(this).find(".textReponse").val();
    let reponse = new ReponseVocale(controlLabel, isGoodAnswer, responseText);
    reponses.push([reponse.getNumeroEnigme(), reponse.getEstBonneReponse(), reponse.getTextQuestion()]);
  });

  question = new QRCodeQCM(questionText, reponses, isLetter, messageBonneReponse, messageMauvaiseReponse);

  console.log(question.qrcode);

   // On génére le QrCode a afficher
 previewQRCodeQuestion();
 // On affiche le qrCode
 $('#qrView').show();

}

function previewQRCodeQuestion() {
  previewQRCode(question, $('#qrView')[0]);
}

// generate and print qr code
function previewQRCode(qrcode, div) {
  let facade = new FacadeController();
  facade.genererQRCode(div, qrcode);
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
 previewQRCodeQuestion();
 // On affiche le qrCode
 $('#qrView').show();

}

function previewQRCodeQuestion() {
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
                                   <input class="form-check-input" type="checkbox" name="gridRadios" id="gridCheck`+ compteurReponse + `" style="width:70px;" value="option"` + compteurReponse + ` >
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
        div[2].getElementsByTagName("input")[0].id = "projectId" + cpt;
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


/*function myFunction() {
  document.getElementById("formulaireQCM").reset();
}*/

/*function viderZone(){
  controllerMultiple = new ControllerMultiple();
  $('#Question').val('');
  $('#Bonnereponse').val('');
  $('#MessageBonnereponse').val('');
  $('#MessageMauvaisereponse').val('');
  console.log("zaki");

}*/

function viderChamps(){
  document.getElementById("Question").value="";
  document.getElementById("Bonnereponse").value="";
  document.getElementById("MessageBonnereponse").value="";
  document.getElementById("MessageMauvaisereponse").value="";
  document.getElementById("reponseinitiale").value="";
  document.getElementById("QuestionQCM").value="";
  if($("#checkboxQR").is(':checked') == true){
    console.log("couco");
    $('#checkboxQR').prop('checked', false);
    console.log("dd")
  }
  $('#gridCheck1').prop('checked', false);
  document.getElementById("MessageBonnereponseQCM").value="";
  document.getElementById("MessageMauvaisereponseQCM").value="";
  console.log(compteurReponse);
   /*document.getElementById("reponse2").value="";

  for(var i =0; i < compteurReponse; i++){
      document.getElementById(`reponse${i}`).value="";
    }*/
    $("#repContainer").empty();

   compteurReponse = 1; 


}
