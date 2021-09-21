/**
 * @Author: alassane
 * @Date:   2018-11-09T18:42:04+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-08T14:07:40+01:00
 */

/**
 * Classe permettant de générer les images de QR Codes
 */
class ImageGeneratorJson {

  constructor() {}

  /**
   * Génère l'image du QRCode Json passé en paramètre dans un div
   */
  static genererQRCode(arg) {
    let qrcode = arg[0];
    let div = arg[1];
    let data = arg[2];

    /** On génère le QRCode dans un canvas */
    $(div).qrcode({
      /** text must be string */
      text: data.toString('base64'),
      background: "#ffffff",
      fill: qrcode.getColor()
    });

    // let canvas = document.createElement('canvas');
    // let canvas = $('#qrView canvas')[0];

    let canvas = $(div).children()[0];
    let arrayData = ImageGeneratorJson.stringtoUTF8Array(qrcode.getDataString());

    console.log("arrayData stored in qrcode metadata : ", arrayData);

    ImageGeneratorJson.genererJPEGJson(arrayData, canvas, div);

    /** On supprime le canvas initial */
    canvas.parentNode.removeChild(canvas);
  }

  /** On génère une image jpg à partir du canvas et contenant les données du qrcode dans l'attribut XMLPacket 
   * On crée un élément img contenant l'image générée puis on l'insère dans le div
  */
  static genererJPEGJson(data, canvas, divSortie) {

    const piexif = require('piexifjs');
    /** On génère une image jpg à partir du canvas et contenant les données du qrcode dans l'attribut XMLPacket */
    let zerothIfd = {};
    zerothIfd[piexif.ImageIFD.XMLPacket] = data;
    let exifObj = {
      "0th": zerothIfd
    };
    let exifBytes = piexif.dump(exifObj);
    let jpegData = canvas.toDataURL("image/jpeg");
    let exifModified = piexif.insert(exifBytes, jpegData);

    /** On crée un élément img contenant l'image générée puis on l'insère dans le div */
    let image = new Image();
    image.src = exifModified;
    $(divSortie).prepend(image);

    return image;
  }

  /** from string return utf8 array */
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
