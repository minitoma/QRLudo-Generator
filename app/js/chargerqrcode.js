/**
 * @Date:   2018-12-04T08:24:59+01:00
 * @Last modified by:   louis cuegniet
 * @Last modified time: 25/11/2020
 */


$().ready(function() {
  //require("./js/script_unique.js");

  $('#setImportedFile').click(function() {
    var nomfichier = document.getElementById("importedFile").files[0].path;
    importQRCodeImport(nomfichier);
  });
});
//fonction permettant de charger, importer un qr code
function importQRCodeImport(filename) {
  let facade = new FacadeController();

  let blob = null;
  let xhr = new XMLHttpRequest();
  xhr.open("GET", filename);
  xhr.responseType = "blob"; //force the HTTP response, response-type header to be blob
  xhr.onload = function() {
    blob = xhr.response; //xhr.response is now a blob object
    facade.importQRCode(blob, drawQRCodeImport);
  }
  xhr.send();
}

// fonction permettant de recréer visuellement un qr code
function drawQRCodeImport(qrcode) {
  if (qrcode.getType() == 'unique' || qrcode.getType() == 'xl') {
    $("#charger-page").load(path.join(__dirname, "Views/unique.html"), function() {
      $('input#qrColor').val(qrcode.getColor()); // restaurer la couleur du qrcode
      $('input#qrName').val(qrcode.getName()); //restaurer le nom du qrcode
      store.set(`titreUnique`, qrcode.getName());
      isImportationQRUnique = true;
      $('#preview, #empty').attr('disabled', false);
      drawQRCodeData(qrcode);
    });
    //TODO Changer ici en multiple quand le type sera bien défini
  } else if (qrcode.getType() == 'ensemble') {
    $("#charger-page").load(path.join(__dirname, "Views/multiple.html"), function() {
      $('input#qrColor').val(qrcode.getColor()); // restaurer la couleur du qrcode
      $('input#qrName').val(qrcode.getName()); //restaurer le nom du qrcodemultiple
      controllerMultiple.setQRCodeMultiple(qrcode);
      $('#preview, #empty').attr('disabled', false);
      drawQRCodeMultipleUnique(qrcode);
      $('#txtDragAndDrop').remove();

    });
  } else if (qrcode.getType() == 'question') {
    $("#charger-page").load(path.join(__dirname, "Views/quesRep.html"), function() {
      $("#newQuestionText").val(qrcode.getName());
      $("#newBonneReponseText").val(qrcode.getGoodAnswer());
      $("#newMauvaiseReponseText").val(qrcode.getBadAnswer());
      $("#newNbMinimalBonneReponse").val(qrcode.getMinAnswer());
    });
  } else if (qrcode.getType() == 'ExerciceReconnaissanceVocaleQCM') {
    $("#charger-page").load(path.join(__dirname, "Views/recVocal.html"), function() {
      $("#questionOuverteOnglet").removeClass("active");
      $("#onglet-QuesOuverte").removeClass("active");
      $("#questionQCMOnglet").addClass("active");
      $("#onglet-QCM").addClass("active");
      $("#QuestionQCM").val(qrcode.getName());
      if(qrcode.getLettreReponseVocale()){
        $("#reponseParIdentifiant").prop( "checked", true );;
      }
      $("#MessageBonnereponseQCM").val(qrcode.getGoodAnswer());
      $("#MessageMauvaisereponseQCM").val(qrcode.getBadAnswer());
      isImportationExerciceRecoVocaleQCM = true;
      drawQRCodeDataRecVocale(qrcode);
      store.set("sousOnglet", "qcm");
    });
}else if (qrcode.getType() == 'ExerciceReconnaissanceVocaleQuestionOuverte') {
  $("#charger-page").load(path.join(__dirname, "Views/recVocal.html"), function() {
    $("#Question").val(qrcode.getName());
    $("#Bonnereponse").val(qrcode.getReponse());
    $("#MessageBonnereponse").val(qrcode.getGoodAnswer());
    $("#MessageMauvaisereponse").val(qrcode.getBadAnswer());
    store.set("sousOnglet", "question_ouverte");
  });
}else if (qrcode.getType() == 'SeriousGameScenario') {
  $("#charger-page").load(path.join(__dirname, "Views/serious-game.html"), function() {
    $("#projectId").val(qrcode.getName());
    $("#textAreaIntro").val(qrcode.getIntro());
    $("#textAreaFin").val(qrcode.getEnd());
    var projet = new ProjetSeriousGame(qrcode.getName(), qrcode.getQuestionQRCode(), qrcode.getQuestionRecoVocale());
    drawQRCodeSeriousGameEnigma(qrcode);
  });
}
}

// recréer les input d'un qrcode unique
function drawQRCodeData(qrcode) {
  let data = qrcode.getData();
  
  for (var i = 1; i <= store.get(`numZoneCourante`); i++) {
    store.delete(`zone${i}`);
  }

  for (var i = 0; i < data.length; i++) {
    if (typeof data[i] === "string") {
      ajouterChampLegende(data[i]);
    } else if (typeof data[i] === "object") {
      ajouterChampSon(data[i].name, data[i].url);
    }
  }
  let musics = data.filter(d => d.type == 'music');

  if(musics.length !==0){
    restoreSavedMusic(musics);
  }
}

// recréer les qrcode unique d'un qrcode multiple
function drawQRCodeMultipleUnique(qrcode) {
  for (var i = 0; i < qrcode.getData().length; i++) {
    let qrJson = qrcode.getData()[i].qrcode;
    let qr = null;

    if (qrJson.type == "unique"){
      qr = new QRCodeUnique(qrJson.name, qrJson.data, qrJson.color);
    }
    else if (qrJson.type == "xl"){
      qr = new QRCodeXL(qrJson.name, qrJson.data, qrJson.color);
    }
    else if (qrJson.type == "ensemble"){
      qr = new QRCodeMultipleJson(qrJson.name, qrJson.data, qrJson.color);
    }
    else if (qrJson.type == "question"){
      qr = new QRCodeQuestionReponse(qrJson.name, qrJson.data, qrJson.color);
    }


    genererLigne(qr.getName());
    controllerMultiple.setQRCodeAtomiqueInArray(qr);
  }
  // recuperationQrCodeUnique(qrcode);
}

// recréer les inputs d'un qrcode RecVocal
function drawQRCodeDataRecVocale(qrcode) {
  let data = qrcode.getData();
  console.log(data);
  for (var i = 0; i < data.length; i++) {
    console.log(i);
    var reponse = new ReponseVocale(data[i][0], data[i][1], data[i][2])
    if(i==0) {
      $("#reponseinitiale").val(reponse.getTextQuestion());
      if(reponse.getEstBonneReponse()){
        $("#gridCheck1").prop("checked", true);
      }
    }
    else {
      ajouterNouvelleReponse(reponse.getTextQuestion(), reponse.getEstBonneReponse())
    }
  }
}

// recréer les inputs d'un qrcode Scenario Serious Game
function drawQRCodeSeriousGameEnigma(qrcode) {
  let enigmes = qrcode.getEnigmes();
  console.log(qrcode);
  for (var i = 0; i < enigmes.length; i++) {
    if(i==0){
      $("#enigme1").val(enigmes[i][1]);
      
    }else{
      $("#ajouterEnigme").trigger("click");
      $("input#enigme"+(i+1)).val(enigmes[i][1]);
    }
  }
}


// télécharger la musique correspondante et l'enregistrer
function restoreSavedMusic(data) {
  let loader = document.createElement('div');
  let content = $('.tab-content');

  $(loader).addClass('loader');
  $('.card-body')[0].insertBefore(loader, content[0]); // show loader when request progress
  content.hide();

  let nbMusic = 0;

  for (let music of data) {
    let xhr = new XMLHttpRequest();
    try {
      xhr.open('GET', music.url, true);
    } catch (e) {
      console.log(e);
    }

    xhr.responseType = 'blob';
    xhr.onload = function(e) {

      if (this.status == 200) {
        let blob = this.response; // get binary data as a response
        let contentType = xhr.getResponseHeader("content-type");

        if (contentType == 'audio/mpeg') {
          // save file in folder download
          let fileReader = new FileReader();
          fileReader.onload = function() {
            // fs.writeFileSync(`${temp}/Download/${music.name}`, Buffer(new Uint8Array(this.result)));
            fs.writeFile(`${temp}/Download/${music.name}`, Buffer(new Uint8Array(this.result)), (err) => {
              if (err) throw err;
              console.log('The file has been saved!');
              nbMusic++;
              if (nbMusic == data.length) {
                $(loader).remove();
                content.show();
              }
            });
          };
          fileReader.readAsArrayBuffer(blob);
        } else {
          console.log('error on download, le fichier nexiste peut etre plus');
        }
      } else {
        // request failed
        console.log('error on download, request fails');
      }
    };

    xhr.onerror = function(e) {
      console.log('error');
    };

    xhr.send();
  }
}
