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
    * Supprime l'élément (texte ou fichier) contenu à l'indice passé en paramètre
    */
    supprimerContenu(indice){
      this.testIndiceContenuCorrect(indice); //On vérifie que le l'indice correspond à celui d'un élément
      var listeContenu = this.donnees.getElementsByTagName("contenu")[0];
      listeContenu.removeChild(listeContenu.childNodes[indice]);
    }

    /*
    * Renvoie le nombre d'éléments contenus dans le QRCode
    */
    getTailleContenu(){
      return this.donnees.getElementsByTagName("contenu")[0].childNodes.length;
    }

    /*
    * Renvoie le type de l'élément (texte ou fichier) contenu à l'indice passé en paramètre
    */
    getTypeContenu(indice){
      this.testIndiceContenuCorrect(indice); //On vérifie que le l'indice correspond à celui d'une élément
      return this.donnees.getElementsByTagName("contenu")[0].childNodes[indice].nodeName;
    }

    /*
    * Renvoie le texte contenu à l'indice passé en paramètre
    */
    getTexte(indice){
      this.testIndiceContenuCorrect(indice);


      if (this.getTypeContenu(indice)=="TEXTE"){
        return this.donnees.getElementsByTagName("contenu")[0].childNodes[indice].textContent;
      }
      else{
        throw "L'élément demandé n'est pas un texte";
      }
    }

    /*
    * Renvoie le nom du fichier contenu à l'indice passé en paramètre
    */
    getNomFichier(indice){
      this.testIndiceContenuCorrect(indice);

      if (this.getTypeContenu(indice)=="FICHIER"){
        return this.donnees.getElementsByTagName("contenu")[0].childNodes[indice].getAttribute("nom");
      }
      else{
        throw "L'élément demandé n'est pas un fichier";
      }
    }

    /*
    * Renvoie l'url du fichier contenu à l'indice passé en paramètre
    */
    getUrlFichier(indice){
      this.testIndiceContenuCorrect(indice);

      if (this.getTypeContenu(indice)=="FICHIER"){
        return this.donnees.getElementsByTagName("contenu")[0].childNodes[indice].getAttribute("url");
      }
      else{
        throw "L'élément demandé n'est pas un fichier";
      }
    }

    /*
    * Inverse l'ordre de deux éléments contenus dans le QRCode à partir de leurs indices
    */
    inverserOrdreContenu(ind1, ind2){

      //On vérifie que les indices passés en paramètre correspondent à des éléments
      this.testIndiceContenuCorrect(ind1);
      this.testIndiceContenuCorrect(ind2);

      var listeContenu = this.donnees.getElementsByTagName("contenu")[0].childNodes;


      var tmp1 = listeContenu[ind1].cloneNode();
      var tmp2 = listeContenu[ind2].cloneNode();

      this.donnees.getElementsByTagName("contenu")[0].replaceChild(tmp2, listeContenu[ind1]);
      this.donnees.getElementsByTagName("contenu")[0].replaceChild(tmp1, listeContenu[ind2]);

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
    * Vérifie si un indice passé en paramètre correspond à celui d'un élément stocké dans le QRCode
    */
    testIndiceContenuCorrect(indice){
      if (indice<0 || indice>=this.donnees.getElementsByTagName("contenu")[0].childNodes.length){
        throw "L'indice ne correspod pas à celui d'une donnée contenue dans le QRCode";
      }
    }

    // copier le contenu d'un element input
        copyInputContent(input) {
          // tester s'il s'agit d'un input de musique
          if(input.disabled) {
            var url = 'https://drive.google.com/open?id=' + input.id;
            this.ajouterFichier(url, input.value);
          } else {
            this.ajouterTexte(input.value);
          }
        }


        // copier le contenu d'un element legende
        copyLegendeContent(legende) {
          this.ajouterTexte(legende.textContent);
        }

}
