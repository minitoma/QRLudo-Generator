/**
 * @Author: alassane
 * @Date:   2018-11-09T20:33:38+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-08T17:37:59+01:00
 */

const { MDFiveConverter } = require(`${root}/rendererProcess/controller/MDFiveConverter.js`);

/** This class is a representation of QRCode unique in JSON format */
class QRCodeUnique {

  constructor(name = "", data = [], color = "") {

    /** Génération de l'id unique */
    var dataString = name + "unique" + color;
    for (var i = 0; i < data.length; i++) {
      dataString += data[i];
    }

    var md5Value = MDFiveConverter.convert(dataString);

    this.qrcode = {
      /** ajout de id pour les QR unique &&*/
      id: md5Value,
      name: name,
      type: "unique",
      data: data,
      color: color
    };
  }

  getQRCode() {
    return this.qrcode;
  }
  getId() {
    return this.qrcode.id;
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
    if (index === 0) {
      // console.log("le zero");
      /** return data at index */
      return this.qrcode.data[0];
    }
    if (index) {
      // console.log("reste");
      /** return data at index */
      return this.qrcode.data[index];
    }
    // console.log("tous");
    /** return all data */
    return this.qrcode.data;
  }

  getDataAll() {
    return this.qrcode.data;
  }

  setData(data) {
    this.qrcode.data = data;
  }

  setId(id) {
    this.qrcode.id = id;
  }

  addData(element) {
    this.qrcode.data.push(element);
  }

  /** return qr code data which will be interpreted by phone */
  getDataString() {
    return JSON.stringify(this.qrcode);
  }

}

/** This class is a representation of QRCode unique or QRCode XL in JSON format */
class QRCodeXL extends QRCodeUnique {

  // type = unique, xl
  // name = name of qrcode
  // data = an array which contains input (url file) provided from form
  // data = [
  //   {
  //     type: "file",
  //     url: "file url"
  //   }
  // ]
  // color = the qrcode color
  constructor(name = "", data = [], color = "") {
    super(name, data, color);
    this.qrcode.type = "xl";
  }

}

module.exports = {
  QRCodeUnique,
  QRCodeXL
};
