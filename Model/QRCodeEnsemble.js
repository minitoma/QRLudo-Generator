/*
*Classe permettant de stocker et d'accéder au données contenues dans un QRCode de type Ensemble
*/

class QRCodeEnsemble extends QRCode{

    constructor() {
      super();
      alert("Passage dans le constructeur de QRCodeEnsemble");
    }

    /*
    * Ajoute dans la base tous les liens contenus dans le QRCode passé en paramètre
    */
    ajouterLiensContenus(QrCodeAtomique){
      //Utilise la fonction getListeLiensDistants de QRCodeAtomique
      //Doit vérifier s'il y a des doublons
    }

    /*
    * Ajoute dans la base le lien passé en paramètre
    */
    ajouterLien(String){
      //Doit vérifier si le lien n'est pas déjà présent
    }

    /*
    * Supprime de la base tous les liens contenus dans le QRCode passé en paramètre
    */
    supprimerLiensContenus(QRCodeAtomique){

    }

    /*
    * Supprime de la base le lien passé en paramètre
    */
    supprimerLien(String){

    }

}
