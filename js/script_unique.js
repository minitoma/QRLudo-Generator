/**
 * @Author: alassane
 * @Date:   2018-11-10T17:59:11+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-11-16T00:51:32+01:00
 */

// fichier script concernant les qr codes uniques

const path = new require('path');
const root = path.dirname(require.main.filename); // project home path

const {
  FacadeController
} = require(`${root}/Controller/FacadeController`);

const {
  QRCodeUnique
} = require(`${root}/Model/QRCodeJson`);

const{
QRCodeXL
} = require(`${root}/Model/QRCodeJson`);

let qrcode;
let qrType;

// trigger preview qrcode action
$('#preview').click(e => {

  //enlever le messade de success s'il existe
  document.getElementById('successMessage').style.display = "none";

  let inputArray = $('input, textarea');

  if (validateForm(inputArray)) { // all fields are filled
    // get all required attributes for qrcode
    let qrColor = $('#qrColor').val();
    let qrName = $('#qrName').val();
    let qrData = [];

    for (data of $('.qrData')) {
      qrData.push($(data).val());
    }

    qrType = $('#typeQRCode').val();

    // Generate in a div, the qrcode image for qrcode object
    let div = $('#qrView')[0];

    previewQRCode(qrName, qrData, qrColor, div);

    $('#listenField, #saveQRCode, #annuler').attr('disabled', false);
  }
});


// form validation return true if all fields are filled
function validateForm(inputArray) {
  console.log(inputArray);
  //cet index pour enlever un input de type file
  let index = 0;
  document.getElementById('successMessage').style.display = "none";
  for (input of inputArray) {
    // eliminer les input de type file
    if($(input).attr('type') != 'file'){
      if (!$(input).val() || $(input).val() == "") {
        document.getElementById('errorMessage').style.display = "";
        return false;
      }
    }else{
        //enlever l'element input de type file
        inputArray.splice(index,1);
        }

    ++index;
  }

  console.log(inputArray);
  // $('#errorMessage').text("");
  document.getElementById('errorMessage').style.display = "none";

  return true;
}

// trigger save qr code image action
$('#saveQRCode').click(e => {
  console.log(e);
  console.log(qrcode.getName());
  saveQRCodeImage();
});


// generate and print qr code
function previewQRCode(name, data, color, div) {

  // instanciate a qrcode unique object
  if(qrType == 'xl')
    qrcode = new QRCodeXL(name, data, color);
  else
    qrcode = new QRCodeUnique(name, data, color);

  let facade = new FacadeController();
  facade.genererQRCode(div, qrcode);
}

// save image qr code
function saveQRCodeImage() {
  const fs = require('fs');

  let img = $('#qrView img')[0].src;

  var data = img.replace(/^data:image\/\w+;base64,/, '');

  fs.writeFile(`${root}/QR-Unique/QR/${qrcode.getName()}.jpeg`, data, {
    encoding: 'base64'
  }, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
    document.getElementById('errorMessage').style.display = "none";
    document.getElementById('successMessage').style.display = "";
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
