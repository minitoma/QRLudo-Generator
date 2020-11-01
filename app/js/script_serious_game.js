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
          showError(modal, errorMsg, "Le fichier n'est pas un fichier audio.");
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
$("#ajouterEnigme").click(function () {
  compteurEnigme++;
  if (compteurEnigme < 30) {
    type = "enigme";
    let reponse = document.createElement('div');
    reponse.innerHTML = `<div class="form-group">
                            <div class="form-inline" class="col-sm-12" id="divEnigme` + compteurEnigme + `">
                              <label class="control-label"
                              style="color:#28a745;padding-top:10px;padding-right:54px;">Énigme `+ compteurEnigme + ` : </label>
                              <input type="text" class="form-control" id="enigme`+ compteurEnigme + `" name="nombreReponse"
                              placeholder="Détails sur l'énigme `+ compteurEnigme + `" onkeyup="activerSave();" />
                              <label class="control-label" style="color:#28a745;padding-top:10px;padding-right:10px; padding-left:20px;">Type d'énigme : </label>
                              <button type="button" id="scanQR`+ compteurEnigme + `" name="ajouterQR` + compteurEnigme + `" data-toggle="modal"
                                  data-target="#popupQRCode" class="btn btn-outline-success align-self-center">
                                  <i class="fa fa-qrcode"></i>&nbsp;&nbsp;QR CODE</button>&nbsp;
                              <button id="recVocale`+ compteurEnigme + `" type="button" class="btn btn-outline-success align-self-center"
                                  data-toggle="modal" data-target="#popupRecVocale">
                                  <i class="fa fa-microphone"></i>&nbsp;&nbsp;Reconnaissance vocale</button>&nbsp;
                              <button id="deleteEnigme`+ compteurEnigme + `" type="button" onclick="supprLigne(` + compteurEnigme + ",\'" + type + `\');" class="btn btn-outline-success align-self-center">
                                  <i class="fa fa-trash"></i></button>
                              </div>
                          </div>`;

    let container = $("#containerEnigme");
    container.append(reponse);
  }
});

//Ajouter autant de réponses que souhaité dans la popup QRCode
var compteurQuestion = 0;
$("#ajouterQuestion").click(function () {
  compteurQuestion++;
  if (compteurQuestion < 30) {
    type = "qrcode";
    let reponse = document.createElement('div');
    reponse.innerHTML = `<div class="form-row" id="divQuestion` + compteurQuestion + `">
                            <div class="form-group col-md-3">
                                  <label class="control-label">Réponse `+ compteurQuestion + ` :</label>
                                </div>
                         <div class="form-group col-md-2">
                                   <input class="form-check-input" type="checkbox" name="gridRadios" id="gridCheck`+ compteurQuestion + `" style="width:70px;" value="option"` + compteurQuestion + ` >
                                      <label class="form-check-label" for="gridCheck`+ compteurQuestion + `">
                            </div>
                          <div class="form-group col-md-6">
                                 <input type="text" class="form-control col-sm-6" id="projectId`+ compteurQuestion + `" rows="2" name="nomprojet"
                                placeholder="Réponse" onkeyup="activerSave();" />
                           </div>
                            <div class="form-group col-md-1">
                                <button id="deleteQRCode`+ compteurQuestion + `" type="button"
                                    class="btn btn-outline-success align-self-center" onclick="supprLigne(` + compteurQuestion + ",\'" + type + `\');">
                                    <i class="fa fa-trash"></i></button>
                                    </div>
                            </div>`;

    let container = $("#repContainer");
    container.append(reponse);
  }
});

//Pour supprimer une énigme ou bien une réponse des QRCode
function supprLigne(idLigne, element) {
  if (element == "enigme") {
    compteurEnigme--;
    $("#divEnigme" + idLigne).on('click', function() {
      $(this).remove();
      for (let cpt = idLigne; cpt <= compteurEnigme; cpt++) {
        let id = cpt+1;
        let div = $("#divEnigme" + id)[0];
        div.getElementsByTagName("label")[0].innerHTML = "Énigme " + cpt + " :";
        div.getElementsByTagName("input")[0].id = "enigme" + cpt;
        div.getElementsByTagName("input")[0].placeholder = "Détails sur l'énigme " + cpt;
        let boutons = div.getElementsByTagName("button");
        boutons[0].id = "scanQR" + cpt;
        boutons[0].name = "ajouterQR" + cpt;
        boutons[1].id = "recVocale" + cpt;
        boutons[2].id = "deleteEnigme" + cpt;
        boutons[2].setAttribute("onclick", "supprLigne(" + cpt + ",\'" + element + "\')");
        div.id = "divEnigme" + cpt;
      }
    });
  } else if (element == "qrcode") {
    compteurQuestion--;
    $("#divQuestion" + idLigne).on('click', function() {
      $(this).remove();
      for(let cpt = idLigne; cpt <= compteurQuestion; cpt++) {
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