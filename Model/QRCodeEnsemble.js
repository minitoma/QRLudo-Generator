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

    }

    /*
    * Ajoute dans la base le lien passé en paramètre
    */
    ajouterLien(String){

    }

    /*
    * Supprime de la base tous les liens contenus dans le QRCode passé en paramètre
    */
    supprimerLiensContenus(QRCode){

    }

    /*
    * Supprime de la base le lien passé en paramètre
    */
    supprimerLien(String){

    }

    /*
    * Renvoie les données contenues dans le QRCode Ensemble
    */
    getDonnees(){

    }
}
