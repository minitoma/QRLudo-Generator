
$(document).ready(function() {

  // pour les tabs
  $(".nav-tabs a").click(function(){
      $(this).tab('show');
  });
  $('.nav-tabs a').on('shown.bs.tab', function(event){
      var x = $(event.target).text();         // active tab
      var y = $(event.relatedTarget).text();  // previous tab
      $(".act span").text(x);
      $(".prev span").text(y);
  });

  document.addEventListener('click', modalMusic); // affichage du popup de la liste des musiques
  document.getElementsByClassName("createTabs")[0].addEventListener('click', createTabs); // récupérer le click derriére bouton create
  document.addEventListener('click', closeTab); // sur click du bouton closeTab
  document.addEventListener('click', addChamp); // sur click du bouton addChamp

  document.getElementById('modalMusic').addEventListener('click', function(){
    selectMusic(event);
  }); // sur clic d'un lien de musique

});


// fermer le premier popup avant que celui de la liste des musiques ne s'affiche
function modalMusic(event) {
  var element = event.target;
  if(element.tagName == 'BUTTON' && element.classList.contains("set-music")){
    document.getElementById('closeModal').click();
  }
}

// renseigner la musique sur un champ texte et l'afficher
function selectMusic(event) {
  if (event) {
    var element = event.target;

    if(element.tagName == 'A') {

      var form = document.getElementsByClassName('in active')[0].childNodes[0].childNodes[0];

      var label = createLabel('titreMusique','Titre Musique');
      var input = createInput('text', 'form-control', element.getAttribute('href').substring(1), element.childNodes[0].nodeValue);
      input.disabled = 'true';

      var div = createDiv('form-group', '', [label, input]);

      form.appendChild(div);
      document.getElementById('closeModalMusique').click(); // fermer le popup de musique
      console.log(element);
      console.log(form);
      console.log("numero input " + idInputText);
    }
  }
}

// fonction pour fermer un onglet
function closeTab(event){
    var element = event.target;
    if(element.tagName == 'BUTTON' && element.classList.contains("closeTab")){
        console.log(element.parentNode.parentNode.parentNode.id);
        console.log(document.getElementsByClassName(element.parentNode.parentNode.parentNode.id));
        console.log(document.getElementById(element.parentNode.parentNode.parentNode.id));
        // retrouver l'id tab parent et le supprimer de <ul class="nav nav-tabs">
        document.querySelector('.nav-tabs').removeChild(document.getElementsByClassName(element.parentNode.parentNode.parentNode.id)[0]);
        // retrouver l'element apr son id et le supprimer de <div class="tab-content">
        document.getElementsByClassName('tab-content')[0].removeChild(document.getElementById(element.parentNode.parentNode.parentNode.id));
    }
}

// effacer la liste des musiques avant de fermer le popup musique
function closeModalMusique(event) {
  if (event) {
    var element = event.target;
    childNodes = element.parentNode.parentNode.childNodes[3];

    while (childNodes.firstChild) {
      childNodes.removeChild(childNodes.firstChild);
    }
  }
}





/*
var element = document.getElementById('set-music');
if (element) {
if (element.addEventListener) {
  element.addEventListener("click", function(){
    var div = document.createElement('div');
    div.setAttribute('class', 'modal fade');
    div.setAttribute('role', 'dialog');
  });

    //element.addEventListener("click", myFunction);
} else if (element.attachEvent) {
    element.attachEvent("onclick", myFunction);
}
}

function myFunction( ){}

  //div.setAttribute('class', 'modal fade');
*/
/*

  <!-- Popup -->
  <div class="modal fade" id="myModal" role="dialog">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">

        <div class="row modal-body">
          <div class="col-lg-12">
            <h4 class="modal-title">Ajouter un champ</h4>
          </div>
        </div>

        <div class="modal-header">
          <button type="button" class="btn btn-default btn-popup set-legende" onclick="createTextBox()">Texte</button>
          <button type="button" class="btn btn-default btn-popup set-music">Musique</button>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal" id="closeModal">Annuler</button>
        </div>

      </div>
    </div>
  </div>
*/

//});
