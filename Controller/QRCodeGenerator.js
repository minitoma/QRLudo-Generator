/*
* Classe permettant de générer une image QRCode à partir d'un objet QRCode
* On insère les données et les métadonnées du QRCode dans les métadonnées de l'image générée
* Note : la page html appelant la méthode generate doit contenir un élément <img id="img-buffer" src="chemin/de/limage/centrale">
*
* À faire : supprimer les attributs par défaut xml inutiles
*/
class QRCodeGenerator{

  /*
  * Génère l'image du QRCode passé en paramètre dans le div dont l'id est passé en paramètre
  */
  static generate(div, qrcode, color){

     var jq = window.jQuery;
     var size = 450;


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
        fill: color,

        // background color or image element, null for transparent background
        background: '#fff',

        // content
        text: qrcode.getDonneesUtilisateur(),

        // corner radius relative to module width: 0.0 .. 0.5
        radius: 0.5,

        // quiet zone in modules
        quiet: 1,

        // modes
        // 0: normal
        // 1: label strip
        // 2: label box
        // 3: image strip
        // 4: image box
        mode: 4,

        mSize: 0.15,
        mPosX: 0.5,
        mPosY: 0.5,

        label: 'no label',
        fontname: 'sans',
        fontcolor: '#000',

        image: jq('#img-buffer')[0]

      });

      //On récupère le noeud racine xml (contenant données utilisateur + metadonnées) et on le convertit en tableau de int pour l'insérer dans les métadonnées de l'image
      var donnees = unescape(qrcode.getRacineXml());
      var donneesutf8 = [];
      for (var i = 0; i < donnees.length; i++) {
        donneesutf8.push(donnees.charCodeAt(i));
      }

      //On génère une image jpg à partir du canvas et contenant les données du qrcode dans l'attribut XMLPacket
      var zerothIfd = {};
      zerothIfd[piexif.ImageIFD.XMLPacket] = donneesutf8;
      var exifObj = {"0th":zerothIfd};
      var exifBytes = piexif.dump(exifObj);
      var jpegData = div.getElementsByTagName("canvas")[0].toDataURL("image/jpeg");
      var exifModified = piexif.insert(exifBytes, jpegData);

      //On crée un élément img contenant l'image générée puis on l'insère dans le div
      var canvas = div.getElementsByTagName("canvas")[0];
      var image = new Image();
	    image.src = exifModified;
      $(div).prepend(image);

      //On supprime le canvas initial
      canvas.parentNode.removeChild(canvas);

    }
}
