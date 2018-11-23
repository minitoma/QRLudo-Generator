/**
 * @Author: alassane
 * @Date:   2018-11-23T11:47:00+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-11-23T12:42:12+01:00
 */



/**
 * HARBOUL Abdessabour
 * 2018
 **/

/*
 *Classe permettant de creer un projet de questions
 */
class Projet {
  //Constructeur d'un Projet
  constructor(nom = "", questions = [], reponses = []) {
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

  getQuestions() {
    return this.projet.questions;
  }

  getReponses() {
    return this.projet.reponses;
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
  constructor(title, reponsesUIDs = [], color) {
    this.qrcode = {
      id: new Date().getTime(),
      title: title,
      reponsesUIDs: reponsesUIDs,
      type: "question",
      color: color
    };
  }

  getColor() {
    this.qrcode.color;
  }
  getDataString() {
    return JSON.stringify(this.qrcode);
  }

  addReponse(reponseUid) {
    this.qrcode.reponsesUIDs.push(reponseUid);
  }

  getName(){
    return this.qrcode.id;
  }
}

/*
 *Classe permettant de creer une reponse
 */
class Reponse {
  //Constructeur d'une Reponse
  constructor(title, color) {
    this.qrcode = {
      id: new Date().getTime(),
      title: title,
      type: "reponse",
      color: color
    };
  }

  getName(){
    return this.qrcode.id;
  }
  
  getColor() {
    this.qrcode.color;
  }

  getDataString() {
    return JSON.stringify(this.qrcode);
  }
}

// class QRCodeQuestionReponse {
//
//   // type = unique, xl
//   // name = name of qrcode
//   // data = an array which contains input (url file) provided from form
//   // data = [
//   //   {
//   //     type: "file",
//   //     url: "file url"
//   //   }
//   // ]
//   // color = the qrcode color
//   constructor(name = "", data = [], color = "") {
//     super(name, data, color);
//     this.qrcode.type = "questionre";
//   }
//
// }

module.exports = {
  Projet,
  Reponse,
  Question
};
