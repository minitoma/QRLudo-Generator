/*
* Classe permettant à la vue d'interagir avec le controller.
* La vue instancie cette classe une seule fois à son initialisation et fait systématiquement appel à cette instance quand elle a besoin d'un traitement du controller.
*/
class FacadeController{

  constructor(divImg){
    this.divImg = divImg; //Stocke l'id du div dans laquelle le controller écrit les QRCodes générés
  }

  creerQRCodeAtomique(){
    return new QRCodeAtomique();
  }

  creerQRCodeEnsemble(){
    return new QRCodeEnsemble();
  }

  genererQRCode(qrcode){
    QRCodeGenerator.generate(this.divImg, qrcode);
  }




}
