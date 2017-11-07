var qrCodeA = null;

$(document).ready(function() {
  document.getElementById('preview').addEventListener('click', function() {

    qrCodeA = new QRCodeAtomique();
    /* recupérer le formulaire */
    var form = document.getElementById('myForm');

    if (form != null) {

        for(var i=0; i<form.length; i++) {

          var form2 = form.childNodes[i].childNodes;
          for(var j=0; j<form2.length; j++) {
            switch (form2[j].tagName) {
              case 'INPUT':
                console.log(form2[j].tagName);
                copyInputContent(form2[j]);
                break;

              case 'LABEL':
                console.log(form2[j].tagName);
                copyLegendeContent(form2[j]);
                break;

              default:
                console.log(form2[j].tagName);
            }
            //console.log(form.childNodes[i][j].childNodes);
          }
        }


  //  qrCodeA.ajouterFichier("http://fichier.drive.google.com", "nomFichier");
  //  qrCodeA.ajouterFichier("http://fichier2.drive.google.com", "nomFichier2");
  //  qrCodeA.ajouterTexte("Ceci est un test");



    //qrCodeA.ajouterAFamille("singes", 1);

    /*
    alert(qrCodeA.getDonnees());


    qrCodeA.inverserOrdreContenu(0,1);

    alert(qrCodeA.getDonnees());

*/
    alert(qrCodeA.getDonnees());

    qrCodeA.inverserOrdreContenu(1,2);

    */
/*
    alert(qrCodeA.getTypeContenu(1));
    alert(qrCodeA.getNomFichier(1));
    alert(qrCodeA.getTexte(2));
*/
    //if (document.getElementById('affichageqr').childNodes[1])
    var div = document.getElementById('affichageqr').childNodes[1]; // recupérer le div correspondant
    while (div.hasChildNodes()) {
        div.removeChild(div.firstChild);
    }
    //div.appendChild(createImg('img-buffer','./img/image.png')); // générer un élément img dans le div
    QRCodeGenerator.generate(div, qrCodeA);

    console.log(qrCodeA.getDonnees());
}
//    QRCodeGenerator.generate('#affichageqr', qrCodeA);
  });
});

// copier le contenu d'un element input
function copyInputContent(input) {
  // tester s'il s'agit d'un input de musique
  if(input.disabled) {
    var url = 'https://drive.google.com/open?id=' + input.id;
    qrCodeA.ajouterFichier(url, input.value);
  } else {
    qrCodeA.ajouterTexte(input.value);
  }
}

// copier le contenu d'un element legende
function copyLegendeContent(legende) {
  qrCodeA.ajouterTexte(legende.textContent);
}
