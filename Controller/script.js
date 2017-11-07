var qrCodeA = new QRCodeAtomique();

$(document).ready(function() {
  document.getElementById('preview').addEventListener('click', function() {


    qrCodeA.ajouterFichier("http://fichier.drive.google.com", "nomFichier");
    qrCodeA.ajouterFichier("http://fichier2.drive.google.com", "nomFichier2");
    qrCodeA.ajouterTexte("Ceci est un test");



    qrCodeA.ajouterAFamille("singes", 1);

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
    var div = document.getElementById('affichageqr').childNodes[1]; // recupérer le div correspondant
    //div.appendChild(createImg('img-buffer','./img/image.png')); // générer un élément img dans le div
    QRCodeGenerator.generate(div, qrCodeA);


//    QRCodeGenerator.generate('#affichageqr', qrCodeA);
  });
});
