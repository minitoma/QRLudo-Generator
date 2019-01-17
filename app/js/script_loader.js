/**
 * @Author: alassane
 * @Date:   2018-12-04T14:28:52+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2019-01-17T15:17:42+01:00
 */

const path = require('path');
const root = path.dirname(require.main.filename);
const piexif = require('piexifjs');
const fs = require('fs');
window.$ = window.jQuery = require(__dirname + "/Views/assets/js/jquery.min.js");
require(__dirname + "/Views/assets/js/jquery.qrcode.min.js");
require(__dirname + "/Views/assets/js/jquery-qrcode-0.14.0.min.js");
require(__dirname + "/Views/assets/js/jquery-qrcode-0.14.0.js");
require(__dirname + "/Views/assets/js/bootstrap.min.js");
require(__dirname + "/Views/assets/js/solid.js");
require(__dirname + "/Views/assets/js/fontawesome.js");

// Create QRLudo temp folder if not exist
switch (process.platform) {
  case 'linux':
    var temp = path.join(process.env.HOME, 'temp/QRLudo');
    let downloadLinux = path.join(temp, 'Download');
    let ttsLinux = path.join(temp, 'tts');

    fs.access(temp, fs.constants.F_OK, (err) => {
      if (err) {
        fs.mkdir(path.join(`${process.env.HOME}`, 'temp'), err => {
          if (err) console.log(err);
          fs.mkdir(temp, err => {
            if (err) console.log(err);
            fs.mkdir(downloadLinux, err => {
              if (err) console.log(err);
            });
            fs.mkdir(ttsLinux, err => {
              if (err) console.log(err);
            });
          });
        });
      }
    });
    break;

  case 'win32':
    var temp = path.join(`${process.env.temp}`, 'QRLudo');
    let download = path.join(temp, 'Download');
    let tts = path.join(temp, 'tts');
    fs.access(temp, fs.constants.F_OK, (err) => {
      if (err) {
        fs.mkdir(temp, err => {
          if (err) console.log(err);
          fs.mkdir(download, err => {
            if (err) console.log(err);
          });
          fs.mkdir(tts, err => {
            if (err) console.log(err);
          });
        });
      }
    });
    break;

  default:
    console.log('Unknown operating system');
    break;
}

var {
  remote,
  ipcRenderer
} = require('electron');
const {
  dialog
} = remote;

const {
  CompresseurTexte
} = require(`${root}/Controller/CompresseurTexte`);

const {
  ControllerEnsemble
} = require(`${root}/Controller/ControllerEnsemble`);

const {
  FacadeController
} = require(`${root}/Controller/FacadeController`);

const {
  ImageGenerator
} = require(`${root}/Controller/ImageGenerator`);

const {
  ImageGeneratorJson
} = require(`${root}/Controller/ImageGeneratorJson`);

const {
  JsonCompressor
} = require(`${root}/Controller/JsonCompressor`);

const {
  QRCodeLoader
} = require(`${root}/Controller/QRCodeLoader`);

const {
  QRCodeLoaderJson
} = require(`${root}/Controller/QRCodeLoaderJson`);


const {
  DictionnaireXml
} = require(`${root}/Model/DictionnaireXml`);

const {
  Music
} = require(`${root}/Model/Music`);

const {
  QRCode
} = require(`${root}/Model/QRCode`);

const {
  QRCodeAtomique
} = require(`${root}/Model/QRCodeAtomique`);

const {
  QRCodeEnsemble
} = require(`${root}/Model/QRCodeEnsemble`);

const {
  QRCodeEnsembleJson
} = require(`${root}/Model/QRCodeEnsembleJson`);

const {
  QRCodeUnique,
  QRCodeXL
} = require(`${root}/Model/QRCodeJson`);

const {
  QRCodeXMLJson
} = require(`${root}/Model/QRCodeXMLJson`);

const {
  Projet,
  Reponse,
  Question
} = require(`${root}/Model/QRCodeQuestionReponse`);

// Instanciate object
let controllerEnsemble = new ControllerEnsemble();
