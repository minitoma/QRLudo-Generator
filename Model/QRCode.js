/*
* Classe permettant de stocker et d'accéder au données contenues dans un QRCode
*/
class QRCode {



  constructor() {

    //On crée les éléments racine XML des données et metadonnées
    this.donnees = document.createElement("donnees");
    this.metadonnees = document.createElement("metadonnees");

    //On supprime les attributs xmlns pour économiser des données
    this.donnees.removeAttribute("xmlns");
    this.metadonnees.removeAttribute("xmlns");
  }


  /*
  * Renvoie les métadonnées contenues dans le QRCode sous la forme d'une chaîne de caractères
  * Utilisée pour générer l'image du QRCode
  */
  getMetadonnees(){
    return new XMLSerializer().serializeToString(this.metadonnees);
  }


  /*
  * Renvoie les données contenues dans le QRCode sous la forme d'une chaîne de caractères
  * Utilisée pour générer l'image du QRCode
  */
  getDonnees(){
    return new XMLSerializer().serializeToString(this.donnees);
  }

}
