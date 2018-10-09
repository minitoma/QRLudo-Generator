/**
* Jules Leguy
* 2017
**/

/**
* Classe permettant de générer les images de QR Codes et les images de sauvegarde des familles de QRCodes en insérant les métadonnées adéquates
*/
class ImageGenerator{

  constructor(compresseur){
    this.compresseur = compresseur;
  }

  /*
  * Génère l'image du QRCode passé en paramètre dans le div dont l'id est passé en paramètre
  */
  genererQRCode(div, qrcode){

     var jq = window.jQuery;
     var size = 450;

     var donneesQR = this.compresseur.compresser(qrcode.getDonneesUtilisateur());

     var texteBraille = qrcode.getTexteBraille();
     var couleurQR = qrcode.getColorQRCode();
     var couleurBraille = qrcode.getColorBraille();

     //On limite la taille du texte en braille central à deux caractères
     if (texteBraille.length>2){
       texteBraille=texteBraille.substring(0,2);
     }

     //On convertit le texte central en braille
     var br = require('braille');
     var txt = br.toBraille(texteBraille);


     //On génère le QRCode dans un canvas
     $(div).qrcode( {

        // render method: 'canvas', 'image' or 'div'
        render: 'canvas',

        // version range somewhere in 1 .. 40
        minVersion: 4, //On force une certaine taille de QRCode pour que l'image centrale n'empêche pas la lecture des QRCodes contenant peu de données
        maxVersion: 40,

        // error correction level: 'L', 'M', 'Q' or 'H'
        ecLevel: "L",

        // offset in pixel if drawn onto existing canvas
        left: 0,
        top: 0,

        // size in pixel
        size: size,

        // code color or image element
        fill: couleurQR,

        // background color or image element, null for transparent background
        background: '#fff',

        // content
        text: donneesQR,

        // corner radius relative to module width: 0.0 .. 0.5
        radius: 0.3,

        // quiet zone in modules
        quiet: 1,

        // modes
        // 0: normal
        // 1: label strip
        // 2: label box
        // 3: image strip
        // 4: image box
        mode: 2,

        mSize: 0.10,
        mPosX: 0.5,
        mPosY: 0.5,

        label: txt,
        fontname: 'sans',
        fontcolor: couleurBraille,

        image: null

      });

      //On récupère le noeud racine xml (contenant données utilisateur + metadonnées) et on le convertit en tableau de int pour l'insérer dans les métadonnées de l'image
      var donnees = unescape(qrcode.getRacineXml());

      var donneesutf8 = this.__donneesToUTF8(donnees) ;

      var canvas = div.getElementsByTagName("canvas")[0];

      //On génère l'image jpeg dans le div avec l'image du canvas et les métadonnées
      this.__genererJPEG(donneesutf8, canvas, div);

      //On supprime le canvas initial
      canvas.parentNode.removeChild(canvas);


    }


    /*
    * Génère l'image de la famille d'un qrcode à partir d'un tableau de qrcodes de la famille et d'un div de sortie
    */
    genererImageFamilleQRCode(tableauQRCodes, div){

      /************************/
      /* Traitements QRCodes */
      /************************/

      //On vérifie que tous les QRCodes appartiennent à la même famille
      var famille = tableauQRCodes[0].getNomFamille();
      for (var i=0; i<tableauQRCodes.length; i++){
        var qrcode = tableauQRCodes[i];
        if (qrcode.getNomFamille()!=famille){
          throw "Les QRCodes n'appartiennent pas tous à la même famille, génération de l'image famille impossible.";
        }
      }

      //On crée une chaine xml contenant tous les noeuds de QRCodes de la famille
      var chaineXml="<qrcodesfamille>";
      for (var i=0; i<tableauQRCodes.length; i++){
        var qrcode = tableauQRCodes[i];
        chaineXml+=qrcode.getRacineXml();
      }
      chaineXml+="</qrcodesfamille>";





      /*********************/
      /* Traitements Image */
      /*********************/

      //On transforme le texte de l'image (nom de la famille) en un tableau de plusieurs lignes dont chaque ligne fait 15 caractères ou moins (pour l'affichage dans l'image)
      //On ajoute également le nombre de qrcodes contenus et la date
      var lignes = this.textToLignes("Famille "+famille,20);
      lignes.push("");
      lignes.push(tableauQRCodes.length+" QR-Codes");

      var date = new Date();
      var jj = date.getDate();
      var mm = date.getMonth()+1;
      var aa = date.getFullYear();
      lignes.push(jj+"/"+mm+"/"+aa);

      var height = 500;
      var width = 500;

      //On crée le canvas
      var c = document.createElement("canvas");
      c.setAttribute("height", height);
      c.setAttribute("width", width);
      var ctx=c.getContext("2d");

      var qrCodeImageFamille = new QRCodeAtomique();
      qrCodeImageFamille.ajouterTexte("Ne pas scanner ce qrcode, il est destiné uniquement aux transcripteurs pour enregistrer et charger des familles de qrcodes");

      //On définit les options des qrcodes de fond d'image
      var options = {

         // render method: 'canvas', 'image' or 'div'
         render: 'canvas',

         // version range somewhere in 1 .. 40
         minVersion: 10, //On force une certaine taille de QRCode pour que l'image centrale n'empêche pas la lecture des QRCodes contenant peu de données

         // size in pixel
         size: height/2,

         // corner radius relative to module width: 0.0 .. 0.5
         radius: 0.5,

         // code color or image element
         fill: '#4db8ff',

         // background color or image element, null for transparent background
         background: '#fff',

         // content
         text: qrCodeImageFamille.getDonneesUtilisateur(),

         // quiet zone in modules
         quiet: 2,

       };

      //On génère un QRCode dans la partie supérieure gauche du canvas
      $(c).qrcode(options);

      //On modifie les options et on génère les qrcodes des autres coins de l'image
      options.fill="#00D091";
      options.left=width/2;
      options.top=0;
      console.log(options);
      $(c).qrcode(options);

      options.fill="#FFA652";
      options.left=0;
      options.top=width/2;
      console.log(options);
      $(c).qrcode(options);

      options.fill="#ff8080";
      options.left=width/2;
      options.top=width/2;
      console.log(options);
      $(c).qrcode(options);



      //On écrit le texte dans le canvas
      ctx.fillStyle = "#00004d";
      ctx.font="40px Arial";
      ctx.textAlign = "center";
      var yTexte = height/2-30*Math.floor(lignes.length/2);
      for (var i=0; i<lignes.length; i++){
        ctx.fillText(lignes[i],width/2, yTexte);
        yTexte+=50;
      }

      //On convertit les métadonnées en tableau de int
      var donneesutf8 = this.__donneesToUTF8(unescape(chaineXml));

      // On transforme le canvas en image jpeg avec les bonnes métadonnées
      return this.__genererJPEG(donneesutf8, c, div);

    }

    //Transforme un texte en lignes ne dépassant chacune pas la valeur de nbMaxCarLigne
    textToLignes(text, nbMaxCarLigne){

      var mots = text.split(" ");
      var lignes = new Array();
      lignes.push("");

      var fin=false;

      var length = mots.length;
      var i=0;

      while(i<length){

        //Si on a la place de mettre le mot actuel dans la ligne courante, on l'ajoute
        if (mots[i].length+1+lignes[lignes.length-1].length<=nbMaxCarLigne){
          lignes[lignes.length-1] = this.__ajouterMot(lignes[lignes.length-1], mots[i]);
        }
        else if(mots[i].length>nbMaxCarLigne){ //Si le mot est trop long pour rentrer dans une seule ligne
          var nbCarOccupes = lignes[lignes.length-1].length;
          var nbCarRestants = nbMaxCarLigne-nbCarOccupes;

          if (nbCarRestants>3){//Si le nombre de caractères disponibles sur la ligne courante est supérieur à trois, on ajoute le début du mot sur la ligne
            var moitie1mot = mots[i].substring(0, nbCarRestants-2)
            var moitie2mot = mots[i].substring(nbCarRestants-2);
            lignes[lignes.length-1] = this.__ajouterMot(lignes[lignes.length-1], moitie1mot);
            lignes[lignes.length-1] += "-";
            mots.splice(i+1, 0, moitie2mot);
          }
          else{//Sinon on se contente d'ajouter une nouvelle ligne et on traitera le mot à l'itération suivante
            mots.splice(i+1, 0, mots[i]);
            lignes.push("");
          }

          length++;
        }
        else{//Sinon on ajoute le mot sur une nouvelle ligne
          lignes.push(mots[i])
        }

        i++;
      }

      return lignes;


    }

    //Permet d'ajouter un mot à une ligne en ajoutant ou pas un caractère espace avant le mot. Fonction utilisée par textToLignes
    __ajouterMot(ligne, mot){
      var out="";
      if (ligne==""){
        out=mot;
      }
      else{
        out=ligne+" "+mot;
      }
      return out;
    }

    //Prend une chaine utf-16 en entrée et la sort en utf-8
    __donneesToUTF8(donnees){
      var donneesutf8 = [];
      for (var i = 0; i < donnees.length; i++) {
        donneesutf8.push(donnees.charCodeAt(i));
      }
      return donneesutf8;
    }

    //Prend un tableau de données utf8, un canvas d'entrée et un div de sortie et affiche dans le div l'image jpeg générée à partir du canvas et ayant pour metadonnées le tableau utf8
    // retourne aussi l'img pour une sauvegarde d'une famille de qrcode

    __genererJPEG(donneesUtf8, canvas, divSortie){

      //On génère une image jpg à partir du canvas et contenant les données du qrcode dans l'attribut XMLPacket
      var zerothIfd = {};
      zerothIfd[piexif.ImageIFD.XMLPacket] = donneesUtf8;
      var exifObj = {"0th":zerothIfd};
      var exifBytes = piexif.dump(exifObj);
      var jpegData = canvas.toDataURL("image/jpeg");
      var exifModified = piexif.insert(exifBytes, jpegData);

      //On crée un élément img contenant l'image générée puis on l'insère dans le div
      var image = new Image();
      image.src = exifModified;
      $(divSortie).prepend(image);

      return image;
    }

}


/**
 * Copyright © 12/02/2018, Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * The Software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders X be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the Software.
 * Except as contained in this notice, the name of the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
*/