/**
 * @Date:   2018-11-23T11:47:00+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-04T21:01:33+01:00
 */


/**
 * HARBOUL Abdessabour
 * 2018
 **/

/*
 *Classe permettant de creer un projet de questions_reponses
 */
class Projet {
  //Constructeur d'un Projet
  constructor(nom = "No_Name", questions = [], reponses = []) {
    this.projet = {
      id: new Date().getTime(),
      nom: nom,
      questions: questions,
      reponses: reponses
    };
  }

  addQuestion(question) {
    this.projet.questions.push(question)
  }

  addReponse(reponse) {
    this.projet.reponses.push(reponse)
  }

  setName(nom) {
    return this.projet.nom = nom;
  }

  getName() {
    return this.projet.nom;
  }

  getQuestions() {
    return this.projet.questions;
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

  getReponsesById(id) {
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
class Question {
  //Constructeur d'une Question
  constructor(title, reponsesUIDs = [], color = '#00000') {
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

  getReponsesUIDs() {
    return this.qrcode.data;
  }

  getColor() {
    this.qrcode.color;
  }

  getReponseUIDByIndex(indice) {
    return this.qrcode.data[indice];
  }

  addReponse(reponseUid) {
    this.qrcode.data.push({"id": reponseUid, "message":"Oui, c'est bien ça"});
  }

  setMessage(reponseUid, message){
    for (let r of this.qrcode.data) {
      if (r.id == reponseUid) {
        r.message = message
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
  constructor(name, color = '#00000') {
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
    this.qrcode.color;
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
