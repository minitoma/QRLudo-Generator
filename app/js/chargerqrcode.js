/**
 * @Date:   2018-12-04T08:24:59+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2019-01-16T23:34:40+01:00
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
  console.log("qr code to be drawn : ", qrcode);
  if (qrcode.getType() == 'unique' || qrcode.getType() == 'xl') {
    $("#charger-page").load(path.join(__dirname, "Views/unique.html"), function() {
      $('input#qrColor').val(qrcode.getColor()); // restaurer la couleur du qrcode
      $('input#qrName').val(qrcode.getName()); //restaurer le nom du qrcode

      drawQRCodeData(qrcode);
    });
  } else if (qrcode.getType() == 'ensemble') {
    $("#charger-page").load(path.join(__dirname, "Views/ensemble.html"), function() {
      $('input#qrName').val(qrcode.getName()); //restaurer le nom du qrcodeensemble
      controllerEnsemble.setQRCodeEnsemble(qrcode);
      drawQRCodeEnsembleUnique(qrcode);
      $('#txtDragAndDrop').remove();

    });
  } else if (qrcode.getType() == 'quesRep') {
    $("#charger-page").load(path.join(__dirname, "Views/quesRep.html"), function() {});
  }
  $('#preview, #empty').attr('disabled', false);
}

// recréer les input d'un qrcode unique
function drawQRCodeData(qrcode) {
  let data = qrcode.getData();

  for (var i = 0; i < data.length; i++) {
    if (typeof data[i] === "string") {
      ajouterChampLegende(data[i]);
    } else if (typeof data[i] === "object") {
      ajouterChampSon(data[i].name, data[i].url);
    }
  }
}

// recréer les qrcode unique d'un qrcode ensemble
function drawQRCodeEnsembleUnique(qrcode) {
  for (var i = 0; i < qrcode.getData().length; i++) {
    let qrJson = qrcode.getData()[i].qrcode;
    let qr = null;
    console.log(qrJson.type);

    if (qrJson.type == "unique")
      qr = new QRCodeUnique(qrJson.name, qrJson.data, qrJson.color);
    else if (qrJson.type == "xl")
      qr = new QRCodeXL(qrJson.name, qrJson.data, qrJson.color);
    else if (qrJson.type == "ensemble")
      qr = new QRCodeEnsembleJson(qrJson.name, qrJson.data, qrJson.color);

    genererLigne(qr.getName());
    controllerEnsemble.setQRCodeAtomiqueInArray(qr);
  }
  console.log(qrcode);
  // recuperationQrCodeUnique(qrcode);
}
