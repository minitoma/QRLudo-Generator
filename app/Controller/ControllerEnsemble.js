/**
 * @Date:   2018-12-06T16:32:33+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-24T20:42:08+01:00
 */

class ControllerEnsemble {

  constructor() {
    this.qrCodes = []; // array of qrcode contained in qrcode ensemble data
    this.qrCodeEnsemble = new QRCodeEnsembleJson();
    this.qrCodesSelectionne = null; // qrcode corresponding to the clicked line
  }

  // setting qrcode ensemble
  setQRCodeEnsemble(qrcode) {
    this.qrCodeEnsemble = qrcode;
  }

  // setting an entry in qrcode array
  setQRCodeAtomiqueInArray(qrcode) {
    this.qrCodes.push(qrcode);
  }

  // filling array of qrcode
  setQRCodeAtomiqueArray(arrayQRCode) {
    this.qrCodes = arrayQRCode;
  }

  // setting selected qrcode
  setQRCodeSelectionne(qrcode) {
    this.qrCodesSelectionne = qrcode;
  }

  // return qrcode ensemble
  getQRCodeEnsemble() {
    return this.qrCodeEnsemble;
  }

  // return selected qrcode
  getQRCodeSelectionne() {
    return this.qrCodesSelectionne;
  }

  // return a qrcode array or an entry of qrcode array
  getQRCodeAtomiqueArray(index) {
    if (index)
      return this.qrCodes[index];
    return this.qrCodes;
  }

  /*
   * Si une occurence est trouvé retourne true Sinon retourne false
   */
  occurenceFichier(name) {
    for (let i = 0; i < this.qrCodes.length; i++) {
      if (name == this.qrCodes[i].getName()) {
        return true;
      }
    }
    return false;
  }

  /*
   * Recupere les qrCodes qui sont lie à chaque fichier
   * Les sauvegardes dans le tableau qrCodes
   */
  recuperationQrCodeUnique(file) {
    let facade = new FacadeController();
    facade.importQRCode(file, function(qrcode) {
      controllerEnsemble.qrCodes.push(qrcode);
    });
  }

  // Type de qrcode du fichier
  isUnique(file, callback) {
    let facade = new FacadeController();
    facade.importQRCode(file, callback);
  }

  /*
   * Recupere un QR Code ensemble pour le supprimer ou rajouter des données
   */
  recuperationQrCodeEnsemble(file) {
    let facade = new FacadeController();
    facade.importQRCode(file, function(qrCode) {
      controllerEnsemble.qrCodeEnsemble = qrCode;
    });

    // setTimeout(suiteTraitement, 400);
  }


}

module.exports = {
  ControllerEnsemble
};
