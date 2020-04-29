# QR Ludo Generator

QR Ludo Generator est une application de bureau qui permet de générer des QR codes. Cette application a été créée dans le but d'aider les transcripteurs de l'Institut Montéclair d'Angers à créer des supports de cours pour les élèves déficients visuels qui fréquentent l'établissement.

Les QR codes générés doivent être détectés avec l'application mobile [QRLudo](https://github.com/vrahier/QRLudo).

## Installation

Pour obtenir QR Ludo Generateur, il faut télécharger son installeur à l'adresse : TBD

## Manuel d'utilisation

Un manuel d'utilisation est disponible à l'adresse : https://github.com/univ-angers/QRLudo-Generator/blob/master/docs/qrludo_manuel_utilisateur.pdf

## Contexte de développement

Ce projet a eu lieu dans le cadre des modules d'enseignement Management de Projet et Concrétisation Disciplinaire suivis par les étudiants de Master 2 Informatique ACDI (Analyse, Conception et Développement Informatique) et de Master 1 Informatique de l'Université d'Angers de l'année universitaire 2018/2019.

# Pour les développeurs

## Langages

QR Ludo Generateur a été développée à l'aide du framework Electron basé sur du Javascript. Il utilise les langages du web HTML, Javascript et CSS. Il utilise NodeJS pour l'ajout et la gestion des dépendances.

## Mise en place

### Installation des outils
Pour installer tous les outils nécessaires pour la programmation de QRLudo-Generator, lancez le script InstallationOutilQRG<span>.sh.

### Compilation du projet
Dans un terminal dans le projet, lancer:
```bash
npm install --unsafe-perm=true
```

### Lancement du projet
```bash
npm start
```

## Déploiement

### Linux
Dans le dossier du projet, lancer un un terminal et lancer la commande:
```bash
yarn pack-linux
```
### Windows

#### Architecture x86
Dans le dossier du projet, lancer un un terminal et lancer la commande:
```bash
yarn dist-win32
```
#### Architecture x64
Dans le dossier du projet, lancer un un terminal et lancer la commande:
```bash
yarn dist-win64
```
> NOTE: Au premier déploiement, Wine demandera d'installer des éléments supplémentaires. Après installation de ces éléments, le déploiement peut crash. Relancer le déploiement corrige le problème.

## Information et liens utiles

[QRLudo Générator version 1](https://github.com/minitoma/QRLudo-Generator)

[QRLudo version 1](https://github.com/CorTal/QRLudo)

[QRLudo version 2](https://github.com/juleguy/QRLudo)

# Licence

Copyright (C) 2020  MOHR Anaïs, PIGACHE Bastien, DESNOES Mathis, RANDRIAMAMONJISOA Andry, CHOVEAU Etienne, BALAVOINE Kevin, BAH Marouwane
Copyright (C) 2019 Thibault Condemine, Alassane Diop, Hanane Hadji, Abdessabour Harboul, Florian Lherbeil, Jérôme Martins Mosca, Valentine Rahier, Salim Youssef

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
