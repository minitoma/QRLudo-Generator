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
    return this.donneesUtilisateur;
  }


  getRacineXml(){
    return new XMLSerializer().serializeToString(this.racinexml);
  }

  setNomQRCode(nom){
    var noeudNom = document.createElement(DictionnaireXml.getTagNomQRCode());
    noeudNom.setAttribute(DictionnaireXml.getAttNomQRCode(), nom);
    this.metadonnees.appendChild(noeudNom);
  }

  getNomQRCode(){
    return this.metadonnees.getElementsByTagName(DictionnaireXml.getTagNomQRCode())[0].getAttribute(DictionnaireXml.getAttNomQRCode());
  }

}
