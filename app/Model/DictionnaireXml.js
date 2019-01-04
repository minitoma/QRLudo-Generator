/**
 * @Author: alassane
 * @Date:   2018-11-09T18:42:04+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-11-14T11:24:01+01:00
 */



/**
 * Jules Leguy
 * 2017
 **/

/*s
 * Classe stockant les chaines de caractères des tags et attributs pouvant être contenus dans le xml représentant un QRCode
 * Permet de changer globalement la chaîne représentant un tag ou un attribut
 */
class DictionnaireXml {


  //Noeuds
  static getTagRacine() {
    return "qrcode";
  }

  static getTagMetaDonnees() {
    return "metadonnees";
  }

  static getTagDonneesUtilisateur() {
    return "donneesutilisateur";
  }

  static getTagContenu() {
    return "contenu";
  }

  static getTagFichier() {
    return "fichier";
  }

  static getTagTexte() {
    return "texte";
  }

  static getTagTextearea() {
    return "textarea";
  }

  static getTagFamille() {
    return "famille";
  }

  static getTagColorBraille() {
    return "colorbraille";
  }

  static getTagColorQRCode() {
    return "colorqrcode";
  }

  static getTagTexteBraille() {
    return "textebraille";
  }

  static getTagNomQRCode() {
    return "valeur";
  }

  static getTagEnsembleFichiers() {
    return "fichiers";
  }


  //Attributs
  static getAttTypeQRCode() {
    return "type";
  }

  static getValTypeAtomique() {
    return "atomique";
  }

  static getValTypeEnsemble() {
    return "ensemble";
  }

  static getAttUrlFichier() {
    return "url";
  }

  static getAttNomFichier() {
    return "nom";
  }

  static getAttNomFamille() {
    return "nom";
  }

  static getAttOrdreFamille() {
    return "ordre";
  }

  static getAttNomQRCode() {
    return "valeur";
  }

  static getAttCouleur() {
    return "color";
  }

  static getAttTexteBraille() {
    return "texte";
  }
}

module.exports = {
  DictionnaireXml
};

/**
 * Copyright © 12/02/2018, Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * The Software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders X be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the Software.
 * Except as contained in this notice, the name of the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
 */
