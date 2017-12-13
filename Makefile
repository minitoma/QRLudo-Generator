LIBS=	electron --save-dev \
	jquery --save \
	jquery-qrcode \
	bootstrap \
	electron-debug \
	googleapis --save \
	google-auth-library --save \
	google-tts-api --save \
	piexifjs \
	file-saver \
	braille

install:
	@echo "Installation des librairies requises"
	@npm install $(LIBS)
	@# Installation de jquery-qrcode-0.14.0
	@mkdir jquery-qrcode-temp
	@wget https://release.larsjung.de/jquery-qrcode/jquery-qrcode-0.14.0.zip
	@unzip jquery-qrcode-0.14.0.zip -d jquery-qrcode-temp
	@cp jquery-qrcode-temp/*.js ./node_modules/jquery/
	@rm -rf jquery-qrcode-temp jquery-qrcode-0.14.0.zip

uninstall:
	npm uninstall $(LIBS)

# For building and packaging app

release:
	@echo "Installation de electron-packager"
	@sudo npm install electron-packager --save-dev
	@echo "==================================="
	@echo "Packaging"
	@sudo ./node_modules/.bin/electron-packager . QRLudo-Generator
	@echo "\n==================================="
	@echo "Creation de l'executable : QRLudo-Generator"
	@sudo ln -s QRLudo-Generator-*/QRLudo-Generator ./QRLudo-Generator

#release-linux-x64:
#	@echo "Installation de electron-packager"
#	@sudo npm install electron-packager --save-dev
#	@echo "==================================="
#	@echo "Packaging sur une platforme linux 64 bits"
#	@sudo ./node_modules/.bin/electron-packager . QRLudo-Generator --platform=linux --arch=x64 
#	@echo "\n==================================="
#	@echo "Creation de l'executable : QRLudo-Generator"
#	@sudo ln -s QRLudo-Generator-linux-x64/QRLudo-Generator ./QRLudo-Generator
#
#
#release-linux-x86:
#	@echo "Installation de electron-packager"
#	@sudo npm install electron-packager --save-dev
#	@echo "==================================="
#	@echo "Packaging sur une platforme linux 32 bits"
#	@sudo ./node_modules/.bin/electron-packager . QRLudo-Generator --platform=linux --arch=x86 
#	@echo "\n==================================="
#	@echo "Creation de l'executable : QRLudo-Generator"
#	@sudo ln -s QRLudo-Generator-linux-x86/QRLudo-Generator ./QRLudo-Generator
#
#
#release-windows-x64:
#	@echo "Installation de electron-packager"
#	@sudo npm install electron-packager --save-dev
#	@echo "==================================="
#	@echo "Packaging sur une platforme Windows 64 bits"
#	@sudo ./node_modules/.bin/electron-packager . QRLudo-Generator --platform=win32 --arch=x64 
#	@echo "\n==================================="
#	@echo "Creation de l'executable : QRLudo-Generator"
#	@sudo ln -s QRLudo-Generator-win32-x64/QRLudo-Generator ./QRLudo-Generator
#
#
#release-windows-x86:
#	@echo "Installation de electron-packager"
#	@sudo npm install electron-packager --save-dev
#	@echo "==================================="
#	@echo "Packaging sur une platforme Windows 32 bits"
#	@sudo ./node_modules/.bin/electron-packager . QRLudo-Generator --platform=win32 --arch=x86 
#	@echo "\n==================================="
#	@echo "Creation de l'executable : QRLudo-Generator"
#	@sudo ln -s QRLudo-Generator-win32-x86/QRLudo-Generator ./QRLudo-Generator
#
#
#release-mac-x64:
#	@echo "Installation de electron-packager"
#	@sudo npm install electron-packager --save-dev
#	@echo "==================================="
#	@echo "Packaging sur une platforme Mac 64 bits"
#	@sudo ./node_modules/.bin/electron-packager . QRLudo-Generator --platform=darwin --arch=x64
#	@echo "\n==================================="
#	@echo "Creation de l'executable : QRLudo-Generator"
#	@sudo ln -s QRLudo-Generator-darwin-x64/QRLudo-Generator ./QRLudo-Generator
#
#
#release-mac-x86:
#	@echo "Installation de electron-packager"
#	@sudo npm install electron-packager --save-dev
#	@echo "==================================="
#	@echo "Packaging sur une platforme Mac 32 bits"
#	@sudo ./node_modules/.bin/electron-packager . QRLudo-Generator --platform=darwin --arch=x86
#	@echo "\n==================================="
#	@echo "Creation de l'executable : QRLudo-Generator"
#	@sudo ln -s QRLudo-Generator-darwin-x86/QRLudo-Generator ./QRLudo-Generator
#
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
