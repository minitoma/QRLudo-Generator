var {Howl, Howler} = require('howler');
var sound = null;

var player = null;

var startedAt;
var pausedAt;
var paused = false;

var currentRead = 0;

$(document).ready(function(){
  $("#playLecture").attr("disabled", false);
  $("#prevLecture").attr("disabled", true);
  $("#nextLecture").attr("disabled", true);
  $("#stopLecture").attr("disabled", true);
  $("#pauseLecture").hide();
});

function getCurrentRead(){
  return $(".qrData")[currentRead];
}

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

function playSound(){
  var data = getCurrentRead();
  sound = createNewHowlSound('./Download/'+data.value);
  sound.play();
}

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

$("#playLecture").on("click", function(){
  play();
});

$("#stopLecture").on("click", function(){
  stop();
  $("#prevLecture").attr("disabled", true);
  $("#nextLecture").attr("disabled", true);
  $("#stopLecture").attr("disabled", true);
  $("#pauseLecture").hide();
  $("#playLecture").show();
  currentRead = 0;

});

$("#pauseLecture").on("click", function(){
  sound.pause();
  $("#pauseLecture").hide();
  $("#playLecture").show();
  paused = true;
});

$("#nextLecture").on("click", function(){
  stop();
  currentRead++;
  play();
});

$("#prevLecture").on("click", function(){
  stop();
  currentRead--;
  play();
});
