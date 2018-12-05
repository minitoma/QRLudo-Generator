const path = new require('path');
const root = path.dirname(require.main.filename); // project home path

const {
  FacadeController
} = require(`${root}/Controller/FacadeController`);


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
    $("#charger-page").load("Views/unique.html", function() {
      $('input#qrColor').val(qrcode.getColor()); // restaurer la couleur du qrcode
      $('input#qrName').val(qrcode.getName()); //restaurer le nom du qrcode
      // console.log(qrcode.getData(0)[0]);
      console.log(qrcode.getData().entries());
      for (let [index, value] of qrcode.getData().entries()) {
        if (typeof value === "string") {
          ajouterChampLegende();
          console.log(qrcode.getData(index));
          $('textarea#testtexxtarea').val(qrcode.getData(index));
        } else if (typeof value === "object") {
          ajouterChampSon(qrcode.getData(index).name,qrcode.getData(index).url);
        }
        // appelle fonction qui crée un champ dynamiquement
        // à chaque itération tu lui donne data
        // remplir le champ avec data
      }
    });
  } else if (qrcode.getType() == 'ensemble') {
    $("#charger-page").load("Views/ensemble.html", function() {
    $('input#qrName').val(qrcode.getName()); //restaurer le nom du qrcodeensemble
    


    });
  } else if (qrcode.getType() == 'quesRep') {
    $("#charger-page").load("Views/quesRep.html", function() {
    });
  }

}
