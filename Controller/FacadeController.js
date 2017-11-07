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

    if (form != null) {

        for(var i=0; i<form.length; i++) {

          var form2 = form.childNodes[i].childNodes;
          for(var j=0; j<form2.length; j++) {
            switch (form2[j].tagName) {
              case 'INPUT':
                console.log(form2[j].tagName);
                this.copyInputContent(form2[j]);
                break;

              case 'LABEL':
                console.log(form2[j].tagName);
                this.copyLegendeContent(form2[j]);
                break;

              default:
                console.log(form2[j].tagName);
            }
          }
        }
      }

    while (this.divImg.hasChildNodes()) {
        this.divImg.removeChild(this.divImg.firstChild);
    }

    //div.appendChild(createImg('img-buffer','./img/image.png')); // générer un élément img dans le div
    QRCodeGenerator.generate(this.divImg, this.qrcode);
    console.log(this.qrcode.getDonnees());
  }

  // copier le contenu d'un element input
  copyInputContent(input) {
    // tester s'il s'agit d'un input de musique
    if(input.disabled) {
      var url = 'https://drive.google.com/open?id=' + input.id;
      this.qrcode.ajouterFichier(url, input.value);
    } else {
      this.qrcode.ajouterTexte(input.value);
    }
  }

  // copier le contenu d'un element legende
  copyLegendeContent(legende) {
    this.qrcode.ajouterTexte(legende.textContent);
  }



}
