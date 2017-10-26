
$(document).ready(function() {

  document.addEventListener('click', modalMusic); // affichage du popup de la liste des musiques
});

// fermer le premier popup avant que celui de la liste des musiques ne s'affiche
function modalMusic(event) {
  var element = event.target;
  if(element.tagName == 'BUTTON' && element.classList.contains("set-music")){
    document.getElementById('closeModal').click();
  }
}


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
