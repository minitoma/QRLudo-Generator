var {Howl, Howler} = require('howler');
var sound = null;

var paused = false;

var currentRead = 0;

$(document).ready(function(){
  $("#playLecture").attr("disabled", false);
  $("#prevLecture").attr("disabled", true);
  $("#nextLecture").attr("disabled", true);
  $("#stopLecture").attr("disabled", true);
  $("#pauseLecture").hide();
});

//Tous les éléments à lire sont de la classe .qrData, on récupère l'élément courant
//de ce tableau
function getCurrentRead(){
  return $(".qrData")[currentRead];
}

//Retourne un objet Howl (lecteur de fichier)
function createNewHowlSound(filepath){
  sound = new Howl({
    src: [filepath],
    onend: function(){
      $("#pauseLecture").hide();
      $("#playLecture").show();
      stop();
    }
  });

  return sound;
}

//Permet de jouer un fichier mp3
function playSound(){
  var data = getCurrentRead();
  sound = createNewHowlSound('./Download/'+data.value);
  sound.play();
}

//Permet de jouer le text to speech
//Enregistre le texte lu par voix de synthèse dans le fichier tts/current_tts.mp3
//puis le joue avec un objet Howl (lecteur de fichier mp3)
function playTTS(){
  var gtts = require('node-gtts')('fr');
  var filepath = path.join('./tts/', 'current_tts.mp3');
  var fs = require('fs');

  gtts.save(filepath, getCurrentRead().value , function() {
    sound = createNewHowlSound(filepath);
    sound.play();
  });
}

function play(){
  //Si l'état n'est pas en pause, alors on commence une nouvelle lecture
  //Sinon on reprend là où la lecture s'était arrêtée
  if(!paused){
    if(getCurrentRead().name==='AudioName'){
      playSound();
    }
    else if (getCurrentRead().name==='legendeQR') {
      playTTS();
    }
  }
  else{
    sound.play();
  }


  //si c'est le premier champ, on désactive le bouton previous
  $("#prevLecture").attr("disabled", currentRead===0);
  //si c'est le dernier champ, on désactive le bouton next
  $("#nextLecture").attr("disabled", currentRead===$(".qrData").length-1);

  $("#stopLecture").attr("disabled", false);
  $("#playLecture").hide();
  $("#pauseLecture").show();
  paused = false;
}

function stop() {
  sound.unload();
  paused = false;
}

//Clic sur play
$("#playLecture").on("click", function(){
  play();
});

//Clic sur stop
$("#stopLecture").on("click", function(){
  stop();
  $("#prevLecture").attr("disabled", true);
  $("#nextLecture").attr("disabled", true);
  $("#stopLecture").attr("disabled", true);
  $("#pauseLecture").hide();
  $("#playLecture").show();
  currentRead = 0;

});

//Clic sur pause
$("#pauseLecture").on("click", function(){
  sound.pause();
  $("#pauseLecture").hide();
  $("#playLecture").show();
  paused = true;
});

//Clic sur suivant
$("#nextLecture").on("click", function(){
  stop();
  currentRead++;
  play();
});

//Clic sur précédant
$("#prevLecture").on("click", function(){
  stop();
  currentRead--;
  play();
});
