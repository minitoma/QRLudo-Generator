# QRCode_Generator
Application pour générer des QR-Codes qui seront lus (synthése vocale), à l'aide d'une application android.
Il faut installer le projet et activer l'api googe drive avant de déployer et d'executer le logiciel créé.

## Pour installer le projet
    $ git clone https://github.com/minitoma/QRLudo-Generator.git
    $ cd QRLudo-Generator
    $ make install

## Pour activer l'api de google drive
    $ node quickstart.js
	![alt text](https://github.com/minitoma/QRLudo-Generator/tree/master/img/qrludo.png)
    Ensuite aller sur le lien internet généré (se connecter éventuellement sur le compte google).
    Enfin copier le code généré sur le terminal.

## Pour déployer l'Application
    $ make release

## Pour executer 
    $ ./QRLudo-Generator

## Pour supprimer les librairies
    $ make uninstall
