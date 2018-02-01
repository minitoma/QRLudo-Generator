
install:

	@echo "Installation des librairies requises"
	sudo npm install

	@# Installation de jquery-qrcode-0.14.0
	sudo mkdir jquery-qrcode-temp
	sudo wget -q https://release.larsjung.de/jquery-qrcode/jquery-qrcode-0.14.0.zip
	sudo unzip -q jquery-qrcode-0.14.0.zip -d jquery-qrcode-temp
	sudo cp jquery-qrcode-temp/*.js ./node_modules/jquery/
	sudo rm -rf jquery-qrcode-temp jquery-qrcode-0.14.0.zip


# For building and packaging app

release:
	@echo "Packaging"
	@sudo ./node_modules/.bin/electron-packager . QRLudo-Generator --overwrite
	@echo "\n==================================="
	@echo "Creation de l'executable : QRLudo-Generator"
	@sudo ln -s QRLudo-Generator-*/QRLudo-Generator ./QRLudo-Generator


#
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
