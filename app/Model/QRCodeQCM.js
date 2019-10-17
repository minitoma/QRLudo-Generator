/**
 * @Date:   2018-11-23T11:47:00+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-04T21:01:33+01:00
 */


/*
 *Classe permettant de creer un projet de QCM
 */
class ProjetQCM {
  //Constructeur d'un Projet
  constructor(nom = "No_Name", question = null, reponses = []) {
    this.projet = {
      id: new Date().getTime(),
      nom: nom,
      question: question,
      reponses: reponses
    };
  }

  setQuestion(question) {
    this.projet.question = question;
  }

  addReponse(reponse) {
    //On ajoute la reponse au projet
    this.projet.reponses.push(reponse);

    //On ajoute la reponse à la question
    this.projet.question.addReponse(reponse);
  }

  removeReponse(reponseId){
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


  removeQuestion(questionId){
    //On supprime tout les reponses de la question
    for(let reponse of this.projet.question.qrcode.data) {
      this.removeReponse(reponse.id);
    }

    //Ensuite on supprime la question
    this.projet.question = null;
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

  getReponsesByIndex(indice) {
    return this.projet.reponses[indice];
  }

  getReponseById(id) {
    for (let q of this.projet.reponses) {
      if (q.getId() == id) {
        return q;
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
class QuestionQCM {
  //Constructeur d'une Question
  constructor(title, reponsesUIDs = [], color = '#000000') {
    this.qrcode = {
      id: new Date().getTime(),
      name: title,
      data: reponsesUIDs,
      type: "question",
      color: color
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
class ReponseQCM {
  //Constructeur d'une Reponse
  constructor(name, color = '#000000') {
    this.qrcode = {
      id: new Date().getTime(),
      name: name,
      data: [],
      type: "reponse",
      color: color
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
  ProjetQCM,
  ReponseQCM,
  QuestionQCM
};
