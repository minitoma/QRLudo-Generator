// When the user clicks on div, open the popup
function myFunction() {
    var popup = document.getElementById("myModal");
    popup.classList.toggle("show");
}

// fcontion pour créer un label
function createLabel ($for, $texte) {
  var label = document.createElement('label');
  label.setAttribute('for', $for);
  var texte = document.createTextNode('Légende');
  label.appendChild(texte);
  return label;
}

// fonction pour une zone de texte
function createInput ($type, $classe, $id) {
  var input = document.createElement('input');
  input.setAttribute('type', $type);
  input.setAttribute('class', $classe);
  input.setAttribute('id', $id);
  return input;
}

// Générer une zone de texte
function createTextBox() {
  var div = document.createElement('div');
  div.setAttribute('class', 'form-group');
  div.appendChild(createLabel('legende', 'Légende'));
  div.appendChild(createInput('text', 'form-control', 'legende'));

  var form = document.getElementById('myForm');
  form.appendChild(div);
  document.getElementById('closeModal').click(); // fermer le popup
}

// Générer un champ pour de la musique
function createMusicBox() {
  var div = document.createElement('div');
  div.setAttribute('class', 'form-group');

  div.appendChild(createLabel('lienMusic', 'Lien de la Musique'));

  var input = document.createElement('input');
  input.setAttribute('type', 'text');
  input.setAttribute('class', 'form-control');
  input.setAttribute('id', 'legende');
  
  div.appendChild(input);

  var form = document.getElementById('myForm');
  form.appendChild(div);

  document.getElementById('closeModal').click(); // fermer le popup
}

/*
var form = document.getElementById('myForm');

document.getElementById('addText').addEventListener('click', function(e) {
  form.appendChild(createTextBox());
});
*/


/*
// Générer une zone de texte
function createTextBox() {
  var input = document.createElement('input');
  input.type = 'text';
  return input;
}
*/
