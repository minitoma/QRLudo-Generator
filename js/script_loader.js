/**
 * @Author: alassane
 * @Date:   2018-12-04T14:28:52+01:00
 * @Last modified by:   alassane
<<<<<<< HEAD
 * @Last modified time: 2018-12-08T15:08:02+01:00
=======
 * @Last modified time: 2018-12-08T15:08:02+01:00
>>>>>>> f0956197d0bc8b217523a0d19da951558e2be701
 */

const path = require('path');
const root = path.dirname(require.main.filename);
const piexif = require('piexifjs');

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
