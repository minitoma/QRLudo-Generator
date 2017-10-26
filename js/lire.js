var googleTTS = require('google-tts-api');

$(document).ready(function() {

  document.getElementById('read').addEventListener('click', function(){
    getForm();
  }); // sur clic du bouton Lire pour ecouter les textes saisis
});


// réupérer le formulaire et tous les champs
function getForm() {
  var form = document.getElementsByClassName('in active')[0].childNodes[0].childNodes[0];
  var texte = "";
  // parcourir le formulaire
  for (var i=0; i<form.length; i++) {
    try {
        if (form.elements[i].type == "text") {
          texte = texte + form.elements[i].value + " ";
      } else {
        console.log("pas de type texte");
      }
    } catch (err) {
      document.getElementById(form.elements[i].id).innerHTML = err.message;
    }
  }
/*  // parcourir le formulaire
  for (var i=0; i<form.length; i++) {
    if (form.elements[i].type == "text") {
      callback(form.elements[i].value);
    } else {
      console.log("pas de type texte");
    }
  } */
  listen(texte);
}

// Fonction pour lire en audio une données
function listen(texte) {
  // Play the received speech
    googleTTS(texte, 'fr', 1)   // speed normal = 1 (default), slow = 0.24
    .then(function (url) {
      console.log(url); // https://translate.google.com/translate_tts?...
      var audio = new Audio(url);
      audio.play();
    })
    .catch(function (err) {
      console.error(err.stack);
    });
}
