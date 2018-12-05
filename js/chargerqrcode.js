/**
 * @Date:   2018-12-04T08:24:59+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-04T21:53:26+01:00
 */



$().ready(function() {

  $('#setImportedFile').click(function(e) {
    if (document.getElementById("importedFile").files.length > 0) {
      var nomfichier = document.getElementById("importedFile").files[0].path;
      importQRCodeImport(nomfichier);
    }
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

    $("#charger-page").load("Views/unique.html", function() {
      $('input#qrColor').val(qrcode.getColor()); // restaurer la couleur du qrcode
      $('input#qrName').val(qrcode.getName()); //restaurer le nom du qrcode

      let data = qrcode.getData();

      for (var i = 0; i < data.length; i++) {
        if (typeof data[i] === "string") {
          ajouterChampLegende(data[i]);
        } else if (typeof data[i] === "object") {
          ajouterChampSon(data[i].name, data[i].url);
        }
      }

    });
  } else if (qrcode.getType() == 'ensemble') {
    $("#charger-page").load("Views/ensemble.html", function() {
      $('input#qrName').val(qrcode.getName()); //restaurer le nom du qrcodeensemble

    });
  } else if (qrcode.getType() == 'quesRep') {
    $("#charger-page").load("Views/quesRep.html", function() {});
  }

}
