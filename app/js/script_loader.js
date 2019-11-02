/**
 * @Author: alassane
 * @Date:   2018-12-04T14:28:52+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2019-01-28T01:41:24+01:00
 */

//Déclaration du store permettant la continuité entre les differents onglets
const Store = require('electron-store');
const store = new Store();

//Déclaration de l'entier permettant l'implémentation des différentes zones de textes dans l'onglet qr unique
numTextArea = 1;

//nombre de fichier ajouté dans l'onglet ensemble
numFich = 0;


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
const {
  exec
} = require('child_process');
switch (process.platform) {
  case 'linux':
    var temp = path.join(process.env.HOME, 'temp/QRLudo');
    fs.access(temp, fs.constants.F_OK, (err) => {
      if (err) {
        var {
          ipcRenderer
        } = require('electron');

        exec(`mkdir -p ${temp}/Download`, (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            ipcRenderer.send('exitApp', null);
            return;
          }
        });

        exec(`mkdir -p ${temp}/tts`, (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            ipcRenderer.send('exitApp', null);
            return;
          }
        });
      }
    });
    break;

  case 'win32':
    var temp = path.join(process.env.temp, 'QRLudo');
    fs.access(temp, fs.constants.F_OK, (err) => {
      if (err) {
        var {
          ipcRenderer
        } = require('electron');

        exec(`mkdir ${temp}\\Download`, (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            ipcRenderer.send('exitApp', null);
            return;
          }
        });

        exec(`mkdir ${temp}\\tts`, (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            ipcRenderer.send('exitApp', null);
            return;
          }
        });
      }
    });
    break;

  default:
    console.log('Unknown operating system');
    break;
}

// Check internet connection
if (!navigator.onLine) {
  alert("L'application ne peut pas se lancer sans une liaison à internet. Veuillez vérifier votre connexion internet");
  window.close();
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

const {
  ProjetQCM,
  ReponseQCM,
  QuestionQCM
} = require(`${root}/Model/QRCodeQCM`);

// Instanciate object
let controllerEnsemble = new ControllerEnsemble();
