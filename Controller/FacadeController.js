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

/**
 * Copyright © 12/02/2018, Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * The Software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders X be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the Software.
 * Except as contained in this notice, the name of the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
*/
