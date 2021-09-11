/**
 * @Author: alassane
 * @Date:   2018-11-09T18:42:04+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-11-14T11:32:38+01:00
 */



/**
 * Jules Leguy
 * 2017
 **/
const path = require('path');
const root = `${process.cwd()}/app`;
const {
  QRCode
} = require(`${root}/Model/QRCode`);
const {
  DictionnaireXml
} = require(`${root}/Model/DictionnaireXml`);
/**
 * Classe permettant de stocker et d'accéder aux données contenues dans un QRCode de type atomique
 */
class QRCodeAtomique extends QRCode {

  //Constructeur d'un QRCodeAtomique vide
  constructor() {
    super();

    //On enregistre le type de qrcode comme attribut du noeud donneesUtilisateur
    this.donneesUtilisateur.setAttribute(DictionnaireXml.getAttTypeQRCode(), DictionnaireXml.getValTypeAtomique());

  }

  /*
   * Ajoute l'url du fichier dans le QRCode Atomique.
   * Fait aussi appel à la méthode ajouterFichier de la superclasse pour enregistrer le nom du fichier
   */
  ajouterFichier(url, nom) {
    var noeud = document.createElement(DictionnaireXml.getTagFichier());
    noeud.setAttribute(DictionnaireXml.getAttUrlFichier(), url);
    this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].appendChild(noeud);
    super.ajouterFichier(url, nom);
  }

  /*
   * Ajoute le texte passé en paramètre dans le QRCode Atomique
   */
  ajouterTexte(texte) {
    var noeud = document.createElement(DictionnaireXml.getTagTexte());
    noeud.textContent = texte;
    this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].appendChild(noeud);
  }



  /*
   * Supprime l'élément (texte ou fichier) contenu à l'indice passé en paramètre
   */
  supprimerContenu(indice) {
    this.testIndiceContenuCorrect(indice); //On vérifie que le l'indice correspond à celui d'un élément
    var listeContenu = this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0];
    listeContenu.removeChild(listeContenu.childNodes[indice]);
  }


  /*
   * Renvoie le nombre d'éléments contenus dans le QRCode
   */
  getTailleContenu() {
    return this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].childNodes.length;
  }

  /*
   * Renvoie le type de l'élément (texte ou fichier) contenu à l'indice passé en paramètre
   */
  getTypeContenu(indice) {
    this.testIndiceContenuCorrect(indice); //On vérifie que le l'indice correspond à celui d'une élément
    return this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].childNodes[indice].nodeName.toLowerCase();
  }

  /*
   * Renvoie le texte contenu à l'indice passé en paramètre
   */
  getTexte(indice) {
    this.testIndiceContenuCorrect(indice);


    if (this.getTypeContenu(indice) == DictionnaireXml.getTagTexte()) {
      return this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].childNodes[indice].textContent;
    } else {
      throw "L'élément demandé n'est pas un texte";
    }
  }

  /*
   * Renvoie l'url du fichier contenu à l'indice passé en paramètre
   */
  getUrlFichier(indice) {
    this.testIndiceContenuCorrect(indice);

    if (this.getTypeContenu(indice) == DictionnaireXml.getTagFichier()) {
      return this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].childNodes[indice].getAttribute(DictionnaireXml.getAttUrlFichier());
    } else {
      throw "L'élément demandé n'est pas un fichier";
    }
  }

  /*
   * Inverse l'ordre de deux éléments contenus dans le QRCode à partir de leurs indices
   */
  inverserOrdreContenu(ind1, ind2) {

    //On vérifie que les indices passés en paramètre correspondent à des éléments
    this.testIndiceContenuCorrect(ind1);
    this.testIndiceContenuCorrect(ind2);

    //On récupère la liste du contenu du qrcode
    var listeContenu = this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].childNodes;

    //On clone les noeuds concernés puis on copie leur contenu
    var tmp1 = listeContenu[ind1].cloneNode();
    var tmp2 = listeContenu[ind2].cloneNode();
    tmp1.innerHTML = listeContenu[ind1].innerHTML;
    tmp2.innerHTML = listeContenu[ind2].innerHTML;

    //On remplace les deux noeuds par leur nouvelle valeur
    this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].replaceChild(tmp2, listeContenu[ind1]);
    this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].replaceChild(tmp1, listeContenu[ind2]);

  }


  /*
   * Renvoie vrai si le QRCode appartient à une famille
   */
  appartientFamille() {
    return this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagFamille()).length != 0;
  }

  /*
   * Supprime les données concernant la famille du QRCode
   */
  supprimerDeLaFamille() {
    if (this.appartientFamille()) {
      this.donneesUtilisateur.removeChild(this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagFamille())[0]);
    } else {
      throw "Suppression de la famille impossible : le QRCode n'appartient à aucune famille";
    }
  }

  /*
   * Renvoie le nom de la famille à laquelle appartient ce QRCode Atomique
   */
  getNomFamille() {
    if (this.appartientFamille()) {
      return this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagFamille())[0].getAttribute(DictionnaireXml.getAttNomFamille());
    } else {
      throw "Récupération du nom de famille impossible : le QRCode n'appartient à aucune famille";
    }
  }

  /*
   * Ajoute le QRCode dans une nouvelle famille avec l'ordre indiqué
   */
  ajouterAFamille(nom, ordre) {
    if (this.appartientFamille()) {
      this.supprimerDeLaFamille();
    }

    var noeud = document.createElement(DictionnaireXml.getTagFamille());
    noeud.setAttribute(DictionnaireXml.getAttNomFamille(), nom);
    noeud.setAttribute(DictionnaireXml.getAttOrdreFamille(), ordre);
    this.donneesUtilisateur.appendChild(noeud);

  }

  /*
   * Renvoie l'ordre du QRCode dans sa famille
   */
  getOrdreFamille() {
    if (this.appartientFamille()) {
      return parseInt(this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagFamille())[0].getAttribute(DictionnaireXml.getAttOrdreFamille()));
    } else {
      throw "Récupération de l'ordre dans la famille impossible : Le QRCode n'appartient à aucune famille";
    }
  }

  /*
   * Renvoie la liste des liens distants contenus dans les données de ce QRCode Atomique
   */
  getListeLiensDistants() {
    var liste = new Array();
    var noeudsFichiers = this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].getElementsByTagName(DictionnaireXml.getTagFichier());
    var nbLiens = noeudsFichiers.length;

    for (var i = 0; i < nbLiens; i++) {
      var noeud = noeudsFichiers[i];

      var url = noeud.getAttribute(DictionnaireXml.getAttUrlFichier());
      var nom = super.getNomFichier(url);

      var couple = new Array();
      couple.push(url);
      couple.push(nom);

      liste.push(couple);
    }

    return liste;
  }


  /*
   * Vérifie si un indice passé en paramètre correspond à celui d'un élément stocké dans le QRCode
   */
  testIndiceContenuCorrect(indice) {
    if (indice < 0 || indice >= this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].childNodes.length) {
      throw "L'indice ne correspod pas à celui d'une donnée contenue dans le QRCode";
    }
  }

}

module.exports = {
  QRCodeAtomique
};

/**
 * Copyright © 12/02/2018, Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * The Software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders X be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the Software.
 * Except as contained in this notice, the name of the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
 */
