echo "Ajout Node.js PPA"
sudo apt-get -y install curl
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -

echo "Installation Node.js"
sudo apt-get -y install nodejs

echo "Verification des installations"
node -v 
# Devrait afficher v13.3.0
npm -v
# Devrait afficher 6.13.1

echo "Installation d'Electron"
npm i -D electron@latest

echo "Terminé"

#Pour intaller les dépendances pour le projet:
#npm install --unsafe-perm=true
#Pour lancer le logiciel
#npm start
#Pour créer un exécutable Ubuntu
# TODO
#Pour créer un exécutable Windows
# TODO
# Pour créer un exécutable MacOs
# TODO
