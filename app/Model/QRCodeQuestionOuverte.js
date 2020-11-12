const {
    MdFiveConverter
  } = require(`${root}/Controller/MDFiveConverter`);
 

class QRCodeQuestionOuverte {
    //Constructeur d'une Question
    constructor(title, reponse, text_bonne_reponse, text_mauvaise_reponse, color = '#000000') {
      this.qrcode = {
        id: new Date().getTime(),
        name: title,
        data: reponse,
        type: "ExerciceReconnaissanceVocaleQCM",
        color: color,
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
  
  module.exports = {
    QRCodeQuestionOuverte
  };