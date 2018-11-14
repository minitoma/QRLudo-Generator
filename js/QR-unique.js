
$(document).ready(function() {

  // desactiver les boutons preview et lire s'il y a rien à lire ou preview
  // desactiver exporter, faut preview avant de pouvoir exporter
  // désactiver le bouton créer s'il s'agit de qrcode unique
<<<<<<< HEAD
  $('#btnExportFile, #read, #stop').attr('disabled', true);
  $('#btnExportFile').click(function(){ exportFile(); });


=======
  $('#btnExportFile, #read').attr('disabled', true);
>>>>>>> ec68ad49a3b386a106054a6fabf7114c9921ae0b

  // fonction pour dispatcher
  document.addEventListener('click', function(){
    recognizeFunction(event);
  });

<<<<<<< HEAD
  $('#setImportedFile').click(function(){ importFile(); });
  $('#annuler').click(function(){ init_View(); });

=======
>>>>>>> ec68ad49a3b386a106054a6fabf7114c9921ae0b

});


// fonction pour appeler la foncton sollicitée
function recognizeFunction (event) {
  try {
    var element = event.target;
    if (element.tagName == 'BUTTON' && element.classList.contains("set-music")){
      $('#closeModal').trigger('click');
<<<<<<< HEAD

=======
>>>>>>> ec68ad49a3b386a106054a6fabf7114c9921ae0b
      createMusicBox();
    }
  } catch (e) {
    alert('Erreur : ' + e.stack);
  }
}

// fonction pour charger un QRCode
function importFile () {
  try {
    $('#closeModalImport').trigger('click'); // fermer le popup d'import
    // recupérer le fichier
    var importedFile = document.getElementById('importedFile').files[0];
<<<<<<< HEAD
    if (importedFile) { facade.importQRCode(importedFile);}
=======
    if (importedFile) { facade.importQRCode(importedFile); }
>>>>>>> ec68ad49a3b386a106054a6fabf7114c9921ae0b
  } catch (e) {
    alert('Erreur : ' + e.stack);
  }
}

/*
 fonction pour enregistrer une image de qrcode si famille = false sinon une image de famille
*/
function exportFile () {
  try {
    var img, nameFile;

    if (typeQR == 'atomique' || typeQR == 'ensemble') {
      img = $('#affichageqr').find('img')[0];
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

      }
    };
<<<<<<< HEAD

=======
>>>>>>> ec68ad49a3b386a106054a6fabf7114c9921ae0b
    xhr.send(); //Request is sent
  } catch (e) {
    alert('Erreur : ' + e.stack);
  }
}


// function appelée aprés chaque export pour réinitialiser la vue
function init_View () {
  facade = new FacadeController();
  typeQR = null;
  tabQRCode = [];
  $('#btnExportFile, #read').attr('disabled', true);
}

/*
fonction pour générer un qrcode atomique, famille est un parametre booléen
famille = true : qrcode famille; false : qrcode atomique sans famille
*/
function previewQRCode (famille) {
  // try {
    var qrcode;

      qrcode = facade.creerQRCodeAtomique(); // instancier un objet qrcode atomique

    // variable pour recupérer le formulaire
    var idActive, form, tab;
    form = $('form#myFormActive');
    tab = form.find('textarea');

    /* copier les données du formulaire dans le qrcode */
    if (form != null) {
      for(var i=0; i<tab.length; i++) {
        var element = tab[i];

        if (element.tagName == "TEXTAREA") { copyContentToQRCode(qrcode, element); }
      }

      if (facade.getTailleReelleQRCode(qrcode) > 500 ) {
<<<<<<< HEAD
        //alert ("La taille de ce qr code dépasse le maximum autorisé (500).\nTaille = "+ facade.getTailleReelleQRCode(qrcode));
        $('#alertTaille').html("La taille '"+facade.getTailleReelleQRCode(qrcode)+"' de ce QR-Code dépasse le maximum autorisé '500'.<br>Vous pouvez le sauvegarder.");
        $('#sauvegarderFichierJson').modal({ show: true })

        qrcode = null;
      } else {
        console.log("---- ETAPE 2: QR-unique.js : <500");
        console.log($('#affichageqr').children()[0], qrcode);
        facade.genererQRCode($('#affichageqr').children()[0], qrcode); // générer le qrcode
        $('#btnExportFile, #read, #stop, #annuler').attr('disabled', false); // activer le bouton exporter
=======
        alert ("La taille de ce qr code dépasse le maximum autorisé (500).\nTaille = "+ facade.getTailleReelleQRCode(qrcode));
        qrcode = null;
      } else {
        console.log("---- ETAPE 2: QR-unique.js : <500");
        console.log($('#affichageqr').children()[0], qrcode); // générer le qrcode
        facade.genererQRCode($('#affichageqr').children()[0], qrcode); // générer le qrcode
        $('#btnExportFile, #read').attr('disabled', false); // activer le bouton exporter
>>>>>>> ec68ad49a3b386a106054a6fabf7114c9921ae0b

      }
    }
  // } catch (e) {
  //   alert('Erreur : ' + e.stack);
  // }
}

// copier le contenu d'un element input
function copyContentToQRCode (qrcode, input) {
  try {

    if(input.disabled) { // tester s'il s'agit d'un input de musique
      qrcode.ajouterFichier(input.id, input.value); // qrcode atomique
    } else {
      qrcode.ajouterTexte(input.value);
    }

    // recupérer la couleur du qrcode
<<<<<<< HEAD
=======
    var idActive;
>>>>>>> ec68ad49a3b386a106054a6fabf7114c9921ae0b
    // copier la couleur du qrcode
      qrcode.setColorQR($('input#colorQR').val());

  } catch (e) {
    alert('Erreur : ' + e.stack);
  }
}

/**
 * Copyright © 12/02/2018, Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * The Software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders X be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the Software.
 * Except as contained in this notice, the name of the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
*/
