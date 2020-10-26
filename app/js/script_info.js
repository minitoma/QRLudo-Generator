/**
 * @Author: alassane
 * @Date:   2018-12-10T13:37:39+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-10T21:54:12+01:00
 */

$(document).ready(function () {
  $('div.info-content').css('display', 'none');

  $("a.nav-link").click(e => {
    emptyAutoInfos();
    
    e.preventDefault();
    let element = e.target;
    let tab = $(element).attr('href');

    $('a').attr('class', 'nav-item nav-link');
    $('div.tab-pane').attr('class', 'tab-pane');

    $(element).addClass('active');
    $(tab).addClass('active');
  });
  
  $('.tab-content').find('a').click(e => {
    let href = $(e.target).attr('href');
    let display = $(href).css('display');

    if (display == 'block')
      $(href).fadeOut();
    else
      $(href).fadeIn();
  });


});

function emptyAutoInfos() {
  switch (require('electron').remote.getGlobal('sharedObject').someProperty) {
    case 'unique':
      document.getElementById("unique-info").classList.remove("active");
      document.getElementById("info-unique").style.display = "none";
      break;
    case 'multiple':
      document.getElementById("multiple-info").classList.remove("active");
      document.getElementById("info-multiple").style.display = "none";
      break;
    case 'questRep':
      document.getElementById("questRep-info").classList.remove("active");
      document.getElementById("info-exercice").style.display = "none";
      break;
  }
}

function allowDivInfos() {
  switch (require('electron').remote.getGlobal('sharedObject').someProperty) {
    case 'unique':
      document.getElementById("unique-info").classList.add("active");
      //document.getElementById("info-unique").style.display = "block";
      break;
    case 'multiple':
      document.getElementById("multiple-info").classList.remove("active");
      document.getElementById("info-multiple").style.display = "none";
      break;
    case 'questRep':
      document.getElementById("questRep-info").classList.remove("active");
      document.getElementById("info-exercice").style.display = "none";
      break;
  }
}
