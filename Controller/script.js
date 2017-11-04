
var qrCodeA = new QRCodeAtomique();


qrCodeA.ajouterFichier("http://fichier.drive.google.com", "nomFichier");
qrCodeA.ajouterFichier("http://fichier2.drive.google.com", "nomFichier2");
qrCodeA.ajouterTexte("Ceci est un test");



qrCodeA.ajouterAFamille("singes", 1);

/*
alert(qrCodeA.getDonnees());


qrCodeA.inverserOrdreContenu(0,1);

alert(qrCodeA.getDonnees());

qrCodeA.inverserOrdreContenu(1,2);

*/
alert(qrCodeA.getDonnees());


QRCodeGenerator.generate('#affichageqr', qrCodeA);
