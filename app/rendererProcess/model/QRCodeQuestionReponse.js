/**
 * @Date:   2018-11-23T11:47:00+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-04T21:01:33+01:00
 */


/**
 * HARBOUL Abdessabour
 * 2018
 **/

 /**
  * BAH Marouwane
  * 2019
**/

const { MDFiveConverter } = require(`${root}/rendererProcess/controller/MDFiveConverter.js`);

/**
 *Classe permettant de creer un projet de questions_reponses
 */
class Projet {
  /** Constructeur d'un Projet */
  constructor(nom = "No_Name", questions = [], reponses = []) {
    /** Génération de l'id unique */
    var dataString =  nom;
    for (let i = 0; i < questions.length; i++) {
      dataString += questions[i];
    }
    //TODO Envoyer id uniquement
    for (let i = 0; i < reponses.length; i++) {
      dataString += reponses[i];
    }

    var md5Value = MDFiveConverter.convert(dataString);

    this.projet = {
      id: md5Value,
      nom: nom,
      questions: questions,
      reponses: reponses
    };
  }

  setQuestion(question) {
    this.projet.question = question;
  }

  addQuestion(question) {
    this.projet.questions.push(question)
  }

  addReponse(reponse) {
    this.projet.reponses.push(reponse)
  }
  /** On supprime la reponse du projet
   * On supprime aussi la reponse dans la question
   * @param  {} reponseId
   */
  removeReponse(reponseId){
    for(let reponse of this.projet.reponses){
      if(reponse.qrcode.id == reponseId){
        var index = this.projet.reponses.indexOf(reponse);
        this.projet.reponses.splice(index, 1);
      }
    }
    if(this.projet.question != null) {
      this.projet.question.removeReponse(reponseId);
    }
  }

  removeReponseFromQuestion(reponseId, questionId) {
    this.removeReponse(reponseId);

    for(let question of this.projet.questions){
      if(question.getId() == questionId) {
        question.removeReponse(reponseId);
      }
    }
  }
  /** On supprime la question de la liste de questions
   * On supprime egalement les reponses de la question
   * @param  {} questionId
   */
  removeQuestion(questionId){
    for(let question of this.projet.questions){
      if(question.qrcode.id == questionId){
        var index = this.projet.questions.indexOf(question);
        this.projet.questions.splice(index, 1);

        for(let reponse of question.qrcode.data) {
          this.removeReponseFromQuestion(reponse.id, question.qrcode.id);
        }
      }
    }
  }

  setName(nom) {
    this.projet.nom = nom;
  }

  getName() {
    return this.projet.nom;
  }

  getQuestion() {
    return this.projet.question;
  }

  getReponses() {
    return this.projet.reponses;
  }

  getQuestionByIndex(indice) {
    return this.projet.questions[indice];
  }

  getReponsesByIndex(indice) {
    return this.projet.reponses[indice];
  }

  getQuestionById(id) {
    for (let q of this.projet.questions) {
      if (q.getId() == id) {
        return q;
      }
    }
    return null;
  }

  getReponseById(id) {
    for (let q of this.projet.reponses) {
      if (q.getId() == id) {
        return q;
      }
    }
    return null;
  }

  getReponsesFromQuestion(reponseId, questionId) {
    for(let question of this.projet.questions){
      if(question.getId() == questionId) {
        return question.getReponses();
      }
    }
    return null;
  }

  getDataString() {
    return JSON.stringify(this.projet);
  }
}

/**
 *Classe permettant de creer une question
 */
class Question {
  /** Constructeur d'une Question */
  constructor(title, bonneReponse, mauvaiseReponse, reponsesUIDs = [], nombreMinReponse, color = '#000000') {
    this.qrcode = {
      id: new Date().getTime(),
      name: title,
      data: reponsesUIDs,
      nb_min_reponses : nombreMinReponse,
      type: "question",
      color: color,
      text_bonne_reponse: bonneReponse,
      text_mauvaise_reponse: mauvaiseReponse
    };
  }

  setId(id) {
    this.qrcode.id = id;
  }

  getId() {
    return this.qrcode.id;
  }

  getName() {
    return this.qrcode.name;
  }

  setName(name){
    this.qrcode.name = name;
  }

  getGoodAnswer(){
    return this.qrcode.text_bonne_reponse
  }

  setGoodAnswer(reponse){
    this.qrcode.text_bonne_reponse = reponse
  }

  getBadAnswer(){
    return this.qrcode.text_mauvaise_reponse
  }

  setBadAnswer(reponse){
    this.qrcode.text_mauvaise_reponse = reponse
  }

  getMinAnswer(){
    return this.qrcode.nb_min_reponses
  }

  setMinAnswer(minimum){
    this.qrcode.nb_min_reponses = minimum
  }

  getReponses() {
    return this.qrcode.data;
  }

  getColor() {
    return this.qrcode.color;
  }

  setColor(color){
    this.qrcode.color = color;
  }

  getType(){
    return this.qrcode.type;
  }

  getReponseUIDByIndex(indice) {
    return this.qrcode.data[indice];
  }

  getReponseById(reponseUid){
    for(let rep of this.qrcode.data){
      if(rep.id == reponseUid){
        return rep;
      }
    }
    return null;
  }

  addData(element) {
    this.qrcode.data.push(element);
  }
  addReponse(reponseUid, message='') {
    if(message===''){
      var settings = require("electron-settings");
      message = settings.get("defaultBonneReponse")
    }

    this.addData(reponseUid);
  }


  removeReponse(reponseUid){
    for(let rep of this.qrcode.data){
      if(rep == reponseUid){
        var index = this.qrcode.data.indexOf(rep);
        this.qrcode.data.splice(index, 1);
      }
    }
  }

  removeAllReponses(){
    this.qrcode.data = [];
  }

  setMessage(reponseUid, message){
    for (let r of this.qrcode.data) {
      if (r.id === reponseUid) {
        r.message = message;
      }
    }
  }

  getDataString() {
    return JSON.stringify(this.qrcode);
  }
}

/**
 *Classe permettant de creer une reponse
 */
class Reponse {
  /** Constructeur d'une Reponse */
  constructor(name, color = '#000000') {
    this.qrcode = {
      id: new Date().getTime(),
      name: name,
      data: [],
      type: "reponse",         //reponse ou unique  (meme chose)
      color: color
    };
  }

  setId(id) {
    this.qrcode.id = id;
  }

  setData(data) {
      for ( var i=0; i<= data.length; ++i){
        this.qrcode.data=data[i];
      }
  }

  getId() {
    return this.qrcode.id;
  }

  getName() {
    return this.qrcode.name;
  }

  getColor() {
    return this.qrcode.color;
  }

  setColor(color){
    this.qrcode.color = color;
  }

  getType(){
    return this.qrcode.type;
  }

  getDataString() {
    return JSON.stringify(this.qrcode);
  }
}

module.exports = {
  Projet,
  Reponse,
  Question
};