echo "Ajout Node.js PPA"
sudo apt-get -y install curl
curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -

echo "Installation Node.js"
sudo apt-get -y install nodejs

echo "Installation d'Electron"
npm i -D electron@latest

echo "Récupération de Yarn"
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

echo "Installation de Yarn"
sudo apt-get update && sudo apt-get -y install yarn

echo "Récupération de Wine"
sudo dpkg --add-architecture i386
wget -qO - https://dl.winehq.org/wine-builds/winehq.key | sudo apt-key add -

echo "Récupération de Wine"
sudo apt-add-repository 'deb https://dl.winehq.org/wine-builds/ubuntu/ xenial main'

echo "Installation de Wine"
sudo apt-get update
sudo apt-get install -y --install-recommends winehq-stable

echo "Verification des installations"
echo "Node.js"
# Devrait afficher v13.6.0 ou supérieur
node -v
echo "NPM"
# Devrait afficher 6.13.4 ou supérieur
npm -v
echo "Wine"
# Devrait affiche 4.0.3 ou supérieur
wine --version

echo "Préparation terminée"
