# QRCode_Generator
Application permettant de générer des QR-Codes qui seront lus (synthése vocale), à l'aide d'une application android.
Il faut installer le projet et activer l'api googe drive avant de déployer et d'executer le logiciel créé.

ce projet n'est plus maintenu par mes soins mais vous pouvez suivre la suite ici : https://github.com/univ-angers/QRLudo-Generator

## Packages

Des packages sont disponibles directement via le lien suivant, il contiennent deux packages, Linux et Windows, contenant les fichiers nécéssaires au fonctionnement de l'application sans avoir à l'installer au préalable.

Pour lancer l'application il suffit juste de lancer le fichier éxecutable _qrludo-generator_

https://drive.google.com/drive/folders/18ZUcnrlnyoHdr2N4dYcN6fnqtdPE_Ltb?usp=sharing

Vous pouvez créer un raccourci sur le bureau pour y accèder plus rapidement.

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
- file-saver
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

ou

- electron-packager . qrludo-generator --overwrite --asar --platform=linux --out=release-builds

#### Sur un poste windows
- npm run install-windows

ou

- electron-packager . qrludo-generator --overwrite --asar --platform=win32 --out=release-builds

## Pour activer l'api de google drive
    $ node quickstart.js
    Puis se diriger sur le lien généré (se connecter éventuellement sur le compte google).
    Copier le code généré sur le terminal.

## Information et liens utiles

[nodejs] (https://nodejs.org/fr/)

[google drive] (https://developers.google.com/drive/v3/web/quickstart/nodejs)

[QRLudo version 1] (https://github.com/CorTal/QRLudo)

[QRLudo version 2] (https://github.com/juleguy/QRLudo)


Copyright © 12/02/2018, Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
The Software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders X be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the Software.
Except as contained in this notice, the name of the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
