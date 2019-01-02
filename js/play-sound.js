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

function getData(){
  return $(".qrData");
}

//Retourne un objet Howl (lecteur de fichier)
function createNewHowlSound(filepath){
  sound = new Howl({
    src: [filepath],
    onend: function(){
      $("#pauseLecture").hide();
      $("#playLecture").show();
      $("#nextLecture").click();
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
      if(getCurrentRead().value !== ''){
        playTTS();
      }
      else{
        $("#alertLectureChampVide").show();
        setTimeout(function () {
          $('#alertLectureChampVide').hide();
        }, 5000);
        $("#nextLecture").click();
        return;
      }
    }
  }
  else{
    sound.play();
  }

  var div = getCurrentRead();

  $(div).parent().children('.fa-play').show();
  $(div).parent().children('.fa-pause').hide();

  $("#nextLecture").attr("disabled", currentRead===getData().length-1);
  $("#prevLecture").attr("disabled", currentRead===0);

  $("#stopLecture").attr("disabled", false);
  $("#playLecture").hide();
  $("#pauseLecture").show();
  paused = false;
}

function stop() {
  var div = getCurrentRead();
  $(div).parent().children('.fa-play').hide();
  $(div).parent().children('.fa-pause').hide();

  if(sound !== null){
    sound.unload();
  }
  paused = false;
}

//Clic sur play
$("#playLecture").on("click", function(){
  $("#alertLectureAucunChamp").hide();
  $("#alertLectureChampVide").hide();
  if(getData().length!==0){
    play();
  }
  else{
    $("#alertLectureAucunChamp").show();
    setTimeout(function () {
      $('#alertLectureAucunChamp').hide();
    }, 5000);
  }
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
  var div = getCurrentRead();
  $(div).parent().children('.fa-play').hide();
  $(div).parent().children('.fa-pause').show();
  sound.pause();
  $("#pauseLecture").hide();
  $("#playLecture").show();
  paused = true;
});

//Clic sur suivant
$("#nextLecture").on("click", function(){
  stop();
  currentRead++;
  if(currentRead < getData().length){
    play();
  }
  else{
    $("#stopLecture").click();
  }
});

//Clic sur précédant
$("#prevLecture").on("click", function(){
  stop();
  if(currentRead > 0){
    currentRead--;
  }
  play();
});
