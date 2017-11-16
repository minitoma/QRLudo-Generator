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

  static importQRCode(file) {
//    console.log(QRCodeLoader.loadQRCode(file));

    var path = require('path');
    var xmlReader = require('read-xml');
    console.log(file.path);
    console.log(file.name);

    // pass a buffer or a path to a xml file
    xmlReader.readXML(fs.readFileSync(file.path), function(err, data) {
      if (err) {
        console.error(err);
      }

    //  console.log('xml encoding:', data.encoding);
    //  console.log('Decoded xml:', data.content);

      var buffer = document.implementation.createDocument(null, 'html', null);
      var body = document.createElementNS('', 'body');
      body.appendChild(document.createRange().createContextualFragment(data.content));
      buffer.documentElement.appendChild(body);
      var texte = buffer.getElementsByTagName('texte');

      createTabs();

      for (var i = 0; i < texte.length; i++) {
        createTextBox(texte[i].textContent);
      }


//      console.log(buffer.getElementsByTagName('texte'));
      //document.getElementById('dataXml').innerHTML = data.content;
  //    console.log(buffer.childNodes);
    });
  }

}
