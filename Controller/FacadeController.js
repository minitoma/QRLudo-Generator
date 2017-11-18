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
  }

  // fonction appelée pour importer un qrcode
  static importQRCode(file) {
    var qrcode;
    QRCodeLoader.loadQRCode(file, function(qrcode, callback){
      console.log(qrcode.getDonneesUtilisateur());

      callback(qrcode.getDonneesUtilisateur()); // faire le view du qrcode
    });
  }

  // fonction appelée pour faire le view du qrcode
  static drawQRCode (data) {
    var buffer = document.implementation.createDocument(null, 'html', null);
    var body = document.createElementNS('', 'body');
    body.appendChild(document.createRange().createContextualFragment(data));
    buffer.documentElement.appendChild(body);
    var input = buffer.getElementsByTagName('contenu')[0].childNodes;

    createTabs();

    for (var i = 0; i < input.length; i++) {
      var value;
      if (input[i].tagName =='fichier') {
        value = input[i].getAttribute('nom');
        var form = document.getElementsByClassName('in active')[0].childNodes[0].childNodes[0];

        var label = createLabel('titreMusique','Titre Musique');
        var input = createInput('text', 'form-control', input[i].getAttribute('href'), value);
        input.disabled = 'true';

        var div = createDiv('form-group', '', [label, input]);

        form.appendChild(div);
      }else if (input[i].tagName == 'texte' || input[i].tagName == 'textarea') {
        createTextBox(input[i].textContent);
      }

    }
  }

}
