/**
 * @Author: alassane
 * @Date:   2018-11-10T20:43:54+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-11-14T13:23:51+01:00
 */

// this class compress a qrcode to a gzip data, decompress gzip data to qrcode



class JsonCompressor {


  // qrcode must be a stringify json
  static compress(qrcode, callback, arg) {
    const zlib = require('zlib');
    console.log('qrcode to compress');
    console.log(qrcode);

    zlib.gzip(qrcode, (err, zippedData) => {
      if (err)
        console.log("error in gzip compression using zlib module", err);

      console.log("compress result");
      console.log(zippedData.toString('base64'));
      arg.push(zippedData);
      callback(arg);
    });
  }


  static decompress(zippedData, callback) {
    const zlib = require('zlib');

    zlib.gunzip(zippedData, function(err, unZippedData) {
      if (err)
        console.log("error in gzip compression using zlib module", err);

      console.log("unZippedData", unZippedData.toString());
      let data = unZippedData.toString();
      callback(data);
    });
  }

}

module.exports = {
  JsonCompressor
};
