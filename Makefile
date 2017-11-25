LIBS= jquery --save \
			jquery-qrcode \
			bootstrap \
			electron-debug \
			googleapis --save \
			google-auth-library --save \
			google-tts-api --save \
			piexifjs \
			file-saver \
			braille

# Pour créer un projet
init:
	npm init
	npm install electron --save-dev

install:
	npm install $(LIBS)
	# Installation de jquery-qrcode-0.14.0
	mkdir jquery-qrcode-temp
	wget https://release.larsjung.de/jquery-qrcode/jquery-qrcode-0.14.0.zip
	unzip jquery-qrcode-0.14.0.zip -d jquery-qrcode-temp
	cp jquery-qrcode-temp/*.js ./node_modules/jquery/
	rm -rf jquery-qrcode-temp jquery-qrcode-0.14.0.zip

uninstall:
	npm uninstall $(LIBS)


	# Pour la documentation sur les packages
	#https://www.npmjs.com/

	# Pour exécuter
	#./node_modules/.bin/electron .

	# Pour bootstrap
	#	npm install bootstrap

	# Pour debuggage
	#npm install electron-debug

	# soucis avec jquery
	#npm install jquery --save

	# api google drive
	#https://developers.google.com/drive/v3/web/quickstart/nodejs
#	npm install googleapis --save
#	npm install google-auth-library --save

	# api google text to speech
#	npm install google-tts-api --save

	# insérer les métadonnées dans l'image générée
##	npm install piexifjs
