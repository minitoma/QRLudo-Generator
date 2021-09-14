/**
 * @Author: alassane
 * @Date:   2018-12-10T13:37:39+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-10T21:54:12+01:00
 */

$(document).ready(function () {
  $('div.info-content').css('display', 'none');

  $("#content a.nav-link").on('click',e => {
    e.preventDefault();
    let element = e.target;
    console.log('script_info.on(click, a.nav-link) : element '+ element);
    let tab = $(element).attr('href');

    $('a').attr('class', 'nav-item nav-link');
    $('div.tab-pane').attr('class', 'tab-pane');

    $(element).addClass('active');
    $(tab).addClass('active');
  });
  
  $('.tab-content').find('a').on('click',e => {
    let href = $(e.target).attr('href');
    let display = $(href).css('display');

    if (display == 'block')
      $(href).fadeOut();
    else
      $(href).fadeIn();
  });
});

$("#unique-info").on('click',function(){
  $("#info-unique").css("display","block");
  $("#info-multiple").css("display","none");
  $("#info-exercice-qrcode").css("display","none");
  $("#info-exercice-reco-vocale").css("display", "none");
  $("#info-serious-game").css("display", "none");
  $("#info-MusicInput").css("display","none");
  $("#info-Import").css("display","none");
});

$("#multiple-info").on('click',function(){
  $("#info-unique").css("display","none");
  $("#info-multiple").css("display","block");
  $("#info-exercice-qrcode").css("display","none");
  $("#info-exercice-reco-vocale").css("display", "none");
  $("#info-serious-game").css("display", "none");
  $("#info-MusicInput").css("display","none");
  $("#info-Import").css("display","none");
});

$("#exo-qrcode-info").on('click',function(){
  $("#info-unique").css("display","none");
  $("#info-multiple").css("display","none");
  $("#info-exercice-qrcode").css("display","block");
  $("#info-exercice-reco-vocale").css("display", "none");
  $("#info-serious-game").css("display", "none");
  $("#info-MusicInput").css("display","none");
  $("#info-Import").css("display","none");
});

$("#exo-reco-vocale-info").on('click',function(){
  $("#info-unique").css("display","none");
  $("#info-multiple").css("display","none");
  $("#info-exercice-qrcode").css("display","none");
  $("#info-exercice-reco-vocale").css("display", "block");
  $("#info-serious-game").css("display", "none");
  $("#info-MusicInput").css("display","none");
  $("#info-Import").css("display","none");
});

$("#serious-game-info").on('click',function(){
  $("#info-unique").css("display","none");
  $("#info-multiple").css("display","none");
  $("#info-exercice-qrcode").css("display","none");
  $("#info-exercice-reco-vocale").css("display", "none");
  $("#info-serious-game").css("display", "block");
  $("#info-MusicInput").css("display","none");
  $("#info-Import").css("display","none");
});

$("#music-info").on('click',function(){
  $("#info-unique").css("display","none");
  $("#info-multiple").css("display","none");
  $("#info-exercice-qrcode").css("display","none");
  $("#info-exercice-reco-vocale").css("display", "none");
  $("#info-serious-game").css("display", "none");
  $("#info-MusicInput").css("display","block");
  $("#info-Import").css("display","none");
});

$("#import-info").on('click',function(){
  $("#info-unique").css("display","none");
  $("#info-multiple").css("display","none");
  $("#info-exercice-qrcode").css("display","none");
  $("#info-exercice-reco-vocale").css("display", "none");
  $("#info-serious-game").css("display", "none");
  $("#info-MusicInput").css("display","none");
  $("#info-Import").css("display","block");
});
