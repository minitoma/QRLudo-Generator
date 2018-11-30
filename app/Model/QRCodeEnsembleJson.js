/**
 * @Author: alassane
 * @Date:   2018-11-09T20:33:38+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-11-15T23:12:11+01:00
 */

// This class is a representation oj QRCode in JSON format


// type = ensemble
class QRCodeEnsemble {
  // name = name of qrcode
  // data = an array which contains all input music provided from form
  // data = [
  //   {
  //     type: "music",
  //     url: "music url",
  //     name: "music name"
  //   }
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

  getData() {
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
  QRCodeEnsemble
};
