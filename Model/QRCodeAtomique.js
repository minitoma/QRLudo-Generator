class QRCodeAtomique extends QRCode{

    constructor() {
      super();

      //On ajoute le noeud contenu au noeud donnees
      this.donnees.appendChild(document.createElement("contenu"));
    }

    /*
    * Ajoute le nom et l'url du fichier dans le QRCode Atomique
    */
    ajouterFichier(url, nom){
      var noeud = document.createElement("fichier")
      noeud.setAttribute("nom", nom);
      noeud.setAttribute("url", url);
      this.donnees.getElementsByTagName("contenu")[0].appendChild(noeud);
    }

    /*
    * Ajoute le texte passé en paramètre dans le QRCode Atomique
    */
    ajouterTexte(texte){
      var noeud = document.createElement("texte");
      noeud.textContent = texte;
      this.donnees.getElementsByTagName("contenu")[0].appendChild(noeud);
    }

    /*
    * Renvoie vrai si le QRCode appartient à une famille
    */
    appartientFamille(){
      return this.donnees.getElementsByTagName("famille").length!=0;
    }

    /*
    * Supprime les données concernant la famille du QRCode
    */
    supprimerDeLaFamille(){
      if (this.appartientFamille()){
        this.donnees.removeChild(this.donnees.getElementsByTagName("famille")[0]);
      }
      else{
        throw "Suppression de la famille impossible : le QRCode n'appartient à aucune famille";
      }
    }

    /*
    * Renvoie le nom de la famille à laquelle appartient ce QRCode Atomique
    */
    getNomFamille(){
      if (this.appartientFamille()){
        return this.donnees.getElementsByTagName("famille")[0].getAttribute("nom");
      }
      else{
        throw "Récupération du nom de famille impossible : le QRCode n'appartient à aucune famille";
      }
    }

    /*
    * Ajoute le QRCode dans une nouvelle famille avec l'ordre indiqué
    */
    ajouterAFamille(nom, ordre){
      if (this.appartientFamille()){
        throw "Le QRCode appartient déjà à une famille. Il faut appeler supprimerDeLaFamille() avant de l'ajouter dans une nouvelle famille.";
      }
      else{
        var noeud = document.createElement("famille");
        noeud.setAttribute("nom", nom);
        noeud.setAttribute("ordre", ordre);
        this.donnees.appendChild(noeud);
      }

    }

    /*
    * Renvoie l'ordre du QRCode dans sa famille
    */
    getOrdreFamille(){
      if (this.appartientFamille()){
        return this.donnees.getElementsByTagName("famille")[0].getAttribute("ordre");
      }
      else{
        throw "Récupération de l'ordre dans la famille impossible : Le QRCode n'appartient à aucune famille";
      }
    }

    /*
    * Renvoie la liste des liens distants contenus dans les données de ce QRCode Atomique
    */
    getListeLiensDistants(){
      var liste = new Array();
      var noeudsFichiers = this.donnees.getElementsByTagName("contenu")[0].getElementsByTagName("fichier");
      var nbLiens = noeudsFichiers.length;

      for (var i=0; i<nbLiens; i++){
          var noeud = noeudsFichiers[i];
          liste.push(noeud.getAttribute("url"));
      }

      return liste;
    }

    /*
    * Inverse l'ordre de deux éléments contenus dans le QRCode à partir de leurs indices
    */
    inverserOrdreContenu(ind1, ind2){
      var listeContenu = this.donnees.getElementsByTagName("contenu")[0].childNodes;
      var size = listeContenu.length;


      if (ind1<0 || ind2<0 || ind1>=size || ind2>=size){
        throw "Au moins un des deux indices ne correspond pas à un élément";
      }
      else{
        var tmp1 = listeContenu[ind1].cloneNode();
        var tmp2 = listeContenu[ind2].cloneNode();

        this.donnees.getElementsByTagName("contenu")[0].replaceChild(tmp2, listeContenu[ind1]);
        this.donnees.getElementsByTagName("contenu")[0].replaceChild(tmp1, listeContenu[ind2]);
      }
    }

}
