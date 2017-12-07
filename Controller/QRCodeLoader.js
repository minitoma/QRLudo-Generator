/**
* Jules Leguy
* 2017
**/

/*
* Permet de créer un objet QRCode à partir d'une image QRCode ou d'instancier un tableau contenant les objets QRCodes obtenus à partir d'une image enregistrant une famille de QRCodes
*/
class QRCodeLoader{


  //Renvoie le QRCode crée à partir des informations du fichier image passé en paramètre
  static loadImage(file, callback){

    var qrcode;
    var fileReader = new FileReader();

    fileReader.readAsDataURL(file);

    // `onload` as listener
    fileReader.addEventListener('load', function (ev) {
      console.log("dataUrlSize:", ev.target.result.length);


      qrcode = QRCodeLoader.__traiterImage(ev.target.result);

      if (qrcode.getTypeQR()==DictionnaireXml.getValTypeAtomique() && qrcode.appartientFamille()){
        alert("Les QR Codes appartenant a une famille ne peuvent pas être chargés séparément. Merci de charger l'image de la famille complète.");
        return;
      }

      // renvoyer le qrcode créé avec la méthode en conséquence pour recréer la vue
      if (callback){
        if (Array.isArray(qrcode)) {
          callback(qrcode, drawQRCodeFamille);
        } else {
          callback(qrcode, drawQRCodeAtomique);
        }
      }
    });

  }


  /*
  * Lit le contenu des métadonnées de l'image passée en paramètre et détecte s'il s'agit d'un qrcode ou d'une famille de qrcodes, puis fait l'appel à la sous fonction en conséquence
  */
  static __traiterImage(data){
    //On récupère les données exif de l'image
    var exifObj = piexif.load(data);
    var dataUtf8 = exifObj["0th"][700];

    if (!dataUtf8){
      throw "L'image est invalide (ne contient pas de métadonnées)";
    }

    //On convertit les données en chaîne de caractères
    var donnees = QRCodeLoader.bin2String(dataUtf8);


    //On convertit la chaine xml en données xml
    var qrxml = new window.DOMParser().parseFromString(donnees, "text/xml")

    //On vérifie qu'on a bien réussi à parser le xml
    if(!qrxml){
      throw "L'image est invalide (xml incorrect)";
    }

    var nomPremierNoeud = qrxml.firstChild.nodeName;

    if (nomPremierNoeud=="qrcode"){
      return QRCodeLoader.__creerQRCode(qrxml.firstChild);
    }
    else if (nomPremierNoeud=="qrcodesfamille"){
      console.log("test:"+qrxml.getElementsByTagName(DictionnaireXml.getTagRacine()));
      return QRCodeLoader.__creerFamilleQRCodes(qrxml);
    }

  }

  /*
  * Crée et renvoie un tableau de qrcodes d'une même famille issus d'une image conteneur famille
  */
  static __creerFamilleQRCodes(xmlNode){

    var listeFamille = new Array();


    var listeFamilleXml = xmlNode.getElementsByTagName(DictionnaireXml.getTagRacine());


    for (var i=0; i<listeFamilleXml.length; i++){
      listeFamille.push(QRCodeLoader.__creerQRCode(listeFamilleXml[i]));
    }

    return listeFamille;
  }

  //On crée un objet QRCode à partir des données reconstituées
  static __creerQRCode(xmlNode){

    //On lit le type de QRCode contenu dans l'image
    var typeQRCode= xmlNode.getElementsByTagName(DictionnaireXml.getTagDonneesUtilisateur())[0].getAttribute(DictionnaireXml.getAttTypeQRCode());

    //On vérifie que le xml est bien formé (qu'il possède un noeud donneesUtilisateur et un noeud metadonnees)
    if (!xmlNode.getElementsByTagName(DictionnaireXml.getTagDonneesUtilisateur()[0]) || !xmlNode.getElementsByTagName(DictionnaireXml.getTagMetaDonnees()[0])){
      throw "L'image est invalide (xml incorrect)";
    }


    //On instancie un objet QRCode du bon type
    var qrcode;
    switch(typeQRCode){
      case DictionnaireXml.getValTypeAtomique():
        qrcode = new QRCodeAtomique();
        qrcode.setNoeudRacine(xmlNode);
        break;
      case DictionnaireXml.getValTypeEnsemble():
        qrcode = new QRCodeEnsemble();
        qrcode.setNoeudRacine(xmlNode);
        break;
      default:
        throw "L'image est invalide (le type de QRCode n'est pas reconnu)";
        break;
    }

    return qrcode;

  }


  //Convertit un tableau d'entiers en chaîne de caractères
  static bin2String(array){
    var result = "";
    for (var i = 0; i < array.length; i++) {
      result += String.fromCharCode(array[i]);
    }
    return result;
  }


}
