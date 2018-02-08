# QRCode_Generator
Application permettant de générer des QR-Codes qui seront lus (synthése vocale), à l'aide d'une application android.
Il faut installer le projet et activer l'api googe drive avant de déployer et d'executer le logiciel créé.

##Installation et dépendances

[nodejs et npm] (https://doc.ubuntu-fr.org/nodejs)
_Note: il est possible que certains modules aient besoin d'être installé en tant qu'administrateur._

### Installation de jquery-qrcode

- executer make install

ou 

- télécharger https://release.larsjung.de/jquery-qrcode/jquery-qrcode-0.14.0.zip
- extraire l'archive dans le dossier node_modules/jquery/

### Librairie npm à installer
- electron
- electron-packager
- bootstrap
- braille
- file-sewer
- googleapis
- google-tts-api
- google-auth-library
- jquery
- piexifjs

#### Pour le débug de l'application
- electron-debug

### Packaging et déploiement d'executable pour l'application

#### Sur un poste linux
- npm run install-linux

#### Sur un poste windows
- npm run install-windows

## Pour activer l'api de google drive
    $ node quickstart.js
    Ensuite aller sur le lien internet généré (se connecter éventuellement sur le compte google).
    Enfin copier le code généré sur le terminal.

## Information et liens utiles

[nodejs] (https://nodejs.org/fr/)
[google drive] (https://developers.google.com/drive/v3/web/quickstart/nodejs)
