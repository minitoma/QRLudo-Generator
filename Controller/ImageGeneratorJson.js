/**
 * @Author: alassane
 * @Date:   2018-11-09T18:42:04+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-11-23T12:37:29+01:00
 */

/**
 * Classe permettant de générer les images de QR Codes
 */
class ImageGeneratorJson {

  constructor() {}

  /*
   * Génère l'image du QRCode Json passé en paramètre dans un div
   */
  static genererQRCode(arg) {
    let qrcode = arg[0];
    let div = arg[1];
    let data = arg[2];
    //console.log("THE QRCODE : ", qrcode);
    console.log("data stored in qrcode : ", data);
    //On génère le QRCode dans un canvas
    $(div).qrcode({
      text: data.toString('base64'), // text must be string
      background: "#ffffff",
      fill: qrcode.getColor()
    });

    // let canvas = document.createElement('canvas');
    // let canvas = $('#qrView canvas')[0];
    console.log($(div).children()[0]);
    // console.log($(`${div} canvas`)[0]);
    let canvas = $(div).children()[0];
    let arrayData = ImageGeneratorJson.stringtoUTF8Array(qrcode.getDataString());
    console.log("arrayData stored in qrcode : ", arrayData);

    ImageGeneratorJson.genererJPEGJson(arrayData, canvas, div);

    //On supprime le canvas initial
    canvas.parentNode.removeChild(canvas);
  }

  static genererJPEGJson(data, canvas, divSortie) {

    const piexif = require('piexifjs');
    //On génère une image jpg à partir du canvas et contenant les données du qrcode dans l'attribut XMLPacket
    let zerothIfd = {};
    zerothIfd[piexif.ImageIFD.XMLPacket] = data;
    let exifObj = {
      "0th": zerothIfd
    };
    let exifBytes = piexif.dump(exifObj);
    let jpegData = canvas.toDataURL("image/jpeg");
    let exifModified = piexif.insert(exifBytes, jpegData);

    //On crée un élément img contenant l'image générée puis on l'insère dans le div
    let image = new Image();
    image.src = exifModified;
    $(divSortie).prepend(image);

    return image;
  }

  // from string return utf8 array
  static stringtoUTF8Array(donnees) {
    let donneesutf8 = [];

    for (let i = 0; i < donnees.length; i++)
      donneesutf8.push(donnees.charCodeAt(i));

    return donneesutf8;
  }

}

module.exports = {
  ImageGeneratorJson
};
