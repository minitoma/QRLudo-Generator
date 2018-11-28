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

// form validation return true if all fields are filled
function validateForm(inputArray) {
  //cet index pour enlever un input de type file
  let index = 0;
  initMessages();
  for (input of inputArray) {
    // eliminer les input de type file
    if($(input).attr('type') != 'file'){
      if (!$(input).val() || $(input).val() == "") {
        messageInfos("Veuillez renseigner tous les champs","danger");//message a afficher en haut de la page
        return false;
      }
    }else{
        //enlever l'element input de type file
        inputArray.splice(index,1);
        }

    ++index;
  }

  return true;
}


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
