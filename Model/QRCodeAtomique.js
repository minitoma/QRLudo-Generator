class QRCodeAtomique extends QRCode{

    //Constructeur d'un QRCodeAtomique vide
    constructor() {
      super();

      //On enregistre le type de qrcode comme attribut du noeud donneesUtilisateur
      this.donneesUtilisateur.setAttribute(DictionnaireXml.getAttTypeQRCode(), DictionnaireXml.getValTypeAtomique());

    }

    /*
    * Ajoute le nom et l'url du fichier dans le QRCode Atomique
    */
    ajouterFichier(url, nom){
      var noeud = document.createElement(DictionnaireXml.getTagFichier());
      noeud.setAttribute(DictionnaireXml.getAttNomFichier(), nom);
      noeud.setAttribute(DictionnaireXml.getAttUrlFichier(), url);
      this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].appendChild(noeud);
    }

    /*
    * Ajoute le texte passé en paramètre dans le QRCode Atomique
    */
    ajouterTexte(texte){
      var noeud = document.createElement(DictionnaireXml.getTagTexte());
      noeud.textContent = texte;
      this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].appendChild(noeud);
    }



    /*
    * Supprime l'élément (texte ou fichier) contenu à l'indice passé en paramètre
    */
    supprimerContenu(indice){
      this.testIndiceContenuCorrect(indice); //On vérifie que le l'indice correspond à celui d'un élément
      var listeContenu = this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0];
      listeContenu.removeChild(listeContenu.childNodes[indice]);
    }


    /*
    * Renvoie le nombre d'éléments contenus dans le QRCode
    */
    getTailleContenu(){
      return this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].childNodes.length;
    }

    /*
    * Renvoie le type de l'élément (texte ou fichier) contenu à l'indice passé en paramètre
    */
    getTypeContenu(indice){
      this.testIndiceContenuCorrect(indice); //On vérifie que le l'indice correspond à celui d'une élément
      return this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].childNodes[indice].nodeName.toLowerCase();
    }

    /*
    * Renvoie le texte contenu à l'indice passé en paramètre
    */
    getTexte(indice){
      this.testIndiceContenuCorrect(indice);


      if (this.getTypeContenu(indice)==DictionnaireXml.getTagTexte()){
        return this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].childNodes[indice].textContent;
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

      if (this.getTypeContenu(indice)==DictionnaireXml.getTagFichier()){
        return this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].childNodes[indice].getAttribute(DictionnaireXml.getAttNomFichier());
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

      if (this.getTypeContenu(indice)==DictionnaireXml.getTagFichier()){
        return this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].childNodes[indice].getAttribute(DictionnaireXml.getAttUrlFichier());
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

      //On récupère la liste du contenu du qrcode
      var listeContenu = this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].childNodes;

      //On clone les noeuds concernés puis on copie leur contenu
      var tmp1 = listeContenu[ind1].cloneNode();
      var tmp2 = listeContenu[ind2].cloneNode();
      tmp1.innerHTML = listeContenu[ind1].innerHTML;
      tmp2.innerHTML = listeContenu[ind2].innerHTML;

      //On remplace les deux noeuds par leur nouvelle valeur
      this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].replaceChild(tmp2, listeContenu[ind1]);
      this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].replaceChild(tmp1, listeContenu[ind2]);

    }


    /*
    * Renvoie vrai si le QRCode appartient à une famille
    */
    appartientFamille(){
      return this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagFamille()).length!=0;
    }

    /*
    * Supprime les données concernant la famille du QRCode
    */
    supprimerDeLaFamille(){
      if (this.appartientFamille()){
        this.donneesUtilisateur.removeChild(this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagFamille())[0]);
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
        return this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagFamille())[0].getAttribute(DictionnaireXml.getAttNomFamille());
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
        var noeud = document.createElement(DictionnaireXml.getTagFamille());
        noeud.setAttribute(DictionnaireXml.getAttNomFamille(), nom);
        noeud.setAttribute(DictionnaireXml.getAttOrdreFamille(), ordre);
        this.donneesUtilisateur.appendChild(noeud);
      }

    }

    /*
    * Renvoie l'ordre du QRCode dans sa famille
    */
    getOrdreFamille(){
      if (this.appartientFamille()){
        return parseInt(this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagFamille())[0].getAttribute(DictionnaireXml.getAttOrdreFamille()));
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
      var noeudsFichiers = this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].getElementsByTagName(DictionnaireXml.getTagFichier());
      var nbLiens = noeudsFichiers.length;

      for (var i=0; i<nbLiens; i++){
          var noeud = noeudsFichiers[i];
          liste.push(noeud.getAttribute(DictionnaireXml.getAttUrlFichier()));
      }

      return liste;
    }


    /*
    * Vérifie si un indice passé en paramètre correspond à celui d'un élément stocké dans le QRCode
    */
    testIndiceContenuCorrect(indice){
      if (indice<0 || indice>=this.donneesUtilisateur.getElementsByTagName(DictionnaireXml.getTagContenu())[0].childNodes.length){
        throw "L'indice ne correspod pas à celui d'une donnée contenue dans le QRCode";
      }
    }


}
