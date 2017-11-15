
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
  document.getElementById('setFamilyName').addEventListener('click', createTabs); // récupérer le click derriére bouton create
  document.addEventListener('click', function(){ // sur click du bouton closeTab
    closeTab(event);
  });
  document.addEventListener('click', addChamp); // sur click du bouton addChamp

  document.getElementById('modalMusic').addEventListener('click', function(){
    selectMusic(event);
  }); // sur clic d'un lien de musique
  document.getElementById('setImportedFile').addEventListener('click', importFile);

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
function closeTab(event) {
  if(event.target.tagName == 'BUTTON' && event.target.classList.contains("closeTab")) {
    var element = event.target;
    console.log(element.parentNode.parentNode.parentNode.id);
    console.log(document.getElementsByClassName(element.parentNode.parentNode.parentNode.id));
    console.log(document.getElementById(element.parentNode.parentNode.parentNode.id));
    // retrouver l'id tab parent et le supprimer de <ul class="nav nav-tabs">
    document.querySelector('.nav-tabs').removeChild(document.getElementsByClassName(element.parentNode.parentNode.parentNode.id)[0]);
    // retrouver l'element apr son id et le supprimer de <div class="tab-content">
    document.getElementsByClassName('tab-content')[0].removeChild(document.getElementById(element.parentNode.parentNode.parentNode.id));

    // définit le tab 1 comme celui active
    if (document.getElementsByClassName('tab-pane fade').length != 0
        && document.getElementsByClassName('tab-pane fade active in').length == 0) {
      document.getElementsByClassName('tab-pane fade')[0].setAttribute('class', 'tab-pane fade active in');
    }
    if (document.getElementsByClassName('menu').length != 0
        && document.getElementsByClassName('active menu').length == 0) {
      document.getElementsByClassName('menu')[0].setAttribute('class', 'active ' +
          document.getElementsByClassName('menu')[0].getAttribute('class'));
    }
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

// fonction pour charger un QRCode
function importFile() {
  document.getElementById('closeModalImport').click(); // fermer le popup d'import

  // recupérer le fichier
  var importedFile = document.getElementById('importedFile').files[0];
  if (importedFile) {
    FacadeController.importQRCode(importedFile);
  }
}

// définir le dernier tab créé comme celui active (tab et tabcontent)
function setActive (div, li) {
  if (document.getElementsByClassName('tab-pane fade active in').length == 0) {
    div.setAttribute('class', 'tab-pane fade active in');
  } else {
    var div2 = document.getElementsByClassName('tab-pane fade active in')[0];
    div2.setAttribute('class', 'tab-pane fade');
    div.setAttribute('class', 'tab-pane fade active in');
  }

  if (document.getElementsByClassName('active menu').length == 0) {
    li.setAttribute('class', 'active menu menu'+idMenu);
  } else {
    var li2 = document.getElementsByClassName('active menu')[0];
    console.log(li2);
    var id = li2.getAttribute('class').match(/\d+/g).join(''); // retourne le chiffre dans la chaine
    console.log(id);
    li2.setAttribute('class', 'menu menu' + id);
    li.setAttribute('class', 'active menu menu'+idMenu);
  }


}
