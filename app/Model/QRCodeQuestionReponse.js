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

const {
  MdFiveConverter
} = require(`${root}/Controller/MDFiveConverter`);

/*
 *Classe permettant de creer un projet de questions_reponses
 */
class Projet {
  //Constructeur d'un Projet
  constructor(nom = "No_Name", questions = [], reponses = []) {
    //Génération de l'id unique
    var dataString =  nom;
    for (var i = 0; i < questions.length; i++) {
      dataString += question[i];
    }
    //TODO Envoyer id uniquement
    for (var i = 0; i < reponses.length; i++) {
      dataString += reponse[i];
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

  removeReponse(reponseId){
    //On supprime la reponse du projet
    for(let reponse of this.projet.reponses){
      if(reponse.qrcode.id == reponseId){
        var index = this.projet.reponses.indexOf(reponse);
        this.projet.reponses.splice(index, 1);
      }
    }

    //On supprime aussi la reponse dans la question
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

  removeQuestion(questionId){
    for(let question of this.projet.questions){
      if(question.qrcode.id == questionId){
        var index = this.projet.questions.indexOf(question);
        this.projet.questions.splice(index, 1);

        //On supprime egalement les reponses de la question
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

/*
 *Classe permettant de creer une question
 */
class Question {
  //Constructeur d'une Question
  constructor(title, bonneReponse, mauvaiseReponse, reponsesUIDs = [], color = '#000000') {
    this.qrcode = {
      id: new Date().getTime(),
      name: title,
      data: reponsesUIDs,
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

  addReponse(reponseUid, message='') {
    if(message===''){
      var settings = require("electron-settings");
      message = settings.get("defaultBonneReponse")
    }

    this.qrcode.data.push({"id": reponseUid, "message":message});
  }

  removeReponse(reponseUid){
    for(let rep of this.qrcode.data){
      if(rep.id == reponseUid){
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

/*
 *Classe permettant de creer une reponse
 */
class Reponse {
  //Constructeur d'une Reponse
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
