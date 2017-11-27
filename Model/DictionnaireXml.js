/*s
* Classe stockant les chaines de caractères des tags et attributs pouvant être contenus dans le xml représentant un QRCode
* Permet de changer globalement la chaîne représentant un tag ou un attribut
*/
class DictionnaireXml{


  //Noeuds
  static getTagRacine(){
    return "qrcode";
  }

  static getTagMetaDonnees(){
    return "metadonnees";
  }

  static getTagDonneesUtilisateur(){
    return "donneesutilisateur";
  }

  static getTagContenu(){
    return "contenu";
  }

  static getTagFichier(){
    return "fichier";
  }

  static getTagTexte(){
    return "texte";
  }

  static getTagTextearea(){
    return "textarea";
  }

  static getTagFamille(){
    return "famille";
  }

  static getTagColor () {
    return "color";
  }



  //Attributs
  static getAttTypeQRCode(){
    return "type";
  }

  static getValTypeAtomique(){
    return "atomique";
  }

  static getValTypeEnsemble(){
    return "ensemble";
  }

  static getAttNomFichier(){
    return "nom";
  }

  static getAttUrlFichier(){
    return "url";
  }

  static getAttNomFamille(){
    return "nom";
  }

  static getAttOrdreFamille(){
    return "ordre";
  }

  static getAttNomQRCode(){
    return "valeur";
  }




}
