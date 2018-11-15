/**
 * @Author: alassane
 * @Date:   2018-11-14T00:46:15+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-11-14T13:24:50+01:00
 */


/*
 * Permet de créer un objet QRCode à partir d'une image QRCode ou d'instancier un tableau contenant les objets QRCodes obtenus à partir d'une image enregistrant une famille de QRCodes
 */
class QRCodeLoaderJson {

  //Renvoie le QRCode crée à partir des informations du fichier image passé en paramètre
  static loadImage(file, callback) {

    let fileReader = new FileReader();

    fileReader.readAsDataURL(file);

    // `onload` as listener
    fileReader.addEventListener('load', function(ev) {
      // console.log("dataUrl:", ev.target.result);

      QRCodeLoaderJson.traiterImage(ev.target.result);
      // let qrcode = QRCodeLoaderJson.traiterImage(ev.target.result);
      // console.log(qrcode);
      // if (callback)
      //   callback(qrcode);
      // callback(qrcode);
      // renvoyer le qrcode créé avec la méthode en conséquence pour recréer la vue
      // if (callback) {
      //   if (Array.isArray(qrcode)) {
      //     callback(qrcode, drawQRCodeFamille);
      //   } else {
      //     callback(qrcode, drawQRCodeAtomique);
      //   }
      // }
    });

  }


  /*
   * Lit le contenu des métadonnées de l'image passée en paramètre et détecte s'il s'agit d'un qrcode ou d'une famille de qrcodes, puis fait l'appel à la sous fonction en conséquence
   */
  static traiterImage(data) {
    const piexif = require('piexifjs');
    const {
      JsonCompressor
    } = require('./JsonCompressor');
    //On récupère les données exif de l'image
    let exifObj = piexif.load(data);
    let dataUtf8 = exifObj["0th"][700];

    if (!dataUtf8) {
      throw "L'image est invalide (ne contient pas de métadonnées)";
    }

    let buffer = Buffer.from(dataUtf8);

    // decompress buffer
    JsonCompressor.decompress(buffer, QRCodeLoaderJson.creerQRCode);
    console.log(qrcode);
  }

  //On crée un objet QRCode à partir d'un json recréé
  static creerQRCode(qrcodeJson) {
    const path = require('path');
    let root = path.dirname(require.main.filename);
    const {
      QRCodeUnique
    } = require(`${root}/Model/QRCodeJson`);

    let qr = JSON.parse(qrcodeJson).qrcode;

    let qrcode = new QRCodeUnique(qr.name, qr.data, qr.color);
    console.log(qrcode);
    // if (qrcode != undefined)
    drawQRCode(qrcode);
  }

}

module.exports = {
  QRCodeLoaderJson
};
