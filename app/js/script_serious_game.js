var projetSeriousGame = new ProjetSeriousGame();

var audioSource = "";

$("#addAudioIntro").click(function () {
  audioSource = "intro";
});
$("#addAudioFin").click(function () {
  audioSource = "fin";
});
function addAudioQRCode() {
  audioSource = "qrcode";
};

function getMusicFromUrl() {
  let modal = $('#listeMusic').find('div.modal-body.scrollbar-success');
  let loader = document.createElement('div');
  let errorMsg = document.createElement('label');

  const {
    clipboard
  } = require('electron');

  let url = clipboard.readText();
  let xhr = new XMLHttpRequest();

  Music.getDownloadLink(url, link => {
    if (link == null) {
      showError(modal, errorMsg);
      return
    }

    try {
      xhr.open('GET', link, true);
    } catch (e) {
      showError(modal, errorMsg);
    }
    xhr.responseType = 'blob';
    xhr.onload = function (e) {

      if (this.status == 200) {
        let blob = this.response; // get binary data as a response
        let contentType = xhr.getResponseHeader("content-type");
        console.log(contentType);

        if (contentType == 'audio/mpeg' || contentType == 'audio/mp3') {
          // get filename
          let filename = xhr.getResponseHeader("content-disposition").split(";")[1];
          filename = filename.replace('filename="', '');
          filename = filename.replace('.mp3"', '.mp3');

          // save file in folder projet/download
          let fileReader = new FileReader();
          fileReader.onload = function () {
            fs.writeFileSync(`${temp}/Download/${filename}`, Buffer(new Uint8Array(this.result)));

            $(loader, errorMsg).remove();
            $('#closeModalListeMusic').click(); // close modal add music
          };
          fileReader.readAsArrayBuffer(blob);

          ajouterChampSon(filename, link);
        } else {
          showError(modal, errorMsg, "Le fichier n'est pas un fichier audio");
        }
      } else {
        // request failed
        showError(modal, errorMsg);
      }
    };

    xhr.onloadstart = function (e) {
      console.log('load start');
      $(loader).addClass('loader');
      $(modal).find('.errorLoader').remove();
      $(modal).prepend(loader); // show loader when request progress
    };

    xhr.onerror = function (e) {
      showError(modal, errorMsg);
    };

    xhr.send();
  });
}

function ajouterChampSon(nom, url) {
  if (audioSource == "intro") {
    let textArea = document.getElementById("textAreaIntro");
    textArea.value = nom;
    textArea.setAttribute("disabled", "true");
  } else if (audioSource == "fin") {
    let textArea = document.getElementById("textAreaFin");
    textArea.value = nom;
    textArea.setAttribute("disabled", "true");
  }
  else if (audioSource == "qrcode") {
    let text = document.getElementById("questQRCode" + currentEnigme);
    text.value = nom;
    text.setAttribute("disabled", "true");
  }
}

function showError(modal, errorMsg, message = "Veuillez coller un lien de fichier téléchargeable. Reportez vous à la rubrique Info pour plus d'informations.") {
  console.log('error ');
  $(modal).find('.loader').remove();
  $(errorMsg).text(message);
  $(errorMsg).css('color', '#f35b6a');
  $(errorMsg).addClass('errorLoader');
  $(modal).prepend(errorMsg); // add error message
}

$(document).ready(function () {
  //Use to implement information on the audio import
  var info = document.createElement('div'); // balise div : contain html information
  var info_activ = false; // boolean : give the etat of info (up/off)

  //Show the information about the audio file import (help)
  $('button#showInfo').click(e => {
    e.preventDefault();
    if (info_activ == false) {
      info.innerHTML = ``;
      fetch('Views/unique/audioinfo.html').then(function (response) {
        return response.text();
      }).then(function (string) {
        // console.log(string);
        info.innerHTML = string;
      }).catch(function (err) {
        console.log(info.innerHTML);
        info.innerHTML = `Erreur`;
      });
      document.getElementById('elementsAudio').appendChild(info);
      info_activ = true;
    }
    else {
      document.getElementById('elementsAudio').removeChild(info);
      info_activ = false;
    }
    //ipcRenderer.send('showInfoWindow', null);
  });
});

function activerSave() {
  console.log("Activer Save");
}

// Réinitialise les champs du Scénario
function deleteGame() {
  console.log("Delete Game");
}

//Import d'un projet existant à partir d'un répertoire
$('#importProjectBtnId').click(function () {
  //Permet de sélectionner le répertoire du projet
  var dir_path = dialog.showOpenDialog({ title: 'Sélectionnez le projet', properties: ['openDirectory'] })[0];
  projet = new ProjetQCM();
  var path_split = dir_path.split(path.sep);
  //On récupère le nom du projet
  projet.setName(path_split[path_split.length - 1]);
  $("#projectId").val(path_split[path_split.length - 1]);
  store.set("titreQCM", $("#projectId").val());
  $("#reponsesListModal").empty();
  $("#questionsDivLabelsId").empty();

  let facade = new FacadeController();

  var fs = require('fs');


  //Pour chaque fichier du répertoire
  fs.readdir(dir_path, (err, files) => {
    $.each(files, function (i, file) {
      console.log(file);
      var file_path = path.join(dir_path, file);
      let blob = null;
      //On crée une requête xmlhttp pour récupérer le blob du fichier
      let xhr = new XMLHttpRequest();
      xhr.open("GET", file_path);

      xhr.responseType = "blob";
      xhr.onload = function () {
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

//Pour ajouter autant d'énigme que souhaité
var type = "";
var compteurEnigme = 0;
var currentEnigme = 1;
$("#ajouterEnigme").click(function () {
  compteurEnigme++;
  if (compteurEnigme < 30) {
    type = "enigme";
    let reponse = document.createElement('div');
    let popUpQRCode = document.createElement('div');
    let popUpRecVocale = document.createElement('div');
    reponse.innerHTML = `<div class="form-group">
                            <div class="form-inline" class="col-sm-12" id="divEnigme` + compteurEnigme + `">
                              <label class="control-label"
                              style="color:#28a745;padding-top:10px;padding-right:54px;">Énigme `+ compteurEnigme + ` : </label>
                              <input type="text" class="form-control" id="enigme`+ compteurEnigme + `" name="nombreReponse"
                              placeholder="Détails sur l'énigme `+ compteurEnigme + `" onkeyup="activerSave();" />
                              <label class="control-label" style="color:#28a745;padding-top:10px;padding-right:10px; padding-left:20px;">Type d'énigme : </label>
                              <button type="button" id="scanQR`+ compteurEnigme + `" name="ajouterQR` + compteurEnigme + `" data-toggle="modal"
                                  data-target="#popupQRCode` + compteurEnigme + `" class="btn btn-outline-success align-self-center">
                                  <i class="fa fa-qrcode"></i>&nbsp;&nbsp;QR CODE</button>&nbsp;
                              <button id="recVocale`+ compteurEnigme + `" type="button" class="btn btn-outline-success align-self-center"
                                  data-toggle="modal" data-target="#popupRecVocale` + compteurEnigme + `">
                                  <i class="fa fa-microphone"></i>&nbsp;&nbsp;Reconnaissance vocale</button>&nbsp;
                              <button id="deleteEnigme`+ compteurEnigme + `" type="button" onclick="supprLigne(` + compteurEnigme + ",\'" + type + `\');" class="btn btn-outline-success align-self-center">
                                  <i class="fa fa-trash"></i></button>
                              </div>
                          </div>`;

    popUpQRCode.innerHTML = `<div class="modal fade bd-example-modal-lg" id="popupQRCode` + compteurEnigme + `" tabindex="-1" role="dialog" data-backdrop="static"
    aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-keyboard="false">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="dialog" style="max-width: 53% !important">
        <div class="modal-content" style="padding: 20px;">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalCenterTitle">QR Code</h5>
                <button type="button" class="close" id="closeModalQRCode" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="row">
                <div class="col-lg-12 form-inline">
                    <label class="control-label" style="color:#28a745;padding-right:32px;">Question :</label>
                    <input type="text" class="form-control input-lg" style="width:700px;" id="questQRCode` + compteurEnigme + `" cols="10"
                        name="nomprojet" placeholder="Saisissez votre question" onkeyup="activerSave();" />
                    <button type="button" id="addAudioQRCode` + compteurEnigme + `" class="btn btn-outline-success btn-unique-xl  "
                        name="ajouterSon" data-toggle="modal" data-target="#listeMusic" onclick="addAudioQRCode()">
                        <i class="fa fa-music"></i>&nbsp;&nbsp;Audio
                    </button>
                    <button id="deleteAudioQRCode` + compteurEnigme + `" type="button" onclick="deleteAudioQRCode(` + compteurEnigme + `)"
                        class="btn btn-outline-success align-self-center"><i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
            <hr>
            <div class="form-row">
                <div class="form-group col-md-6" id="labelBonneReponse` + compteurEnigme + `">
                    <label>&nbsp;&nbsp;&nbsp;&nbsp;Bonne réponse :</label>
                </div>
            </div>
            <div id="repContainer` + compteurEnigme + `">
                <div class="form-row" id="divQuestion` + compteurEnigme + `1">
                  <div class="form-group col-md-3">
                      <label class="control-label">Réponse 1 :</label>
                  </div>
                  <div class="form-group col-md-2">
                      <input class="form-check-input" type="radio" name="gridRadios` + compteurEnigme + `" id="gridCheck` + compteurEnigme + `1" checked style="width:70px;" value="option1">
                      <label class="form-check-label" for="gridCheck` + compteurEnigme + `1">
                  </div>
                  <div class="form-group col-md-6">
                    <input type="text" class="form-control col-sm-6" id="projectId` + compteurEnigme + `1" rows="2" name="nomprojet"
                    placeholder="Réponse" onkeyup="activerSave();" />
                  </div>
                  <div class="form-group col-md-1">
                    <button id="deleteQRCode` + compteurEnigme + `1" type="button"
                        class="btn btn-outline-success align-self-center" onclick="supprLigne(1,\'qrcode\');">
                        <i class="fa fa-trash"></i></button>
                  </div>
                </div>
              </div>
              <hr>
              <div class="form-group col-md-4">
                    <label for="ajouterQuestion" style="color:#a5b2af;">Ajouter une réponse</label>
                    <button id="ajouterQuestion` + compteurEnigme + `" type="button" class="btn btn-outline-success align-self-center"
                        style="color:#a5b2af;" name="ajouterQuestion" onclick="ajouterQuestions(` + compteurEnigme + `)">
                        <i class="fa fa-plus" aria-hidden="true"></i>
                    </button>
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-outline-success" data-dismiss="modal"
                      id="cancelQRCode` + compteurEnigme + `" onclick="annulerQuestion(` + compteurEnigme + `, \'qrcode\')">Annuler</button>
                  <button type="button" class="btn btn-outline-success" data-dismiss="modal" id="addQRCode` + compteurEnigme + `" onclick="validerQuestion(` + compteurEnigme + `, \'qrcode\')">Valider</button>
              </div>
          </div>
      </div>
  </div>`;

    popUpRecVocale.innerHTML = `<div class="modal fade" id="popupRecVocale` + compteurEnigme + `" tabindex="-1" role="dialog" data-backdrop="static"
    aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-keyboard="false">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="dialog" style="max-width: 40% !important">
        <div class="modal-content" style="padding: 20px;">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalCenterTitle">Reconnaissance Vocale</h5>
                <button type="button" class="close" id="closeModalQRCode" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="form-group">
                <div class="col-lg-12 form-inline">
                    <label class="control-label" style="color:#28a745;padding-right:32px;">Question :</label>
                    <input type="text" class="form-control input-lg" style="width:1450px;" id="questRecVocal` + compteurEnigme + `" cols="10"
                        name="nomprojet" placeholder="Saisissez votre question" onkeyup="activerSave();" />
                </div>
                <hr>
                <div class="col-lg-12 form-inline">
                    <label class="control-label" style="color:#28a745;padding-right:32px;">Réponse :</label>
                    <input type="text" class="form-control input-lg" style="width:1450px;" id="repRecVocal` + compteurEnigme + `" cols="10"
                        name="nomprojet" placeholder="Saisissez votre question" onkeyup="activerSave();" />
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-success" data-dismiss="modal"
                    id="cancelRecVocal` + compteurEnigme + `" onclick="annulerQuestion(` + compteurEnigme + `, \'vocale\')">Annuler</button>
                <button type="button" class="btn btn-outline-success" data-dismiss="modal" id="addRecVocal` + compteurEnigme + `" onclick="validerQuestion(` + compteurEnigme + `, \'vocale\')">Valider</button>
            </div>
        </div>
    </div>
</div>`;
    let container = $("#containerEnigme");
    container.append(reponse);
    container.append(popUpQRCode);
    container.append(popUpRecVocale);
  }
});

//Ajouter autant de réponses que souhaité dans la popup QRCode
var compteurQuestion = 1;
function ajouterQuestions(idEnigme) {
  currentEnigme = idEnigme;
  compteurQuestion = document.getElementById("repContainer" + idEnigme).childElementCount;
  compteurQuestion++;
  if (compteurQuestion < 30) {
    type = "qrcode";
    let reponse = document.createElement('div');
    reponse.setAttribute("class", "form-row");
    reponse.setAttribute("id", "divQuestion" + idEnigme + compteurQuestion);
    reponse.innerHTML = `<div class="form-group col-md-3">
                            <label class="control-label">Réponse `+ compteurQuestion + ` :</label>
                         </div>
                         <div class="form-group col-md-2">
                            <input class="form-check-input" type="radio" name="gridRadios` + idEnigme + `" id="gridCheck` + idEnigme + compteurQuestion + `" style="width:70px;" value="option` + compteurQuestion + `">
                            <label class="form-check-label" for="gridCheck` + idEnigme + compteurQuestion + `">
                          </div>
                          <div class="form-group col-md-6">
                            <input type="text" class="form-control col-sm-6" id="projectId` + idEnigme + compteurQuestion + `" rows="2" name="nomprojet"
                              placeholder="Réponse" onkeyup="activerSave();" />
                          </div>
                          <div class="form-group col-md-1">
                            <button id="deleteQRCode` + idEnigme + compteurQuestion + `" type="button"
                                class="btn btn-outline-success align-self-center" onclick="supprLigne(` + compteurQuestion + ",\'" + type + `\');">
                            <i class="fa fa-trash"></i></button>
                          </div>`;

    let container = $("#repContainer" + idEnigme);
    container.append(reponse);
  }
};

//Pour supprimer une énigme ou bien une réponse des QRCode
function supprLigne(idLigne, element) {
  if (element == "enigme") {
    compteurEnigme--;
    $("#divEnigme" + idLigne).on('click', function () {
      verifEnigmeValide(idLigne);
      $(this).remove();
      for (let cpt = idLigne; cpt <= compteurEnigme; cpt++) {
        let id = cpt + 1;
        let div = $("#divEnigme" + id)[0];
        div.getElementsByTagName("label")[0].innerHTML = "Énigme " + cpt + " :";
        div.getElementsByTagName("input")[0].id = "enigme" + cpt;
        div.getElementsByTagName("input")[0].placeholder = "Détails sur l'énigme " + cpt;
        let boutons = div.getElementsByTagName("button");
        boutons[0].id = "scanQR" + cpt;
        boutons[0].setAttribute("data-target", "#popupQRCode" + cpt);
        boutons[0].name = "ajouterQR" + cpt;
        boutons[1].id = "recVocale" + cpt;
        boutons[1].setAttribute("data-target", "popupRecVocale" + cpt);
        boutons[2].id = "deleteEnigme" + cpt;
        boutons[2].setAttribute("onclick", "supprLigne(" + cpt + ",\'" + element + "\')");
        div.id = "divEnigme" + cpt;
        document.getElementById("popupQRCode" + id).id = "popupQRCode" + cpt;
        document.getElementById("questQRCode" + id).id = "questQRCode" + cpt;
        document.getElementById("addAudioQRCode" + id).id = "addAudioQRCode" + cpt;
        document.getElementById("deleteAudioQRCode" + id).id = "deleteAudioQRCode" + cpt;
        document.getElementById("labelBonneReponse" + id).id = "labelBonneReponse" + cpt;
        for (let i = 1; i <= document.getElementById("repContainer" + id).childElementCount; ++i) {
          document.getElementById("divQuestion" + id + i).id = "divQuestion" + cpt + i;
          document.getElementById("gridCheck" + id + i).name = "gridRadios" + cpt;
          document.getElementById("gridCheck" + id + i).id = "gridCheck" + cpt + i;
          document.getElementById("projectId" + id + i).id = "projectId" + cpt + i;
          document.getElementById("deleteQRCode" + id + i).setAttribute("onclick", "supprLigne(" + cpt + ",\'qrcode\')");
          document.getElementById("deleteQRCode" + id + i).id = "deleteQRCode" + cpt + i;
        }
        document.getElementById("ajouterQuestion" + id).setAttribute("onclick", "ajouterQuestions(" + cpt + ")");
        document.getElementById("ajouterQuestion" + id).id = "ajouterQuestion" + cpt;
        document.getElementById("cancelQRCode" + id).setAttribute("onclick", "annulerQuestion(" + cpt + ",\'qrcode\')");
        document.getElementById("cancelQRCode" + id).id = "cancelQRCode" + cpt;
        document.getElementById("addQRCode" + id).setAttribute("onclick", "validerQuestion(" + cpt + ",\'qrcode\')");
        document.getElementById("addQRCode" + id).id = "addQRCode" + cpt;
        document.getElementById("repContainer" + id).id = "repContainer" + cpt;
        document.getElementById("popupRecVocale" + id).id = "popupRecVocale" + cpt;
        document.getElementById("questRecVocal" + id).id = "questRecVocal" + cpt;
        document.getElementById("repRecVocal" + id).id = "repRecVocal" + cpt;
        document.getElementById("cancelRecVocal" + id).setAttribute("onclick", "annulerQuestion(" + cpt + ",\'qrcode\')");
        document.getElementById("cancelRecVocal" + id).id = "cancelRecVocal" + cpt;
        document.getElementById("addRecVocal" + id).setAttribute("onclick", "validerQuestion(" + cpt + ",\'qrcode\')");
        document.getElementById("addRecVocal" + id).id = "addRecVocal" + cpt;
        //for(let i = 0; i < questionsQR.length; ++i){
        for (let i = 0; i < projetSeriousGame.getQuestionsQr().length; ++i) {
          if (projetSeriousGame.getQuestionsQr()[i].id == id) {
            projetSeriousGame.getQuestionsQr()[i].id = cpt;
          }
        }
        for (let i = 0; i < projetSeriousGame.getQuestionsReco().length; ++i) {
          if (projetSeriousGame.getQuestionsReco()[i].id == id) {
            projetSeriousGame.getQuestionsReco()[i].id = cpt;
          }
        }
      }
    });
  } else if (element == "qrcode") {
    compteurQuestion--;
    $("#divQuestion" + currentEnigme + idLigne).on('click', function () {
      $(this).remove();
      for (let cpt = idLigne; cpt <= compteurQuestion; cpt++) {
        let id = cpt + 1;
        let div = $("#divQuestion" + currentEnigme + id)[0].getElementsByTagName("div");
        div[0].getElementsByTagName("label")[0].innerHTML = "Réponse " + cpt + " :";
        div[1].getElementsByTagName("input")[0].id = "gridCheck" + currentEnigme + cpt;
        div[1].getElementsByTagName("label")[0].for = "gridCheck" + currentEnigme + cpt;
        div[2].getElementsByTagName("input")[0].id = "projectId" + currentEnigme + cpt;
        div[3].getElementsByTagName("button")[0].id = "deleteQRCode" + currentEnigme + cpt;
        div[3].getElementsByTagName("button")[0].setAttribute("onclick", "supprLigne(" + cpt + ",\'" + element + "\')");
        $("#divQuestion" + currentEnigme + id)[0].id = "divQuestion" + currentEnigme + cpt;
      }
    });
  }
}

function annulerQuestion(idEnigme, type) {
  if (type == "qrcode") {
    let nbQuestions = document.getElementById("repContainer" + idEnigme).childElementCount;
    for (let i = 2; i <= nbQuestions; ++i) {
      let reponse = document.getElementById("divQuestion" + idEnigme + i);
      reponse.remove();
    }
    let reponse = document.getElementById("divQuestion" + idEnigme + "1").getElementsByTagName('div');
    reponse[2].getElementsByTagName('input')[0].value = "";
    let question = document.getElementById("questQRCode" + idEnigme);
    question.disabled = false;
    question.value = "";
  }
  else if (type == "vocale") {
    document.getElementById("questRecVocal" + idEnigme).value = "";
    document.getElementById("repRecVocal" + idEnigme).value = "";
  }
}

var questionsQR = new Array();
var questionsRec = new Array();

function validerQuestion(idEnigme, type) {
  if (type == "qrcode") {
    let textQuestion = document.getElementById("questQRCode" + idEnigme).value;
    let tabReponses = new Array();
    let estBonneReponse = 1;
    let nbReponses = document.getElementById("repContainer" + idEnigme).childElementCount;
    for (let i = 1; i <= nbReponses; ++i) {
      let divs = document.getElementById("divQuestion" + idEnigme + i).getElementsByTagName('div');
      let reponse = divs[2].getElementsByTagName('input')[0].value;
      tabReponses.push(reponse);
      if (divs[1].getElementsByTagName('input')[0].checked == true) {
        estBonneReponse = i;
      }
    }
    projetSeriousGame.getQuestionsQr().push(new QRCodeQuestion(textQuestion, tabReponses, estBonneReponse, idEnigme));
    console.log(projetSeriousGame.getQuestionsQr());
  }
  else if (type == "vocale") {
    let textQuestion = document.getElementById("questRecVocal" + idEnigme).value;
    let textReponse = document.getElementById("repRecVocal" + idEnigme).value;
    projetSeriousGame.getQuestionsReco().push(new RecVocaleQuestion(textQuestion, textReponse, idEnigme));
    console.log(projetSeriousGame.getQuestionsReco());
  }

  annulerQuestion(idEnigme, type);
}

function verifEnigmeValide(idEnigme) {
  for (let i = 0; i < projetSeriousGame.getQuestionsQr().length; ++i) {
    if (projetSeriousGame.getQuestionsQr()[i].idQR == idEnigme) {
      projetSeriousGame.getQuestionsQr().splice(i, i + 1);
      return;
    }
  }
  for (let i = 0; i < projetSeriousGame.getQuestionsReco().length; ++i) {
    if (projetSeriousGame.getQuestionsReco()[i].idRec == idEnigme) {
      projetSeriousGame.getQuestionsReco().splice(i, i + 1);
      return;
    }
  }
}

$("#deleteAudioIntro").click(function () {
  document.getElementById('textAreaIntro').value = "";
  $("#textAreaIntro").prop('disabled', false);
});

$("#deleteAudioFin").click(function () {
  document.getElementById('textAreaFin').value = "";
  $("#textAreaFin").prop('disabled', false);
});

function deleteAudioQRCode(idEnigme) {
  document.getElementById('questQRCode' + idEnigme).value = "";
  $("#questQRCode" + idEnigme).prop('disabled', false);
}

// Appeler lorsqu'on click sur Générer
$("#generateSG").on("click", function () {
  // On génère le qrcodeSeriousGame
  genereJsonSeriousGame();
  // On génére le QrCode a afficher
  previewQRCodeQuestion();
  console.log("Preview faite")
  // On affiche le qrCode
  $('#qrView').show();
});
/* On générère le QRCodeSeriousGame en récupérant les valeurs des champs la page html et des question QRCOde et Reco qui ont été stockées dans le projetSeriousGame
 * 
 */
function genereJsonSeriousGame() {
  console.log("Generating Json Serious Game");
  // On extrait les valeurs des champs utiles du html
  let nomSeriousGame = $("#projectId").val();
  // On affecte le nom du seriousGame au nom du projet
  projetSeriousGame.setName(nomSeriousGame);
  let textIntro = $("#textAreaIntro").val();
  let textFin = $("#textAreaFin").val();
  let qrColor = $('#qrColor').val();

  let enigmes = [];
  // On rempli le tableau d'enigme à partir les tableaux de questions QR et RecoVocale
  for (let i = 0; i < projetSeriousGame.getQuestionsQr().length; i++) {
    let detailEnigme = $("#enigme" + projetSeriousGame.getQuestionsQr()[i].idQR).val();
    console.log("Ajout Qrcode");
    console.log(projetSeriousGame.getQuestionsQr()[i]);
    enigmes.push([projetSeriousGame.getQuestionsQr()[i].idQR.toString(), detailEnigme, "questionQRCode"]);
  }
  for (let i = 0; i < projetSeriousGame.getQuestionsReco().length; i++) {
    let detailEnigme = $("#enigme" + projetSeriousGame.getQuestionsReco()[i].idRec).val();
    console.log("Ajout Reco");
    console.log(projetSeriousGame.getQuestionsReco()[i]);
    enigmes.push([projetSeriousGame.getQuestionsReco()[i].idRec.toString(), detailEnigme, "questionRecoVocale"]);
  }

  // On tri le tableau en fonction des id de question
  enigmes.sort(function (a, b) {
    return a[0] > b[0];
  });

  console.log(projetSeriousGame.getQuestionsQr());
  console.log(projetSeriousGame.getQuestionsReco());

  // On crée le Json de SeriousGame avec QRCodeSeriousGame
  let jsonSeriousGame = new QRCodeSeriousGame(nomSeriousGame, textIntro, textFin, enigmes, projetSeriousGame.getQuestionsQrForJson(), projetSeriousGame.getQuestionsRecoForJson(), qrColor);
  projetSeriousGame.setQuestion(jsonSeriousGame);
  console.log(projetSeriousGame.getQuestion());
}

function previewQRCodeQuestion() {
  var question = projetSeriousGame.getQuestion();
  previewQRCode(question, $('#qrView')[0]);
}

// generate and print qr code
function previewQRCode(qrcode, div) {
  let facade = new FacadeController();

  facade.genererQRCode(div, qrcode);
}

/*Permet d'exporter un Projet
 On enregistre la questions et les réponses du projet dans le répertoire sélectionné
 par l'utilisateur*/
$("#saveQRCode").click(function () {
  //Permet de sélectinner le répertoire où le projet va être enregistré
  var dir_path = dialog.showOpenDialog({ title: 'Sélectionnez un dossier', properties: ['openDirectory'] })[0];
  if (dir_path !== undefined) {
    var facade = new FacadeController();
    //projet.setName($("#projectId").val());

    var dir_path = path.join(dir_path, projetSeriousGame.getName());

    var fs = require('fs');
    if (!fs.existsSync(dir_path)) {
      fs.mkdirSync(dir_path);
    }

    //On enregistre la question
    let div = document.createElement('div');
    facade.genererQRCode(div, projetSeriousGame.getQuestion());
    saveQRCodeImage(div, projetSeriousGame.getQuestion(), dir_path);


    // Idem pour les reponses des questions Qrcode
    projetSeriousGame.getReponsesQrCode().forEach(function(reponse){
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

//Cette fonction sauvegarde l'image du qrcode dans un div pour le pouvoir generer apres
function saveQRCodeImage(div, qrcode, directoryName) {
  let img = $(div).children()[0].src;
  //let data = img.replace(/^data:image\/\w+;base64,/, '');
  let matches = img.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  let data = new Buffer(matches[2], 'base64');
  var file_name = qrcode.getName().replace(/[^a-zA-Z0-9]+/g, "") + '.jpeg';
  fs.writeFile(path.join(directoryName, file_name), data, (err) => {
    if (err) {
      $("#questionsDivLabelsId").append("<div>" + err + "</div>");
    }
    console.log('The file has been saved!');
  });
}