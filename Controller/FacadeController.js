/*
* Classe permettant à la vue d'interagir avec le controller.
* La vue instancie cette classe une seule fois à son initialisation et fait systématiquement appel à cette instance quand elle a besoin d'un traitement du controller.
*/
class FacadeController{

  constructor(){

  }

  //Renvoie un nouveau QRCodeAtomique
  creerQRCodeAtomique(){
    return new QRCodeAtomique();
  }

  //Renvoie un nouveau QRCodeEnsemble
  creerQRCodeEnsemble(){
    return new QRCodeEnsemble();
  }

  //Génère une image QRCode à partir d'un objet QRCode dans le div passé en paramètre
  genererQRCode(divImg, qrcode){
    while (divImg.hasChildNodes()) {
        divImg.removeChild(divImg.firstChild);
    }

    return ImageGenerator.genererQRCode(divImg, qrcode);
  }

  //Génère une image contenant une famille de QRCodes dans les metadonnees
  genererImageFamilleQRCode(tableauQRCodes, divImg){
    while (divImg.hasChildNodes()) {
        divImg.removeChild(divImg.firstChild);
    }
    ImageGenerator.genererImageFamilleQRCode(tableauQRCodes, divImg);
  }

  //Fonction appelée pour importer un qrcode
  importQRCode (file) {
    var qrcode;
    QRCodeLoader.loadImage(file, function(qrcode, callback){
      console.log(qrcode.getDonneesUtilisateur());
      console.log(qrcode.getMetadonnees());
      callback(qrcode); // faire le view du qrcode
    });

  }

}
