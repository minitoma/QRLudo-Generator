
class CompresseurTexte{

  static compresser(texte){
    console.log(texte.length);
    console.log(texte);

    var utf8array = LZString.compressToUint8Array(texte);
    console.log(utf8array);
    var texteCompresse = "";
    for (var i=0; i<utf8array.length; i++){
      texteCompresse+=String.fromCharCode(utf8array[i]);
    }

    //return texteCompresse;
    return texte;
  }




}
