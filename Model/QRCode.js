/**
* Jules Leguy
* 2017
**/

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
    this.metadonnees.appendChild(document.createElement(DictionnaireXml.getTagEnsembleFichiers()));

  }

  //Permet de mettre toutes les données du QRCode dans l'état d'un QRCode existant
  setNoeudRacine(noeudRacine){
    this.racinexml = noeudRacine;
    this.donneesUtilisateur = noeudRacine.getElementsByTagName(DictionnaireXml.getTagDonneesUtilisateur())[0];
    this.metadonnees = noeudRacine.getElementsByTagName(DictionnaireXml.getTagMetaDonnees())[0];
  }

  /*
  * Renvoie les métadonnées contenues dans le QRCode sous la forme d'une chaîne de caractères
  * Utilisée pour générer l'image du QRCode
  */
  getMetadonnees(){
    return new XMLSerializer().serializeToString(this.metadonnees);
  }

  /*
  * Renvoie les données contenues dans le QRCode
  * Utilisée pour générer l'image du QRCode
  */
  getDonneesUtilisateur(){
    return new XMLSerializer().serializeToString(this.donneesUtilisateur);
  }


  getRacineXml(){
    return new XMLSerializer().serializeToString(this.racinexml);
  }

  //Setter du nom du QRCode (nom de l'onglet)
  setNomQRCode(nom){
    var noeudNom = document.createElement(DictionnaireXml.getTagNomQRCode());
    noeudNom.setAttribute(DictionnaireXml.getAttNomQRCode(), nom);
    this.metadonnees.appendChild(noeudNom);
  }

  //Renvoie le nom du QRCode (nom de l'onglet)
  getNomQRCode(){
    return this.metadonnees.getElementsByTagName(DictionnaireXml.getTagNomQRCode())[0].getAttribute(DictionnaireXml.getAttNomQRCode());
  }

  //Setter du texte central en braille
  setTexteBraille(texte){
    var noeud = document.createElement(DictionnaireXml.getTagTexteBraille());
    noeud.setAttribute(DictionnaireXml.getAttTexteBraille(), texte);
    this.metadonnees.append(noeud);
  }

  //Renvoie le texte central en braille
  getTexteBraille(){
    return this.metadonnees.getElementsByTagName(DictionnaireXml.getTagTexteBraille())[0].getAttribute(DictionnaireXml.getAttTexteBraille());
  }

  //Setter de la couleur du texte en braille
  setColorBraille(color){
    var noeud = document.createElement(DictionnaireXml.getTagColorBraille());
    noeud.setAttribute(DictionnaireXml.getAttCouleur(), color);
    this.metadonnees.appendChild(noeud);
  }

  //Renvoie la couleur du texte en braille
  getColorBraille(){
    return this.metadonnees.getElementsByTagName(DictionnaireXml.getTagColorBraille())[0].getAttribute(DictionnaireXml.getAttCouleur());
  }

  //Setter de la couleur du QRCode
  setColorQR(color){
    var noeud = document.createElement(DictionnaireXml.getTagColorQRCode());
    noeud.setAttribute(DictionnaireXml.getAttCouleur(), color);
    this.metadonnees.appendChild(noeud);
  }

  //Renvoie la couleur du QRCode
  getColorQRCode(){
    return this.metadonnees.getElementsByTagName(DictionnaireXml.getTagColorQRCode())[0].getAttribute(DictionnaireXml.getAttCouleur());
  }

  //Ajoute un fichier (couple url, nom) dans les metadonnees
  ajouterFichier(url, nom){
    var noeud = document.createElement(DictionnaireXml.getTagFichier());
    noeud.setAttribute(DictionnaireXml.getAttUrlFichier(), url);
    noeud.setAttribute(DictionnaireXml.getAttNomFichier(), nom);

    this.metadonnees.getElementsByTagName(DictionnaireXml.getTagEnsembleFichiers())[0].appendChild(noeud);
  }

  //Renvoie le nom du fichier sauvegardé dans le qrcode ayant pour url la chaîne passée en paramètres
  getNomFichier(url){

    var noeudsFichier = this.metadonnees.getElementsByTagName(DictionnaireXml.getTagEnsembleFichiers())[0].childNodes;

    //On itère sur tous les fichiers du qrcode
    for (var i=0; i<noeudsFichier.length; i++){
      var noeudFichier = noeudsFichier.item(i);

      //Si on trouve le fichier avec l'url passée en paramètre, on renvoie le nom du fichier
      if (noeudFichier.getAttribute(DictionnaireXml.getAttUrlFichier())==url){
        return noeudFichier.getAttribute(DictionnaireXml.getAttNomFichier());
      }
    }

    //On renvoie une exception si le fichier ayant cet id n'est pas présent dans le qrcode
    throw "Le fichier n'est pas présent dans le QRCode";
  }

  //Retourne la chaîne contenant le type de qrcode (atomique ou ensemble)
  getTypeQR(){
    return this.donneesUtilisateur.getAttribute(DictionnaireXml.getAttTypeQRCode());
  }

}
