




/*
 * @Author: SALIM Youssef
 * @Date:   2018-Oct
 */

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
