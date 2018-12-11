/**
 * @Author: alassane
 * @Date:   2018-11-09T20:33:38+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-06T18:35:43+01:00
 */

// This class is a representation oj QRCode in JSON format


// type = ensemble
class QRCodeEnsembleJson {
  // name = name of qrcode
  // data = an array which contains all input music provided from form
  // data = [
  //   qrcode unique
  // ]
  // color = the qrcode color

  constructor(name = "", data = [], color = "") {
    this.qrcode = {
      name: name,
      type: "ensemble",
      data: data,
      color: color
    };
  }

  ajouterQrCode(qrCode) {
    this.qrcode.data.push(qrCode);
  }

  getDataString() {
    let string = JSON.stringify(this.qrcode);
    return string;
  }

  getQRCode() {
    return this.qrcode;
  }

  getName() {
    return this.qrcode.name;
  }

  setName(name) {
    this.qrcode.name = name;
  }

  getType() {
    return this.qrcode.type;
  }

  getColor() {
    return this.qrcode.color;
  }

  setColor(color) {
    this.qrcode.color = color;
  }

  getData(index = null) {
    if (index)
      return this.qrcode.data[index];
    return this.qrcode.data;
  }

  setData(data) {
    this.qrcode.data = data;
  }

  addData(element) {
    this.qrcode.data.push(element);
  }

  getDataString() {
    return JSON.stringify(this.qrcode);
  }

}

module.exports = {
  QRCodeEnsembleJson
};
