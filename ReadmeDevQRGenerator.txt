1) Installation des outils
Pour installer tous les outils nécessaires pour la programmation de QRLudo-Generator, lancer le script InstallationOutilQRG.sh

2) Compilation du projet
Dans un terminal dans le projet, lancer:
npm install --unsafe-perm=true

3) Lancement du projet
npm start

# Déploiement
# Deb pour installation Ubuntu + Dossier d'exécutable
yarn pack-linux

# Pour créer un exécutable Windows
# Architecture x86
yarn pack-win32
# Architecture x64
yarn pack-win64
# NOTE: Au premier déploiement, Wine demandera d'installer des éléments
# supplémentaires. Après installation de ces éléments, le déploiement
# peut crash. Relancer le déploiement corrige le problème.
