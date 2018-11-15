/**
 * @Author: alassane
 * @Date:   2018-11-10T17:59:11+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-11-16T00:51:32+01:00
 */

// fichier script concernant les qr codes uniques

const path = require('path');
const root = path.dirname(require.main.filename); // project home path

const {
  FacadeController
} = require(`${root}/Controller/FacadeController`);

const {
  QRCodeUnique
} = require(`${root}/Model/QRCodeJson`);

let qrcode;

// trigger preview qrcode action
$('#preview').click(e => {
  let inputArray = $('input, textarea');

  if (validateForm(inputArray)) { // all fields are filled

    // get all required attributes for qrcode
    let qrName = $('#qrName').val();
    let qrColor = $('#qrColor').val();
    let qrData = [];
    for (data of $('.qrData')) {
      qrData.push($(data).val());
    }

    // Generate in a div, the qrcode image for qrcode object
    let div = $('#qrView')[0];
    previewQRCode(qrName, qrData, qrColor, div);

    $('#listenField, #saveQRCode').attr('disabled', false);
  }
});

// trigger save qr code image action
$('#saveQRCode').click(e => {
  console.log(e);
  console.log(qrcode.getName());
  saveQRCodeImage();
});

// form validation return true if all fields are filled
function validateForm(inputArray) {

  for (input of inputArray) {
    if (!$(input).val() || $(input).val() == "") {
      $('#errorMessage').text("* Veuillez renseigner tous les champs");
      return false;
    }
  }
  $('#errorMessage').text("");
  return true;
}

// generate and print qr code
function previewQRCode(name, data, color, div) {
  // instanciate a qrcode unique object
  qrcode = new QRCodeUnique(name, data, color);

  let facade = new FacadeController();
  facade.genererQRCode(div, qrcode);
}

// save image qr code
function saveQRCodeImage() {
  const fs = require('fs');

  let img = $('#qrView img')[0].src;

  var data = img.replace(/^data:image\/\w+;base64,/, '');

  fs.writeFile(`${root}/${qrcode.getName()}.jpeg`, data, {
    encoding: 'base64'
  }, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });

}

// fonction permettant de charger, importer un qr code
function importQRCode(filename) {
  let facade = new FacadeController();

  let blob = null;
  let xhr = new XMLHttpRequest();
  xhr.open("GET", filename);
  xhr.responseType = "blob"; //force the HTTP response, response-type header to be blob
  xhr.onload = function() {
    blob = xhr.response; //xhr.response is now a blob object
    facade.importQRCode(blob, drawQRCode);
  }
  xhr.send();
}

// fonction permettant de recréer visuellement un qr code unique
function drawQRCode(qrcode) {
  console.log("qr code to be drawn : ", qrcode);
}
