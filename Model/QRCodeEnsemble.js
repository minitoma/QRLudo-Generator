/*
*Classe permettant de stocker et d'accéder au données contenues dans un QRCode de type Ensemble
*/

class QRCodeEnsemble extends QRCode{

    constructor() {
      super();

      //On enregistre le type de qrcode comme attribut du noeud donneesUtilisateur
      this.donneesUtilisateur.setAttribute(DictionnaireXml.getAttTypeQRCode(), DictionnaireXml.getValTypeEnsemble());
    }

    /*
    * Ajoute dans la base tous les liens contenus dans le QRCode passé en paramètre
    */
    ajouterLiensContenus(qrcodeatomique){

      var listeLiens = qrcodeatomique.getListeLiensDistants();
      var tailleListe = listeLiens.length;

      //On ajoute tous les liens de QRCode passé en paramètre
      for (var i=0; i<tailleListe; i++){
        this.ajouterLien(listeLiens[i][0], listeLiens[i][1]);
      }

    }

    /*
    * Ajoute dans la base le lien passé en paramètre
    */
    ajouterLien(url, nom){
      //On ajoute le lien que s'il n'est pas déjà contenu dans le QRCodeEnsemble
      if (!this.__lienContenu(url)){
        var noeud = document.createElement(DictionnaireXml.getTagFichier());
        noeud.setAttribute(DictionnaireXml.getAttUrlFichier(), url);
        this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].appendChild(noeud);
        super.ajouterFichier(url, nom)
      }
    }


    /*
    * Supprime de la base le lien passé en paramètre
    */
    supprimerLien(url){
      var listeLiensEnsemble = this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagFichier());
      for (var i=0; i<listeLiensEnsemble.length; i++){

        if (listeLiensEnsemble[i].getAttribute(DictionnaireXml.getAttUrlFichier())==url){
          this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].removeChild(listeLiensEnsemble[i]);
        }

      }
    }

    //Retourne le nombre de liens contenus dans le QRCodeEnsemble
    getNbLiens(){
      return this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagFichier()).length;
    }

    //Retourne l'url du lien contenu à l'indice passé en paramètre
    getLien(indice){
      if (indice<0 || indice>this.getNbLiens()-1){
        throw "Aucun lien n'est contenu à cet indice (faire appel à getNbLiens() pour obtenir le nombre de liens contenus)";
      }
      return this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagFichier())[indice].getAttribute(DictionnaireXml.getAttUrlFichier());
    }

    /*
    * Vérifie si un lien est déjà contenu dans le QRCodeEnsemble
    */
    __lienContenu(url){
      var listeLiensEnsemble = this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagFichier());
      for (var j=0; j<listeLiensEnsemble.length; j++){
        if (listeLiensEnsemble[j].getAttribute(DictionnaireXml.getAttUrlFichier())==url){
          return true;
        }
      }

      return false;
    }

}
