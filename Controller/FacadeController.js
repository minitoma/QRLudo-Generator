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
  genererQRCode(divImg, qrcode, color){
    while (divImg.hasChildNodes()) {
        divImg.removeChild(divImg.firstChild);
    }

    QRCodeGenerator.generate(divImg, qrcode, color);
  }

  // fonction appelée pour importer un qrcode
  importQRCode (file) {
    var qrcode;
    QRCodeLoader.loadQRCode(file, function(qrcode, callback){
      console.log(qrcode.getDonneesUtilisateur());
      callback(qrcode); // faire le view du qrcode
    });
  }

}
