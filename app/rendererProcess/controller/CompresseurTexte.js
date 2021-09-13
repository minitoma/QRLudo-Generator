/**
 * @Author: alassane
 * @Date:   2018-11-09T18:42:04+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-11-14T11:15:31+01:00
 */

/**
 * Jules Leguy
 * 2017
 **/
class CompresseurTexte {

  /**
   * On initialise le tableau des chaînes compressibles à partir du fichier
   * En cas de changement, voir la documentation de la fonction compresser(texte) plus bas pour assurer la compatibilité avec les qrcodes générés avec cette version (v1)
   */
  constructor() {

    var fs = require('fs');
    /** On lit le fichier */
    try {
      this.lignes = fs.readFileSync('./txt/chainesCompressiblesV1.txt').toString().split("\n");
    } catch (err) {
      this.lignes = fs.readFileSync('./resources/app.asar/txt/chainesCompressiblesV1.txt').toString().split("\n");
    }
    /** On supprime la dernière chaîne vide */
    this.lignes.splice(this.lignes.length - 1, 1);
  }

  /**
   * Compression des données du QRCode
   * La méthode de compression est la suivante : on remplace la plupart des chaînes de caractères du qrcode représentant les données par des caractères utf-8 prédéfis.
   * Ces chaînes sont lues dans le fichier ./txt/chainesCompressiblesV1.txt
   * Les caractères utf8 associés appartiennent à l'alphabet cyrillique et commencent à U+0400 (les 1152 premiers caractères de l'utf-8 ne sont codés que sur deux octets)
   * Si une autre méthode de compression doit être mise en place et afin d'assurer la compatibilité avec celle-ci, notez que le premier caractère de la chaîne compressée générée est le caractère U+0400
   * et qu'il est suivi du caractère "1".
   * Ainsi, si la méthode de compression doit être changée, il faudra simplement tester les deux premiers caractères du QRCode côté Android et adapter l'algorithme de décompression tout en gardant
   * la décompression pour les QRCodes générés avec cette méthode.
   * Si des chaînes sont ajoutées au fichier, elles doivent l'être à la fin pour ne pas bousculer la correspondance entre caractères utf8 et chaines du fichier.
   * Si une méthode de compression analogue avec d'autres chaînes doit être utilisée, il faudra utiliser "2" comme second caractère de la chaîne tout en laissant la décompresion possible pour les chaînes
   * compressées dont le deuxième caractère est "1";
   */
  compresser(texte) {

    /** On initialise la chaîne compressée avec les données initiales du qrcode */
    var texteCompresse = texte;
    var offset = 1;

    /** On boucle sur toutes les chaînes compressibles et on applique un chercher 
     * et remplacer dans les données du qrcode (on remplace la chaîne trouvée dans le qrcode par le caractère utf8 correspondant) 
     */
    for (let i = 0; i < this.lignes.length; i++) {

      /** On remplace toutes les chaînes du texte par le caractère unicode correspondant */
      while (texteCompresse.includes(this.lignes[i])) {
        texteCompresse = texteCompresse.replace(this.lignes[i], String.fromCharCode(1024 + offset));
      }
      offset++;
    }
    /** On ajoute les deux caractères code au début de la chaîne */
    texteCompresse = "1" + texteCompresse;
    texteCompresse = String.fromCharCode(1024) + texteCompresse;

    return texteCompresse;

  }
}

module.exports = {
  CompresseurTexte
};

/**
 * Copyright © 12/02/2018, Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * The Software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders X be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the Software.
 * Except as contained in this notice, the name of the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
 */
