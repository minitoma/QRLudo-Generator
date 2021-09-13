/**
 * @Author: SALIM Youssef
 * @Date:   2018-Oct
 */
/** ce fichier regroupe toutes les fonctions et scripts en commun avec les autres pages */
$(function() {

  /** Pour chaque item dans le menu on charge une page html */
  $("#accueil-html").on('click',function() {
    $("#charger-page").load(path.join(__dirname.match('.*app')[0], "/rendererProcess/view/accueil/accueil.html"), loadDefaultColor);
  });
  $("#unique-html").on('click',function() {
    isImportationQRUnique = false;
    $("#charger-page").load(path.join(__dirname.match('.*app')[0], "/rendererProcess/view/uniqueQr/unique.html"), loadDefaultColor);
  });
  $("#multiple-html").on('click',function() {
    $("#charger-page").load(path.join(__dirname.match('.*app')[0], "/rendererProcess/view/multipleQr/multiple.html"), loadDefaultColor);
  });
  $("#quesRep-html").on('click',function() {
    $("#charger-page").load(path.join(__dirname.match('.*app')[0], "/rendererProcess/view/exerciceQr/exerciceQrCode.html"), loadDefaultColor);
  });
  $("#rec-vocale-html").on('click',function() {
    isImportationExerciceRecoVocaleQCM = false;
    $("#charger-page").load(path.join(__dirname.match('.*app')[0], "/rendererProcess/view/exerciceReconnaissanceVocale/exerciceReconnaissanceVocale.html"), loadDefaultColor);
  });
  $("#serious-html").on('click',function() {
    $("#charger-page").load(path.join(__dirname.match('.*app')[0], "/rendererProcess/view/seriousGame/seriousGame.html"), loadDefaultColor);
  });
  $("#parametres").on('click',function(){
    $("#charger-page").load(path.join(__dirname.match('.*app')[0], "/rendererProcess/view/parametres/parametres.html"));
  });
  $("#infos").on('click',function(){
    $("#charger-page").load(path.join(__dirname.match('.*app')[0], "/rendererProcess/view/aide/info.html"));
  });

  /** l'element du menu courant -> class="... active" */
  $('#menu li').on('click',function(e) {
    e.preventDefault();
    $('li').removeClass('active');
    $(this).addClass('active');
  });

  /** sert à reduire le menu ou l'afficher d'une maniere responsive */
  $('#sidebarCollapse').on('click', function() {
    $('#sidebar').toggleClass('active');
  });

});

function loadDefaultColor(){
  var settings = require('@electron/remote').require("electron-settings");

  if (settings.hasSync("defaultColor")) {
    $("#qrColor").val(settings.getSync("defaultColor"));
  }
}

/** supprimer les messages d'infos en haut de page */
function initMessages() {
  var divMsg = document.getElementById('messages');
  if (divMsg.firstChild)
    divMsg.removeChild(divMsg.firstChild);
}

/** 
 * message a afficher lors d'un : sauvegarde | Champ vide | Export ...
 * type: success | danger | warning
 */
function messageInfos(message, type) {
  initMessages();
  var msg = document.createElement('div');
  msg.innerHTML = message +
    "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
  msg.setAttribute("class", "alert alert-" + type + " fade show");
  msg.setAttribute("role", "alert");
  document.getElementById('messages').appendChild(msg);
}

/** creer+sauvegarder le fichier json correspond à un qrcode qui depasse la taille 500 */
function sauvegarderFichierJsonUnique(nomFichier, path) {

  path += nomFichier + ".json";
  fs.writeFile(path, JSON.stringify(nomFichier), (err) => {
    if (err) {
      console.error(err);
      return;
    };
    messageInfos("votre fichier json est bien sauvegardé", "success");
  });
}
