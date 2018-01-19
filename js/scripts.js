/*
// voir les erreurs en alert
window.onerror = function (msg, url, lineNo, columnNo, error) {
    var string = msg.toLowerCase();
    var substring = "script error";
    if (string.indexOf(substring) > -1){
        alert('Script Error: See Browser Console for Detail');
    } else {
        var message = [
            'Message: ' + msg,
            'URL: ' + url,
            'Line: ' + lineNo,
            'Column: ' + columnNo,
            'Error object: ' + JSON.stringify(error)
        ].join(' - ');

        alert(message);
    }
    return false;
};
*/

// essayer de charger tous les modules nécessaires, sinon erreur renvoyée
/*try {
  require(__dirname + '/node_modules/bootstrap/');
  require(__dirname + '/node_modules/braille/');
  require(__dirname + '/node_modules/electron/');
  require(__dirname + '/node_modules/electron-debug/');
  require(__dirname + '/node_modules/electron-packager/');
  require(__dirname + '/node_modules/file-saver/');
  require(__dirname + '/node_modules/google-auth-library/');
  require(__dirname + '/node_modules/google-tts-api/');
  require(__dirname + '/node_modules/googleapis/');
  require(__dirname + '/node_modules/jquery/');
  require(__dirname + '/node_modules/jquery-qrcode/');
  require(__dirname + '/node_modules/piexifjs/');
} catch (ex) {
  alert(ex);
}*/

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

  // pour rendre les listes sortables
  $(function() {
    $("#sortable").sortable();
    $("#sortable").disableSelection();
  });

  $(function(){
    $('#sortable > li').click(function(event){
      $('.tab-content-liste-content > div').css('display', 'none');
      $('.tab-content-liste-content > div.'+event.target.id).css('display', 'block');
    });
  });

  // desactiver les boutons preview et lire s'il y a rien à lire ou preview
  document.getElementById('preview').disabled = true;
  document.getElementById('read').disabled = true;

  // desactiver exporter, faut preview avant de pouvoir exporter
  document.getElementById('btnExportFile').disabled = true;

  // désactiver le bouton créer s'il s'agit de qrcode unique
  document.getElementById('qrCodeAtomique').addEventListener('click', function(){
  document.getElementById('creer').disabled = true;
  document.getElementById('modalFamilyName').childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[1].textContent = "Nom du QRCode";

  });

  // fonction pour dispatcher
  document.addEventListener('click', function(){
    recognizeFunction(event);
  });

  //document.addEventListener('click', addChamp); // sur click du bouton addChamp

  document.getElementById('modalMusic').addEventListener('click', function(){
    selectMusic(event, null);
  }); // sur clic d'un lien de musique
  document.getElementById('setImportedFile').addEventListener('click', importFile);
  document.getElementById('btnExportFile').addEventListener('click', function(){
    exportFile(false);
  });
  document.getElementById('previewFamily').addEventListener('click',previewFamily);
  document.getElementById('saveFamily').addEventListener('click', function(){
    exportFile(true);
  });
  $('#initView').click(function(){ init_View(); });

});


// fonction pour appeler la foncton sollicitée
function recognizeFunction (event) {
  var element = event.target;
  if (element.tagName == 'BUTTON' && element.classList.contains("set-music")){
    modalMusic();
    createMusicBox();
  } else if (element.tagName == 'INPUT' && element.classList.contains("closeTab")) {
    closeTab(element);
  }
}

// fermer le premier popup avant que celui de la liste des musiques ne s'affiche
function modalMusic() {
  document.getElementById('closeModal').click();
}

// renseigner la musique sur un champ texte et l'afficher
function selectMusic (event, imported) {
  var div2;
  if (event && imported == null) {
    var element = event.target;

    if(element.tagName == 'A') {
      //div2 = createDiv('col-md-9', null, [createInput('text', 'form-control', element.getAttribute('href').substring(1), element.textContent, null, null, null,null)]);
      var textarea = createTextarea('form-control', 'legende', element.textContent);
      textarea.setAttribute('disabled', true);
      var div2 = createDiv('col-md-12', null, [textarea]);
    }
  } else if (event == null && imported) {
    div2 = createDiv('col-md-9', null, [createInput('text', 'form-control', imported[0], imported[1], null, null, null, null)]);
  }

  var btnAdd    =   createClickableImg('addChamp', 'add.png', 'Ajouter un nouveau champ');
  var btnDelete =   createClickableImg('deleteChamp', 'delete.png', 'Supprimer ce champ');
  var btnPlay   =   createClickableImg('playChamp', 'play.png', 'Ecouter le contenu du champ');

  var span = document.createElement('SPAN');
  span.append(btnAdd, btnDelete, btnPlay);
  var div3 = createDiv('col-md-12 optButton', null, [span]);
  var div = createDiv('form-group', null, [createDiv('row', null, [div2, div3])]);

  var idActive = $('li.active').attr('id');
  var form = $('div#content-item.'+idActive).find($('form#myFormActive'));
  form.append(div);

  // ajouter un eventlistener sur playChamp pour lire le champ sur click du bouton
  btnPlay.addEventListener('click', function(event){
    console.log(event.target);
    var texte = event.target.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].value;
    getForm(texte);
  });
  // ajouter un eventlistener sur deleteChamp pour supprimer le champ sur click du bouton
/*  btnDelete.addEventListener('click', function(){
    form.removeChild(div); // suppression du champ
    // ajout des btn add et delete au champ précédent si il existe
    if (form.length != 0) {
      // recupérer le texte saisi avant de remplacer
      var textContent = form.childNodes[form.childNodes.length-1].childNodes[0].childNodes[0].childNodes[0].value;

      // recréer le input ou textarea et le div form-group
      if (form.childNodes[form.childNodes.length-1].childNodes[0].childNodes[0].childNodes[0].tagName == 'INPUT') {
        div2 = createDiv('col-md-9', null, [createInput('text', 'form-control', null, textContent, null, null, null, null)]);
      } else {
        div2 = createDiv('col-md-9', null, [createTextarea('form-control', 'legende', textContent)]);
      }
      div = createDiv('form-group', null, [createDiv('row', null, [div2, createDiv('col-md-3', null, [createDiv('row', null, [div3, div4, div5])])])]);
      // recréer le champ précédent avec les boutons add et delete
      form.replaceChild(div, form.childNodes[form.childNodes.length-1]);
    } else {
      // s'il s'agit d'une famille il faut juste supprimer le tab correspondant
      if (document.getElementsByClassName('nav-tabs nav')[0].style.display == 'block') {
        //closeTab();
        console.log(event);
      } else {
        // il n' y a plus de champ on réinitilise l'application
        init_View();
      }
    }
  });*/

  // activer les boutons preview et lire
/*
  document.getElementById('preview').disabled = false;
  document.getElementById('read').disabled = false;
  document.getElementById('closeModalMusique').click(); // fermer le popup de musique
  console.log(element);
  console.log(form);
  console.log("numero input " + idInputText);
  if (document.getElementById('myFormActive').childNodes.length > 1) { deleteAddBtn(); }
  */
  $('button#closeModalMusique').trigger('click'); // fermer le popup de musique
}

// fonction pour fermer un onglet
function closeTab (element) {
  // retrouver le tab parent par le parentNode de l'élément et le supprimer de <ul class="nav nav-tabs">
  document.querySelector('.nav-tabs').removeChild(element.parentNode.parentNode);
  // retrouver le div de tab-content par le href du parentNode de l'element et le supprimer <div class="tab-content">
  document.getElementsByClassName('tab-content')[0].removeChild(document.getElementById(element.parentNode.getAttribute('href').substring(1)));

  // définit le tab 1 comme celui active
  if (document.getElementsByClassName('tab-pane fade').length != 0
      && document.getElementsByClassName('tab-pane fade active in').length == 0) {
    document.getElementsByClassName('tab-pane fade')[0].setAttribute('class', 'tab-pane fade active in');
  } else {
    // s'il n'y a plus de formulaire on desactive les boutons preview et lire
    document.getElementById('preview').disabled = true;
    document.getElementById('read').disabled = true;
    document.getElementById('creer').disabled = false; // activer le bouton créer
    document.getElementById('import').disabled = false; // activer le bouton créer
    document.getElementById('nameFamily').style.display = 'none';
  }

  if (document.getElementsByClassName('menu').length != 0
      && document.getElementsByClassName('active menu').length == 0) {
        document.getElementsByClassName('menu')[0].setAttribute('class', 'active ' +
        document.getElementsByClassName('menu')[0].getAttribute('class'));
  }

  // simuler un click sur le tab active pour ajouter les boutons add et del
  if (document.getElementsByClassName('menu active')[0]) {
    document.getElementsByClassName('menu active')[0].childNodes[0].click();
  }
  idMenu--;
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
function importFile () {
  document.getElementById('closeModalImport').click(); // fermer le popup d'import

  // recupérer le fichier
  var importedFile = document.getElementById('importedFile').files[0];
  if (importedFile) {
    facade.importQRCode(importedFile);
  }
}

/*
 fonction pour enregistrer une image de qrcode si famille = false sinon une image de famille
*/
function exportFile (family) {
  var img, nameFile;
  if (family) { // si on a une famille à enregistrer
    img = $('#affichageFamille')[0].childNodes[1].childNodes[1].childNodes[3].childNodes[1].childNodes[0];
    nameFile = $('#nameFamily')[0].value + '.jpeg'; // nom de la famille
    //document.getElementsByClassName('menu active')[0].childNodes[0].textContent; // nom du fichier = nom de l'onglet
    console.log(tabQRCode);
  //  exportFamily(); // pour enregistrer tous les qrcode en meme temps
  } else {
    img = $('#affichageqr')[0].childNodes[1].childNodes[0];
    nameFile = 'image.jpeg'; // nom du ficher par defaut
  }

  var url = img.src.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
  var xhr = new XMLHttpRequest();

  xhr.responseType = 'blob'; //Set the response type to blob so xhr.response returns a blob
  xhr.open('GET', url , true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState == xhr.DONE) {
      //When request is done
      //xhr.response will be a Blob ready to save
      var filesaver = require('file-saver');
      filesaver.saveAs(xhr.response, nameFile);

      if (family) {
        //exportFamily();
        // recupérer tous les formulaires et menus (tabForm.length == tabOnget.length)
        var tabForm = document.getElementsByClassName('tab-pane fade');
        var tabOnget = document.getElementsByClassName('menu');

        // parcourir simultanément formulaire et tab
        for (var i = 0; i < tabForm.length; i++) {
          console.log(tabForm[i]);
          setActive(tabForm[i], tabOnget[i]);
          previewQRCode(true);

          var filename = $('li.active.menu')[0].childNodes[0].textContent + '.jpeg'
          // enegistrer le qrcode atomatiquement
          var imgData = $('#affichageqr')[0].childNodes[1].childNodes[0].src;

          var data = imgData.replace(/^data:image\/\w+;base64,/, '');
          fs.writeFile(filename, data, {encoding: 'base64'}, function(err) {
            if (err) {
              console.log('err', err);
            }
            //success
          });
        }
      }
    }
  };
  xhr.send(); //Request is sent
}


// fonction pour sauvegarder les qrcodes d'une meme famille en même temps
function exportFamily () {
  // on prend chaque formulaire, on génére son qrcode, on l'enregistre
  var tabForm; // tableau de tous les formulaires
  var tabOnget; // tableau de tous les menus

  tabQRCode = [];

  // recupérer tous les formulaires et menus (tabForm.length == tabOnget.length)
  tabForm = document.getElementsByClassName('tab-pane fade');
  tabOnget = document.getElementsByClassName('menu');

  // parcourir simultanément formulaire et tab
  for (var i = 0; i < tabForm.length; i++) {
    console.log(tabForm[i]);
    setActive(tabForm[i], tabOnget[i]);

     // generer le qrcode du formulaire aactive et le mettre dans le tableau de qrcode
    var qrcode = previewQRCode(true);
    tabQRCode.push(qrcode);
  }
}

// function appelée aprés chaque export pour réinitialiser la vue
function init_View () {
  facade = new FacadeController();
  //document.getElementsByClassName('tab-content')[0].innerHTML = "";
  //document.getElementsByClassName('nav nav-tabs')[0].innerHTML = "";
  document.getElementById('affichageqr').childNodes[1].innerHTML = '<div class="col-md-12"> <!-- affichage du qrcode --> </div>';
  document.getElementById('btnExportFile').disabled = true;
  document.getElementById('preview').disabled = true;
  document.getElementById('read').disabled = true;
  document.getElementById('creer').disabled = false;
  document.getElementById('import').disabled = false;
  document.getElementById('nameFamily').style.display = 'none';
  document.getElementById('previewFamily').style.display = 'none';
  document.getElementById('initView').style.display = 'none';
}


// définir le dernier tab créé comme celui active (tab et tabcontent)
function setActive (div, li) {

  if (document.getElementsByClassName('tab-pane fade active in').length != 0) {
    document.getElementsByClassName('tab-pane fade active in')[0].setAttribute('class', 'tab-pane fade');
  }
  div.setAttribute('class', 'tab-pane fade active in');

  if (document.getElementsByClassName('active menu').length != 0) {
    var id = document.getElementsByClassName('active menu')[0].getAttribute('class').match(/\d+/g).join(''); // retourne le chiffre dans la chaine
    document.getElementsByClassName('active menu')[0].setAttribute('class', 'menu menu' + id);
  }
  li.setAttribute('class', 'active menu menu'+idMenu);
}

//fonction pour générer une famille de qrcode
function previewFamily () {
exportFamily();
  var div = document.getElementById('affichageFamille').childNodes[1].childNodes[1].childNodes[3].childNodes[1];
  facade.genererImageFamilleQRCode(tabQRCode, div);
  //document.getElementById('affichageFamille').style.display = 'block';

  //facade.genererImageFamilleQRCode(tabQRCode, document.getElementById('affichagefamille'));
/*
  for (var qrcode in tableauQRCode) {
    if (tableauQRCode.hasOwnProperty(qrcode)) {

    }
  }
  */

//      var qrcode = facade.creerQRCodeAtomique(); // instancier un objet qrcode

  //    var form; // variable pour recupérer le ou les formulaires

      // on recupére le contenu du tab active
  //    var div = document.getElementsByClassName('tab-pane fade active in')[0];
      // on recupére le formulaire de ce div active
  //    form = div.childNodes[0].childNodes[0].childNodes; //on recupérer le formulaire

      /* copier les données du formulaire dans le qrcode */
  /*    if (form != null) {
        for(var i=0; i<form.length; i++) {
          var form2 = form[i].childNodes[0].childNodes;
          console.log(form2);
          for(var j=0; j<form2.length; j++) {
            switch (form2[j].childNodes[0].tagName) {
              case 'INPUT':
              case 'TEXTAREA':
                console.log(form2[j].childNodes[0].tagName);
                copyContentToQRCode(qrcode, form2[j].childNodes[0]);
                break;

              default:
                console.log(form2[j].childNodes[0].tagName);
            }
          }
        }

        facade.genererQRCode(document.getElementById('affichageqr').childNodes[1], qrcode); // générer le qrcode

        document.getElementsByTagName('IMG')[0].draggable = true;
        console.log(document.getElementsByTagName('IMG')[0].draggable);


        document.getElementById('btnExportFile').disabled = false; // activer le bouton exporter
      }  */
      //previewQRCode();
      //document.getElementById('previewFamily').style.display = 'block'; // afficher le bouton exporter famille


}

/*
fonction pour générer un qrcode atomique, famille est un parametre booléen
famille = true : qrcode famille; false : qrcode atomique sans famille
*/
function previewQRCode (famille) {
  var qrcode = facade.creerQRCodeAtomique(); // instancier un objet qrcode

  // variable pour recupérer le formulaire
  var idActive, form, tab;
  if (famille) {
    idActive = $('li.active').attr('id');
    form = $('div#content-item.'+idActive).find($('form#myFormActive'));
  } else {
    form = $('form#myFormActive');
  }

  tab = form.find('textarea, input');

  /* copier les données du formulaire dans le qrcode */
  if (form != null) {
    for(var i=0; i<form.length; i++) {
      var element = tab[i];
      //var form2 = form.childNodes[0].childNodes;
      console.log(element);

        switch (element.tagName) {
          case 'INPUT':
          case 'TEXTAREA':
            console.log(element.tagName);
            copyContentToQRCode(qrcode, element);
            break;

          default:
            console.log(element.tagName);
        }
    }

    if (facade.getTailleReelleQRCode(qrcode) > 500 ) {
      alert ("La taille de ce qr code dépasse le maximum autorisé (500).\nTaille = "+ facade.getTailleReelleQRCode(qrcode));
      qrcode = null;
    } else {
      facade.genererQRCode($('#affichageqr').children()[0], qrcode); // générer le qrcode
      $('#btnExportFile').attr('disabled', false); // activer le bouton exporter
      $('#initView').css('display', 'block'); // afficher le bouton terminer

      if (famille) {
        //console.log(facade.genererQRCode(document.getElementById('affichageqr').childNodes[1], qrcode));
        // calculer le numéro de l'onglet
        //qrcode.ajouterAFamille($('#nameFamily')[0].value, $('li.active.menu')[0].childNodes[0].getAttribute('href').match(/\d+/g).join(''));
        console.log(qrcode);
        return qrcode;
      }
    }
  }


}

// copier le contenu d'un element input
function copyContentToQRCode (qrcode, input) {
  // tester s'il s'agit d'un input de musique
  if(input.disabled) {
    qrcode.ajouterFichier(input.id, input.value);
  } else {
    qrcode.ajouterTexte(input.value);
  }

  // recupérer la couleur du qrcode et les options du braille
  var idActive;
  // copier la couleur du qrcode et du braille
  if ($('input#nameFamily').css('display') == 'block') { // famille de qrcode
    idActive = $('li.active').attr('id');
    qrcode.setColorQR($('div#content-item.'+idActive).find('input#colorQR').val());
    // tester si le checkbox pour les options du braille est checked
    if ($('div#content-item.'+idActive).find('input#checkBraille').prop('checked')) {
      // mettre la couleur et le texte en braille dans le qrcode
      qrcode.setTexteBraille($('div#content-item.'+idActive).find('input#braille').val());
      qrcode.setColorBraille($('div#content-item.'+idActive).find('input#colorBraille').val());
    } else {
      qrcode.setTexteBraille('');
      qrcode.setColorBraille('');
    }
  } else {// qrcode atomique
    qrcode.setColorQR($('input#colorQR').val());
    // tester si le checkbox pour les options du braille est checked
    if ($('input#checkBraille').prop('checked')) {
      // mettre la couleur et le texte en braille dans le qrcode
      qrcode.setTexteBraille($('input#braille').val());
      qrcode.setColorBraille($('input#colorBraille').val());
    } else {
      qrcode.setTexteBraille('');
      qrcode.setColorBraille('');
    }
  }

  // mettre le nom de l'onglet si on a une famille
  if ($('input#nameFamily').css('display') == 'block') {
    qrcode.setNomQRCode(idActive);
    //qrcode.ajouterAFamille($('#nameFamily').val(), $('li.active.menu')[0].childNodes[0].getAttribute('href').match(/\d+/g).join(''));
    qrcode.ajouterAFamille($('#nameFamily').val(), idActive);
  }

  // enregistrer le qrcode dans le tableau
//  tabQRCode.push(qrcode);
}

// fonction pour supprimer le bouton add de l'avant dernier champ du formulaire
function deleteAddBtn () {
  var row = document.getElementsByClassName('tab-pane fade active in')[0].childNodes[0].childNodes[0].childNodes
  [document.getElementsByClassName('tab-pane fade active in')[0].childNodes[0].childNodes[0].childNodes.length-2];

  row.childNodes[0].childNodes[1].childNodes[0].childNodes[2].setAttribute('class', 'col-md-12'); // augmenter la taille du btn play
  row.childNodes[0].childNodes[1].childNodes[0].removeChild(row.childNodes[0].childNodes[1].childNodes[0].childNodes[1]); // supprimer btn del
  row.childNodes[0].childNodes[1].childNodes[0].removeChild(row.childNodes[0].childNodes[1].childNodes[0].childNodes[0]); // supprimer btn add
}

// fonction pour supprimer le bouton add tabs de l'avant dernier tab
function deleteBtnTabs () {
  // recupérer l'avant dernier menu
  var menu = document.getElementsByClassName('menu')[document.getElementsByClassName('menu').length - 2];
///  menu.childNodes[0].removeChild(menu.childNodes[0].childNodes[1]); // supprimer le bouton add ensuite
  //menu.childNodes[0].removeChild(menu.childNodes[0].childNodes[2]); // supprimer le bouton delete en premier
}

/*
fonction pour la gestion des boutons add et del, et du formulaire actif quand on change d'onglet
le parametre create est booleen,
si true ça veut dire que c'est la fonction createTabs qui appelle la fonction switchTab
*/
function switchTab (event, create) {

  var inputAdd, inputDel;
  if ((event && event.target.tagName == 'A' && event.target.parentNode.classList.contains("menu") && !create) ||
        (create && !event)) {
    // parcourir tous les tabs et retirer leur bouton add et del
    for (var i=0; i<document.getElementsByClassName('menu').length; i++) {
      if (document.getElementsByClassName('menu')[i].childNodes[0].childNodes.length > 1) {
        while (document.getElementsByClassName('menu')[i].childNodes[0].childNodes.length > 1) {
          document.getElementsByClassName('menu')[i].childNodes[0].removeChild(document.getElementsByClassName('menu')[i].childNodes[0].childNodes[1]);
        }
      }
    }
    // ajouter les boutons add et del sur l'onglet courant
    inputAdd = createInput('image', 'addTabs', null, null, 'add.png', 'modal', '#modalNameQRCode', 'Ajouter un nouveau champ');
    inputDel = createInput('image', 'closeTab', null, null, 'delete.png', null, null, 'Supprimer ce champ');
    inputAdd.disabled = false;
    inputDel.disabled = false;
  }

  if (event && event.target.tagName == 'A' && event.target.parentNode.classList.contains("menu") && !create) {
    event.target.appendChild(inputAdd);
    event.target.appendChild(inputDel);
  } else if (create && !event) {
    var lastTab = document.getElementsByClassName('menu')[document.getElementsByClassName('menu').length-1];
    lastTab.childNodes[0].appendChild(inputAdd);
    lastTab.childNodes[0].appendChild(inputDel);
  }
}
