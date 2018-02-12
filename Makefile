
install-full:

	@echo "Installation des librairies requises"
	sudo npm install electron --unsafe-perm=true --allow-root
	sudo npm install
	@echo "Installation de jquery-qrcode-0.14.0"
	sudo mkdir jquery-qrcode-temp
	sudo wget -q https://release.larsjung.de/jquery-qrcode/jquery-qrcode-0.14.0.zip
	sudo unzip -q jquery-qrcode-0.14.0.zip -d jquery-qrcode-temp
	sudo cp jquery-qrcode-temp/*.js ./node_modules/jquery/
	sudo rm -rf jquery-qrcode-temp jquery-qrcode-0.14.0.zip           

install-jquery:

	@echo "Installation de jquery-qrcode-0.14.0"
	sudo mkdir jquery-qrcode-temp
	sudo wget -q https://release.larsjung.de/jquery-qrcode/jquery-qrcode-0.14.0.zip
	sudo unzip -q jquery-qrcode-0.14.0.zip -d jquery-qrcode-temp
#	sudo mkdir node_modules/jquery/
	sudo cp jquery-qrcode-temp/*.js ./node_modules/jquery/
	sudo rm -rf jquery-qrcode-temp jquery-qrcode-0.14.0.zip


#
#		@# Pour la documentation sur les packages
#		@#https://www.npmjs.com/
#
#		@# Pour exécuter
#		@#./node_modules/.bin/electron .
#
#		@# Pour bootstrap
#		@#	npm install bootstrap
#
#		@# Pour debuggage
#		@#npm install electron-debug
#
#		@# soucis avec jquery
#		@#npm install jquery --save
#
#		@# api google drive
#		@#https://developers.google.com/drive/v3/web/quickstart/nodejs
#		@#	npm install googleapis --save
#		@#	npm install google-auth-library --save
#
#			@# api google text to speech
#			@#	npm install google-tts-api --save
#
#			@# insérer les métadonnées dans l'image générée
#			@##	npm install piexifjs


# Copyright © 12/02/2018, Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
# Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
# The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
# The Software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders X be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the Software.
# Except as contained in this notice, the name of the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
