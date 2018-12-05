




/*
 * @Author: SALIM Youssef
 * @Date:   2018-Oct
 */

 //ce fichier regroupe toutes les fonctions et scripts en commun avec d'autres pages

 $().ready(function() {
   window.jquery = window.$ = require("./node_modules/jquery/dist/jquery.js");

   //pour chaque item dans le menu on charge une page html
   $("#unique-html").click(function() {
     $("#charger-page").load("Views/unique.html");
   });
   $("#ensemble-html").click(function() {
     $("#charger-page").load("Views/ensemble.html");
   });
   $("#quesRep-html").click(function() {
     $("#charger-page").load("Views/quesRep.html");
   });
   $("#parametres-html").click(function(){
     console.log("parametre click");
     $("#charger-page").load("Views/parametres.html");
   });


   //l'element du menu courant -> class="... active"
   $('#menu li').click(function(e) {
     e.preventDefault();
     $('li').removeClass('active');
     $(this).addClass('active');
   });

   //sert à reduire le menu ou l'afficher d'une maniere responsive
    $('#sidebarCollapse').on('click', function() {
      $('#sidebar').toggleClass('active');
    });

});


//supprimer les messages d'infos en haut de page
function initMessages(){
  var divMsg = document.getElementById('messages');
   if(divMsg.firstChild)
        divMsg.removeChild(divMsg.firstChild);
}


//message a afficher lors d'un : sauvegarde | Champ vide | Export etc...
//type: "success" | "danger" | "warning" | "info"
function messageInfos(message,type){
  initMessages();
  var msg = document.createElement('div');
  msg.innerHTML = message
                    +"<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
  msg.setAttribute("class", "alert alert-"+type+" fade show");
  msg.setAttribute("role", "alert");
  document.getElementById('messages').appendChild(msg);

}


// exporter un QR-Code sous l'extension .jpeg
// save image qr code
// ex: path = /QR-Unique/QR/
function saveQRCodeImage(path) {
  const fs = require('fs');

  let img = $('#qrView img')[0].src;

  var data = img.replace(/^data:image\/\w+;base64,/, '');

  fs.writeFile(`${root}`+path+`${qrcode.getName()}.jpeg`, data, {
    encoding: 'base64'
  }, (err) => {
    if (err) throw err;
    messageInfos("votre QR est bien sauvegardé","success");
  });

}

//creer+sauvegarder le fichier json correspond à un qrcode qui depasse la taille 500
function sauvegarderFichierJsonUnique(nomFichier,path){

  path += nomFichier+".json";
  fs.writeFile(path, JSON.stringify(nomFichier), (err) => {
      if (err) {
          console.error(err);
          return;
      };
      messageInfos("votre fichier json est bien sauvegardé","success");
  });
}
