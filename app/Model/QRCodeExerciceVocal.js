const {
    MdFiveConverter
  } = require(`${root}/Controller/MDFiveConverter`);
 
 /*
  *Classe permettant de creer un QR Code Exo Vocal
  */
 class ProjetExoVocal {
   constructor(nom = "ExoVocal", question = [], reponses = []) {
     var dataString =  nom;
     for (var i = 0; i < question.length; i++) {
       dataString += question[i];
     }
     for (var i = 0; i < reponses.length; i++) {
       dataString += reponses[i];
     }
 
     var md5Value = MDFiveConverter.convert(dataString);
 
     this.projet = {
       id: md5Value,
       nom: nom,
       question: question,
       reponses: reponses
     };
   }
 
   setQuestion(question) {
     this.projet.question = question;
   }
 
   addReponse(reponse) {
     this.projet.reponses.push(reponse);
   }
 
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
 
   removeQuestion(){
     for(let reponse of this.projet.question.qrcode.data) {
       this.projet.question.removeReponse(reponse.id);
     }
     this.projet.reponses = [];
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
 
class QuestionExoVocal {
    //Constructeur d'une Question
    constructor(title, nombreReponse, reponsesUIDs = [], text_bonne_reponse, text_mauvaise_reponse, color = '#000000') {
      this.qrcode = {
        id: new Date().getTime(),
        name: title,
        nbReponse: nombreReponse,
        data: reponsesUIDs,
        type: "questionExoVocal",
        color: color,
        text: "",
        text_bonne_reponse: text_bonne_reponse,
        text_mauvaise_reponse: text_mauvaise_reponse
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
  
    getText(){
      return this.qrcode.text;
    }
  
    setText(){
      this.qrcode.text = this.qrcode.name;
  
      for(let i=0; i<this.qrcode.data.length; ++i) {
        this.qrcode.text += " réponse " + (i+1) + " " + this.qrcode.data[i].message + " ";
      }
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
  
    addReponse(reponseUid, message) {
      this.qrcode.data.push({"id": reponseUid, "message":message});
  
      this.setText();
    }
  
    removeReponse(reponseUid){
      for(let rep of this.qrcode.data){
        if(rep.id == reponseUid){
          var index = this.qrcode.data.indexOf(rep);
          this.qrcode.data.splice(index, 1);
        }
      }
  
      this.setText();
    }
  
    getDataString() {
      return JSON.stringify(this.qrcode);
    }
  }
  
  /*
   *Classe permettant de creer une reponse
   */
  class ReponseExoVocal {
    constructor(name, isAnswer, color = '#000000') {
      this.qrcode = {
        id: new Date().getTime(),
        name: name,
        data: [],
        type: "reponseExoVocal",
        color: color,
        isAnswer: isAnswer
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
  
    getIsAnswer() {
        return this.qrcode.isAnswer;
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
    ProjetExoVocal,
    ReponseExoVocal,
    QuestionExoVocal
  };