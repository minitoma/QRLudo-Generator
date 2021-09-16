/**
 * @Author: alassane
 * @Date:   2018-12-05T17:35:22+01:00
 * @Last modified by:   pdelepine
 * @Last modified time: 2020-09-13
 */

/** Modules pour contrôler la vie de l'application et créer une fenêtre de navigation native */
const electron = require('electron');
const { app, ipcMain, BrowserWindow } = electron;
const path = require('path');

/** Ouvre la console développeur */
require('electron-debug')({
  showDevTools: true
}); 

let mainWindow;

const log4js = require('log4js');
/** Setup de 2 actions lors d'un log 
 * console : réalise un console.log
 * toFile : enrengistre le log dans le fichier qrludogenerator.log
 */
 log4js.configure({
  appenders: {
    console: { type: 'console' },
    toFile: { type: 'file', filename: 'qrludogenerator.log', flags: 'w' }
  },
  categories: {
    default: { appenders: ['console', 'toFile'], level: 'info' }
  }
});

/** Objet globale gérant l'onglet d'aide à afficher */
global.sharedObject = {
  ongletAideActif: 'default value',
  loggerShared: log4js
}

/** Créer la fenêtre de navigation */
function createWindow() {
  let display = electron.screen.getPrimaryDisplay();
  let width = display.bounds.width;
  let height = display.bounds.height;

  mainWindow = new BrowserWindow({
    width: width, /** on définit une taille pour notre fenêtre */ 
    height: height,
    maximized: true,
    center: true,
    frame: true, /** en faire une fenetre */ 
    icon: path.join(__dirname.match(`.*app`)[0], '/rendererProcess/assets/images/qrludo-icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });
  /** Autoriser le redimensionnement de la fenêtre */ 
  mainWindow.setResizable(true); 
  /** On charge le fichier html principal de l'application */ 
  mainWindow.loadFile(__dirname + '/index.html');

  log4js.getLogger().info('Démarrage de QRLudo Générator');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}


/** Cette méthode sera appelée quand Electron aura fini
 * de s'initialiser et sera prêt à créer des fenêtres de navigation.
 */
app.whenReady().then(() => {
  createWindow();
  /** Sur macOS il est d'usage de recréer une fenêtre dans l'application quand 
   * l'icône du dock est cliquée et qu'il n'y a pas d'autre fenêtre ouverte. 
   */
  app.on('activate', function() {
    if(BrowserWindow.getAllWindows.length === 0) createWindow();
  });
});
/** 
 * Quitter quand toutes les fenêtres sont fermées, sauf sur macOS. Sur macOS, il est courant
 * pour les applications et leur barre de menu de rester actives jusqu’à ce que l’utilisateur quitte
 * explicitement avec Cmd + Q.
 */
app.on('window-all-closed', () => {
  
  const fs = require('fs');
  const path = require('path');
  const { exec } = require('child_process');
  log4js.shutdown();

  /** On supprime le dossier local QRLudo pour windows et linux */ 
  switch (process.platform) {
    case 'win32':
      let temp = path.join(process.env.temp, 'QRLudo');
      exec(`rmdir /s/q ${temp}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
      });
      break;

    case 'linux':
      let tempLinux = path.join(process.env.HOME, 'temp');
      exec(`rm -rf ${tempLinux}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      });
      break;controllerMultiple

    default:
      console.log('Unknown operating system');
      break;
  }

  /** Quitte l'application si non MacOS */
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


/** Quitte l'application si on reçois l'event 'exitApp' venant du processus de rendu
 * Appeler lorsqu'on ne peut pas créer de répertoire dans script_loader
  */
ipcMain.on('exitApp', () => {
  mainWindow.close();
});

/** @todo trouver ce que c'est, puisque ce n'est pas utilisé  */
function deleteFolderRecursive(path) {
  const fs = require('fs');
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      let curPath = path + "/" + file;
      /** Recursif */
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
         /** Delete */
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};



/**
 * Copyright © 12/02/2018, Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * The Software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders X be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the Software.
 * Except as contained in this notice, the name of the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
 */
