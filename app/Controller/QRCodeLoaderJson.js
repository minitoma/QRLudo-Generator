/**
 * @Author: alassane
 * @Date:   2018-11-14T00:46:15+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-06T18:19:38+01:00
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
      let data = ev.target.result;

      //On récupère les données exif de l'image
      let exifObj = piexif.load(data);
      let dataUtf8 = exifObj["0th"][700];

      if (!dataUtf8) {
        throw "L'image est invalide (ne contient pas de métadonnées)";
      }

      let qrcodeString = QRCodeLoaderJson.UTF8ArraytoString(dataUtf8);

      let qrcode;
      let qr = JSON.parse(qrcodeString);

      switch (JSON.parse(qrcodeString).type) {
        case "unique":
          qrcode = new QRCodeUnique(qr.name, qr.data, qr.color);
          qrcode.setId(qr.id);
          break;

        case "xl":
          qrcode = new QRCodeXL(qr.name, qr.data, qr.color);
          qrcode.setId(qr.id);
          break;

        case "ensemble":
          qrcode = new QRCodeMultipleJson(qr.name, qr.data, qr.color);
          break;

        case "question":
          qrcode = new Question(qr.name, qr.data, qr.color);
          qrcode.setId(qr.id);
          qrcode.setMinAnswer(qr.nb_min_reponses);
          qrcode.setGoodAnswer(qr.text_bonne_reponse[0]);
          qrcode.setBadAnswer(qr.text_mauvaise_reponse);
          break;

        case "reponse":
          qrcode = new Reponse(qr.name, qr.color);
          qrcode.setId(qr.id);
          break;

        case "ExerciceReconnaissanceVocaleQCM":
          qrcode = new QRCodeQCM(qr.name, qr.data, qr.lettreReponseVocale, qr.text_bonne_reponse, qr.text_mauvaise_reponse, qr.color);
         break;

        case "ExerciceReconnaissanceVocaleQuestionOuverte":
          qrcode = new QRCodeQuestionOuverte(qr.name, qr.data, qr.text_bonne_reponse, qr.text_mauvaise_reponse, qr.color);
        break;

        case "SeriousGameScenario" :
          qrcode = new QRCodeSeriousGame(qr.name, qr.introduction, qr.fin, qr.enigmes, qr.questionsQrCode, qr.questionRecoVocale, qr.color)
          break;

        default:
          throw "QR Code invalide";
      }

      console.log("restored qr code : ", qrcode);

      if (callback)
        callback(qrcode);

    });

  }

  // from utf8 array return string
  static UTF8ArraytoString(array) {
    let result = "";

    for (let i = 0; i < array.length; i++)
      result += String.fromCharCode(array[i]);

    return result;
  }

}

module.exports = {
  QRCodeLoaderJson
};
