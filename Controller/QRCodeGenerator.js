/*
* Classe permettant de générer une image QRCode à partir d'un objet QRCode
* L'insertion des métadonnées du QRCode dans les métadonnéees de l'image n'est pas encore gérée
* Note : la page html appelant la méthode generate doit contenir un élément <img id="img-buffer" src="chemin/de/limage/centrale">
*/
class QRCodeGenerator{

  /*
  * Génère l'image du QRCode passé en paramètre dans le div dont l'id est passé en paramètre
  */
  static generate(div, qrcode){

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
        fill: '#000',

        // background color or image element, null for transparent background
        background: '#fff',

        // content
        text: qrcode.getDonnees(),

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


      //On génère une image jpg à partir du canvas et contenant les métadonnées du qrcode dans l'attribut Description exif
      var zerothIfd = {};
      zerothIfd[piexif.ImageIFD.ImageDescription] = qrcode.getMetadonnees();
      var exifObj = {"0th":zerothIfd};
      var exifBytes = piexif.dump(exifObj);
      var jpegData = document.getElementsByTagName("canvas")[0].toDataURL("image/jpeg");
      var exifModified = piexif.insert(exifBytes, jpegData);

      //On crée un élément img contenant l'image générée puis on l'insère dans le div
      var canvas = document.getElementsByTagName("canvas")[0];
      var image = new Image();
	    image.src = exifModified;
      $(div).prepend(image);

      //On supprime le canvas initial
      canvas.parentNode.removeChild(canvas);

    }
}
