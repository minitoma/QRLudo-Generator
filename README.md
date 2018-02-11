# QRCode_Generator
Application permettant de générer des QR-Codes qui seront lus (synthése vocale), à l'aide d'une application android.
Il faut installer le projet et activer l'api googe drive avant de déployer et d'executer le logiciel créé.

## Installation et dépendances

[nodejs et npm] (https://doc.ubuntu-fr.org/nodejs)

_Note: il est possible que certains modules aient besoin d'être installé en tant qu'administrateur._
_Si vous utiliser Ubuntu vous pouvez installer toutes les dépendances en éxecutant "make install-full"_

### Installation de jquery-qrcode

- executer make install-jquery

ou 

- télécharger https://release.larsjung.de/jquery-qrcode/jquery-qrcode-0.14.0.zip
- extraire l'archive dans le dossier node_modules/jquery/

### Librairie npm à installer
- electron _les options "--unsafe-perm=true --allow-root" peuvent être nécéssaire"_
- electron-packager
- bootstrap _la version 4.0 de bootstrap est incompatible, nous conseillons d'installer la version 3.3.7_
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
    Puis se diriger sur le lien généré (se connecter éventuellement sur le compte google).
    Copier le code généré sur le terminal.

## Information et liens utiles

[nodejs] (https://nodejs.org/fr/)
[google drive] (https://developers.google.com/drive/v3/web/quickstart/nodejs)

[QRLudo version 1] (https://github.com/CorTal/QRLudo)
[QRLudo version 2] (https://github.com/juleguy/QRLudo)
