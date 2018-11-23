/*!
 * @Author: SALIM
 */
 $().ready(function() {
 window.jquery = window.$ = require("./node_modules/jquery/dist/jquery.js");
 $("#unique-html").click(function() {
   $("#charger-page").load("Views/unique.html");
 });
 $("#ensemble-html").click(function() {
   $("#charger-page").load("Views/ensemble.html");
 });
 $("#quesRep-html").click(function() {
   $("#charger-page").load("Views/quesRep.html");
 });


 $('#menu li').click(function(e) {
   e.preventDefault();
   $('li').removeClass('active');
   $(this).addClass('active');
 });


  $('#sidebarCollapse').on('click', function() {
    $('#sidebar').toggleClass('active');
  });

});
