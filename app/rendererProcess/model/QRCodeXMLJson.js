/**
 * @Author: alassane
 * @Date:   2018-11-09T20:33:38+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-11-10T14:09:59+01:00
 */

/** This class is a representation oj QRCode in JSON format */
class QRCodeXMLJson {

  constructor(qrcodeXML) {
    this.qrcode = {
      nom: qrcodeXML.getNomQRCode(),
      type: qrcodeXML.getTypeQR(),
      data: qrcodeXML.getDonneesUtilisateur(),
      color: qrcodeXML.getColorQRCode()
    };
  }

  getQRCode() {
    return this.qrcode;
  }

  getType() {
    return this.qrcode.type;
  }

  setType(type) {
    this.qrcode.type = type;
  }

  getColor() {
    return this.qrcode.color;
  }

  setColor(color) {
    this.qrcode.color = color;
  }

  getData() {
    return this.qrcode.data;
  }

  setData(data) {
    this.qrcode.data = data;
  }

  addData(element) {
    this.qrcode.data = [...this.qrcode.data, element];
  }
}

module.exports = {
  QRCodeXMLJson
};
