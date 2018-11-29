/**
 * @Author: alassane
 * @Date:   2018-11-09T20:33:38+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-11-16T16:17:50+01:00
 */

// This class is a representation of QRCode unique in JSON format

class QRCodeUnique {

  // type = unique, xl
  // name = name of qrcode
  // data = an array which contains all input (text, music) provided from form
  // data = [
  // if element is a text
  //   {
  //     type: texte,
  //     value: "value"
  //   },
  //   if element is a music
  //   {
  //     type: "music",
  //     url: "music url",
  //     name: "music name"
  //   },
  //   if element is a file case qr code xl
  //   {
  //     type: "file",
  //     url: "file url"
  //   }
  // ]
  // color = the qrcode color
  constructor(name = "", data = [], color = "") {
    this.qrcode = {
      name: name,
      type: "unique",
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

  getData(index = null) {
    if (index)
      return this.qrcode.data[index]; // return data at index
    return this.qrcode.data; // return all data
  }

  setData(data) {
    this.qrcode.data = data;
  }

  addData(element) {
    this.qrcode.data.push(element);
  }

  // return qr code data which will be interpreted by phone
  getDataString() {
    return JSON.stringify(this.qrcode);
  }

}

// This class is a representation of QRCode unique or QRCode XL in JSON format
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
