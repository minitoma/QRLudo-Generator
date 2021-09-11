/**
 * @Author: alassane
 * @Date:   2018-11-09T18:42:04+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-11-14T11:30:09+01:00
 */



/**
 * Jules Leguy
 * 2017
 **/

const path = require('path');
// const root = path.dirname(require.main.filename);
const root = `${process.cwd()}/app`;
const {
  DictionnaireXml
} = require(`${root}/Model/DictionnaireXml`);
/*
 * Classe permettant de stocker et d'accéder au données contenues dans un QRCode
 */
class QRCode {


  //Constructeur d'un QRCode vide
  constructor() {

    //On crée les éléments racine XML des données et metadonnées
    this.donneesUtilisateur = document.createElement(DictionnaireXml.getTagDonneesUtilisateur());

    this.metadonnees = document.createElement(DictionnaireXml.getTagMetaDonnees());

    this.racinexml = document.createElement(DictionnaireXml.getTagRacine());
    this.racinexml.appendChild(this.donneesUtilisateur);
    this.racinexml.appendChild(this.metadonnees);

    //On ajoute le noeud contenu au noeud donnees
    this.donneesUtilisateur.appendChild(document.createElement(DictionnaireXml.getTagContenu()));

    //On ajoute le noeud fichiers aux metadonnees
    this.metadonnees.appendChild(document.createElement(DictionnaireXml.getTagMultipleFichiers()));

  }

  //Permet de mettre toutes les données du QRCode dans l'état d'un QRCode existant
  setNoeudRacine(noeudRacine) {
    this.racinexml = noeudRacine;
    this.donneesUtilisateur = noeudRacine.getElementsByTagName(DictionnaireXml.getTagDonneesUtilisateur())[0];
    this.metadonnees = noeudRacine.getElementsByTagName(DictionnaireXml.getTagMetaDonnees())[0];
  }

  /*
   * Renvoie les métadonnées contenues dans le QRCode sous la forme d'une chaîne de caractères
   * Utilisée pour générer l'image du QRCode
   */
  getMetadonnees() {
    return new XMLSerializer().serializeToString(this.metadonnees);
  }

  /*
   * Renvoie les données contenues dans le QRCode
   * Utilisée pour générer l'image du QRCode
   */
  getDonneesUtilisateur() {
    return new XMLSerializer().serializeToString(this.donneesUtilisateur);
  }


  getRacineXml() {
    return new XMLSerializer().serializeToString(this.racinexml);
  }

  //Setter du nom du QRCode (nom de l'onglet)
  setNomQRCode(nom) {
    var noeudNom = document.createElement(DictionnaireXml.getTagNomQRCode());
    noeudNom.setAttribute(DictionnaireXml.getAttNomQRCode(), nom);
    this.metadonnees.appendChild(noeudNom);
  }

  //Renvoie le nom du QRCode (nom de l'onglet)
  getNomQRCode() {
    return this.metadonnees.getElementsByTagName(DictionnaireXml.getTagNomQRCode())[0].getAttribute(DictionnaireXml.getAttNomQRCode());
  }

  //Setter du texte central en braille
  setTexteBraille(texte) {
    var noeud = document.createElement(DictionnaireXml.getTagTexteBraille());
    noeud.setAttribute(DictionnaireXml.getAttTexteBraille(), texte);
    this.metadonnees.append(noeud);
  }

  //Renvoie le texte central en braille
  getTexteBraille() {
    return this.metadonnees.getElementsByTagName(DictionnaireXml.getTagTexteBraille())[0].getAttribute(DictionnaireXml.getAttTexteBraille());
  }

  //Setter de la couleur du texte en braille
  setColorBraille(color) {
    var noeud = document.createElement(DictionnaireXml.getTagColorBraille());
    noeud.setAttribute(DictionnaireXml.getAttCouleur(), color);
    this.metadonnees.appendChild(noeud);
  }

  //Renvoie la couleur du texte en braille
  getColorBraille() {
    return this.metadonnees.getElementsByTagName(DictionnaireXml.getTagColorBraille())[0].getAttribute(DictionnaireXml.getAttCouleur());
  }

  //Setter de la couleur du QRCode
  setColorQR(color) {
    var noeud = document.createElement(DictionnaireXml.getTagColorQRCode());
    noeud.setAttribute(DictionnaireXml.getAttCouleur(), color);
    this.metadonnees.appendChild(noeud);
  }

  //Renvoie la couleur du QRCode
  getColorQRCode() {
    return this.metadonnees.getElementsByTagName(DictionnaireXml.getTagColorQRCode())[0].getAttribute(DictionnaireXml.getAttCouleur());
  }

  //Ajoute un fichier (couple url, nom) dans les metadonnees
  ajouterFichier(url, nom) {
    var noeud = document.createElement(DictionnaireXml.getTagFichier());
    noeud.setAttribute(DictionnaireXml.getAttUrlFichier(), url);
    noeud.setAttribute(DictionnaireXml.getAttNomFichier(), nom);

    this.metadonnees.getElementsByTagName(DictionnaireXml.getTagMultipleFichiers())[0].appendChild(noeud);
  }

  //Renvoie le nom du fichier sauvegardé dans le qrcode ayant pour url la chaîne passée en paramètres
  getNomFichier(url) {

    var noeudsFichier = this.metadonnees.getElementsByTagName(DictionnaireXml.getTagMultipleFichiers())[0].childNodes;

    //On itère sur tous les fichiers du qrcode
    for (var i = 0; i < noeudsFichier.length; i++) {
      var noeudFichier = noeudsFichier.item(i);

      //Si on trouve le fichier avec l'url passée en paramètre, on renvoie le nom du fichier
      if (noeudFichier.getAttribute(DictionnaireXml.getAttUrlFichier()) == url) {
        return noeudFichier.getAttribute(DictionnaireXml.getAttNomFichier());
      }
    }

    //On renvoie une exception si le fichier ayant cet id n'est pas présent dans le qrcode
    throw "Le fichier n'est pas présent dans le QRCode";
  }

  //Retourne la chaîne contenant le type de qrcode (atomique ou multiple)
  getTypeQR() {
    console.log("okfef");
    return this.donneesUtilisateur.getAttribute(DictionnaireXml.getAttTypeQRCode());
  }

}

module.exports = {
  QRCode
};

/**
 * Copyright © 12/02/2018, Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * The Software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders X be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the Software.
 * Except as contained in this notice, the name of the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
 */
