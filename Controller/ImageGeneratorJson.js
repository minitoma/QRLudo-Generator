/**
 * @Author: alassane
 * @Date:   2018-11-09T18:42:04+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-11-14T10:25:15+01:00
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

    //On génère le QRCode dans un canvas
    $(div).qrcode({
      text: qrcode.getDataString(), // text must be string
      background: "#ffffff",
      fill: qrcode.getColor()
    });

    // var canvas = document.createElement('canvas');
    let canvas = $('#qrView canvas')[0];
    let arrayData = [...data];
    ImageGeneratorJson.genererJPEGJson(arrayData, canvas, div);

    //On supprime le canvas initial
    canvas.parentNode.removeChild(canvas);
  }

  static genererJPEGJson(data, canvas, divSortie) {

    const piexif = require('piexifjs');
    //On génère une image jpg à partir du canvas et contenant les données du qrcode dans l'attribut XMLPacket
    var zerothIfd = {};
    zerothIfd[piexif.ImageIFD.XMLPacket] = data;
    var exifObj = {
      "0th": zerothIfd
    };
    var exifBytes = piexif.dump(exifObj);
    var jpegData = canvas.toDataURL("image/jpeg");
    var exifModified = piexif.insert(exifBytes, jpegData);

    //On crée un élément img contenant l'image générée puis on l'insère dans le div
    var image = new Image();
    image.src = exifModified;
    $(divSortie).prepend(image);

    return image;
  }

}

module.exports = {
  ImageGeneratorJson
};
