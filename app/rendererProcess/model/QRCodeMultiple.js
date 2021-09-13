/**
 * @Author: alassane
 * @Date:   2018-11-09T18:42:04+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-11-14T11:33:06+01:00
 */

/**
 * Jules Leguy, David Dembele
 * 2017
 **/

const root = __dirname.match(`.*app`)[0];
const { QRCode } = require(`${root}/rendererProcess/model/QRCode.js`);
const { DictionnaireXml } = require(`${root}/rendererProcess/model/DictionnaireXml.js`);

/**
 *Classe permettant de stocker et d'accéder au données contenues dans un QRCode de type multiple
 */
class QRCodeMultiple extends QRCode {

  constructor() {
    super();
    /** On enregistre le type de qrcode comme attribut du noeud donneesUtilisateur */
    this.donneesUtilisateur.setAttribute(DictionnaireXml.getAttTypeQRCode(), DictionnaireXml.getValTypeMultiple());
  }

  /**
   * Ajoute dans la base tous les liens contenus dans le QRCode passé en paramètre
   */
  ajouterLiensContenus(qrcodeatomique) {

    var listeLiens = qrcodeatomique.getListeLiensDistants();
    var tailleListe = listeLiens.length;

    /** On ajoute tous les liens de QRCode passé en paramètre */
    for (var i = 0; i < tailleListe; i++) {
      this.ajouterLien(listeLiens[i][0], listeLiens[i][1]);
    }

  }

  /**
   * Ajoute dans la base le lien passé en paramètre
   */
  ajouterLien(url, nom) {
    /** On ajoute le lien que s'il n'est pas déjà contenu dans le QRCodemultiple */
    if (!this.__lienContenu(url)) {
      var noeud = document.createElement(DictionnaireXml.getTagFichier());
      noeud.setAttribute(DictionnaireXml.getAttUrlFichier(), url);
      this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].appendChild(noeud);
      super.ajouterFichier(url, nom)
    }
  }


  /**
   * Supprime de la base le lien passé en paramètre
   */
  supprimerLien(url) {
    var listeLiensMultiple = this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagFichier());
    for (var i = 0; i < listeLiensMultiple.length; i++) {
      if (listeLiensMultiple[i].getAttribute(DictionnaireXml.getAttUrlFichier()) == url) {
        this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].removeChild(listeLiensMultiple[i]);
      }

    }
  }

  /** Retourne le nombre de liens contenus dans le QRCodemultiple */
  getNbLiens() {
    return this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagFichier()).length;
  }

  /** Retourne l'url du lien contenu à l'indice passé en paramètre */
  getLien(indice) {
    if (indice < 0 || indice > this.getNbLiens() - 1) {
      throw "Aucun lien n'est contenu à cet indice (faire appel à getNbLiens() pour obtenir le nombre de liens contenus)";
    }
    return this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagFichier())[indice].getAttribute(DictionnaireXml.getAttUrlFichier());
  }

  /**
   * Vérifie si un lien est déjà contenu dans le QRCodemultiple
   */
  __lienContenu(url) {
    var listeLiensMultiple = this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagFichier());
    for (var j = 0; j < listeLiensMultiple.length; j++) {
      if (listeLiensMultiple[j].getAttribute(DictionnaireXml.getAttUrlFichier()) == url) {
        return true;
      }
    }
    return false;
  }

}

module.exports = {
  QRCodeMultiple
};

/**
 * Copyright © 12/02/2018, Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * The Software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders X be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the Software.
 * Except as contained in this notice, the name of the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
 */
