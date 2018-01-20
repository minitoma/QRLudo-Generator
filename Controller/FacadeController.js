/**
* Jules Leguy, Alassane Diop
* 2017
**/

/*
* Classe permettant à la vue d'interagir avec le controller.
* La vue instancie cette classe une seule fois à son initialisation et fait systématiquement appel à cette instance quand elle a besoin d'un traitement du controller.
*/
class FacadeController{

  constructor(){
    this.compresseurXml = new CompresseurTexte();
    this.imageGenerator = new ImageGenerator(this.compresseurXml);

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
    try {
      while (divImg.hasChildNodes()) {
        divImg.removeChild(divImg.firstChild);
      }

      return this.imageGenerator.genererQRCode(divImg, qrcode);
    } catch (e) {
      alert(e);
    }
  }

  //Génère une image contenant une famille de QRCodes dans les metadonnees
  genererImageFamilleQRCode(tableauQRCodes, divImg){
    while (divImg.hasChildNodes()) {
        divImg.removeChild(divImg.firstChild);
    }
    this.imageGenerator.genererImageFamilleQRCode(tableauQRCodes, divImg);
  }

  //Fonction appelée pour importer un qrcode
  importQRCode (file) {
    var qrcode;
    QRCodeLoader.loadImage(file, function(qrcode, callback){
      console.log(qrcode);
      callback(qrcode); // faire le view du qrcode
    });

  }

  //Renvoie la taille réelle du qrcode après compression
  getTailleReelleQRCode(qrcode){
      return this.compresseurXml.compresser(qrcode.getDonneesUtilisateur()).length;
  }

}
