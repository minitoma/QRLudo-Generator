/**
 * @Date:   2018-12-06T16:32:33+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-11T23:14:13+01:00
 */
class ControllerMultiple {

  constructor() {
    this.qrCodes = []; // array of qrcode contained in qrcode multiple data
    this.qrCodeMultiple = new QRCodeMultipleJson();
    this.qrCodesSelectionne = null; // qrcode corresponding to the clicked line
  }

  /** setting qrcode multiple */
  setQRCodeMultiple(qrcode) {
    this.qrCodeMultiple = qrcode;
  }

  /** setting an entry in qrcode array */
  setQRCodeAtomiqueInArray(qrcode) {
    this.qrCodes.push(qrcode);
  }

  /** filling array of qrcode */
  setQRCodeAtomiqueArray(arrayQRCode) {
    this.qrCodes = arrayQRCode;
  }

  /** setting selected qrcode */ 
  setQRCodeSelectionne(qrcode) {
    this.qrCodesSelectionne = qrcode;
  }

  /** return qrcode multiple */ 
  getQRCodeMultiple() {
    return this.qrCodeMultiple;
  }

  /** return selected qrcode */ 
  getQRCodeSelectionne() {
    return this.qrCodesSelectionne;
  }

  /** return a qrcode array or an entry of qrcode array */ 
  getQRCodeAtomiqueArray(index) {
    if (index)
      return this.qrCodes[index];
    return this.qrCodes;
  }

  /** 
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

  /**
   * Recupere les qrCodes qui sont lie à chaque fichier
   * Les sauvegardes dans le tableau qrCodes
   */
  recuperationQrCodeUnique(file) {
    let facade = new FacadeController();
    facade.importQRCode(file, function(qrcode) {
      controllerMultiple.qrCodes.push(qrcode);
    });
  }

  /** fonction qui ajouter un qr code dans l'multiple des qrcode utile pour ajouter un qr code avec le bouton qui crée un nouveau */
  ajoutQRcode(qrCode) {
      controllerMultiple.qrCodes.push(qrCode);
  }

  /** Type de qrcode du fichier */ 
  isUnique(file, callback) {
    let facade = new FacadeController();
    facade.importQRCode(file, callback);
  }

  /**
   * Recupere un QR Code multiple pour le supprimer ou rajouter des données
   */
  recuperationQrCodeMultiple(file) {
    let facade = new FacadeController();
    facade.importQRCode(file, function(qrCode) {
      controllerMultiple.qrCodeMultiple = qrCode;
    });

    // setTimeout(suiteTraitement, 400);
  }
}

module.exports = {
  ControllerMultiple
};
