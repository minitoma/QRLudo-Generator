# QRCode_Generator
Application pour générer des QR-Codes. Il faut initialiser d'abord le projet avant d'installer les librairies.
Si le projet est déjà initialisé, on peut directement installer les librairies.

## Pour initialiser le projet
    $ make init

## Pour installer les librairies
    $ make install

## Pour supprimer les librairies
    $ make uninstall

## Pour activer l'api de google drive
    $ node quickstart.js
    Ensuite aller sur le lien internet généré (se connecter éventuellement sur le compte google).
    Enfin copier le code généré sur le terminal.

## Pour déployer l'Application
    $ make release
    si erreur lors du packaging, remplacer dans le `makefile` `./node_modules/.bin/electron` par `electron`.
