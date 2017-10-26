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


  document.getElementsByClassName("createTabs")[0].addEventListener('click', createTabs); // récupérer le click derriére bouton create
  document.addEventListener('click', closeTab); // sur click du bouton closeTab
  document.addEventListener('click', addChamp); // sur click du bouton addChamp

  document.getElementById('modalMusic').addEventListener('click', function(){
    selectMusic(event);
  }); // sur clic d'un lien de musique

});


var idMenu = 1; // pour identifier de facon unique les menus

// fonction pour créér des tabs
function createTabs () {
  var li = document.createElement('li');
  li.setAttribute('class', 'menu'+idMenu);

  if (idMenu == 1) {
    li.setAttribute('class', 'active menuActive menu'+idMenu);
  }

  var a = document.createElement('a');
  a.setAttribute('data-toggle', 'tab');
  a.setAttribute('href', '#menu'+idMenu);
  var texte = document.createTextNode('Tab ' + idMenu);
  a.appendChild(texte);
  li.appendChild(a);
  document.querySelector('.nav-tabs').appendChild(li);

  createTabContent(a.getAttribute('href'), idMenu);
  idMenu++;
}

// créer le contenu des tabs
function createTabContent (id, idMenu) {

  var child = [createForm('myForm')];
  var div2 = createDiv('row', 'content-form', child);

  var button = createButton('button', 'btn btn-default addChamp', 'modal', '#myModal', document.createTextNode('Ajouter un champ'));
  var child = [button];
  var div4 = createDiv('col-md-6', '', child);

  var button = createButton('button', 'btn btn-default closeTab', '', '', document.createTextNode('Annuler'));
  var child = [button];
  var div5 = createDiv('col-md-6', '', child);

  var child = [div4, div5];
  var div3 = createDiv('row', '', child);

  var child = [div2, div3];

  var classe = 'tab-pane fade';
  if (idMenu == 1) {
    classe = 'tab-pane fade in active';
  }

  var div = createDiv(classe, id.substring(1), child);

  document.getElementsByClassName('tab-content')[0].appendChild(div);
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

// fonction pour ajouter un champ
function addChamp(event) {
  var element = event.target;
  if(element.tagName == 'BUTTON' && element.classList.contains("addChamp")){
    // retourne le formulaire contenu dans le tab active
    var form = document.getElementsByClassName('in active')[0].childNodes[0].childNodes;
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
