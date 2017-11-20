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

    QRCodeGenerator.generate(divImg, qrcode);
  }

  // fonction appelée pour importer un qrcode
  importQRCode(file) {

    var qrcode;
    QRCodeLoader.loadQRCode(file, function(qrcode, callback){
      callback(qrcode); // faire le view du qrcode
    });
  }
  
    for (var i = 0; i < input.length; i++) {
      if (input[i].tagName =='fichier') {
        var event = document.createElement('Event');
        event.target = document.createElement('a');
        event.target.href = input[i].getAttribute('url');
        event.target.textContent = input[i].getAttribute('nom');
        selectMusic(event);
      }else if (input[i].tagName == 'texte' || input[i].tagName == 'textarea') {
        createTextBox(input[i].textContent);
      }


}
