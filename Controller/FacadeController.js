/*
* Classe permettant à la vue d'interagir avec le controller.
* La vue instancie cette classe une seule fois à son initialisation et fait systématiquement appel à cette instance quand elle a besoin d'un traitement du controller.
*/
class FacadeController{

  constructor(qrcode, divImg){
    this.qrcode = qrcode;
    this.divImg = divImg; //Stocke l'id du div dans laquelle le controller écrit les QRCodes générés
  }

  creerQRCodeAtomique(){
    return new QRCodeAtomique();
  }

  creerQRCodeEnsemble(){
    return new QRCodeEnsemble();
  }

  genererQRCode(form){

    while (this.divImg.hasChildNodes()) {
        this.divImg.removeChild(this.divImg.firstChild);
    }

    //div.appendChild(createImg('img-buffer','./img/image.png')); // générer un élément img dans le div
    QRCodeGenerator.generate(this.divImg, this.qrcode);
    console.log(this.qrcode.getDonnees());
  }




}
