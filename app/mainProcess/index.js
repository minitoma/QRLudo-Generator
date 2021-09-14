/**
 * @Author: alassane
 * @Date:   2018-12-05T17:35:22+01:00
 * @Last modified by:   pdelepine
 * @Last modified time: 2020-09-13
 */

const electron = require('electron');
const app = electron.app;
const { ipcMain } = require('electron');
const BrowserWindow = electron.BrowserWindow;
var path = require('path');

/** Initialise le module remote qui fait un pont entre le processus principal et le processus de rendu */
require('@electron/remote/main').initialize()

/** Ouvre la console développeur */
require('electron-debug')({
  showDevTools: true
}); 

let mainWindow;
let infoWindow = null;

global.sharedObject = {
  someProperty: 'default value'
}


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
    icon: path.join(__dirname.match(`.*app`)[0], '../rendererProcess/assets/images/qrludo-icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });
  /** Autoriser le redimensionnement de la fenêtre*/ 
  mainWindow.setResizable(true); 
  /** On doit charger un chemin absolu*/ 
  mainWindow.loadURL(`file://${__dirname}/index.html`); 

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  /** Delete local folder QRLudo */ 
  const fs = require('fs');
  const path = require('path');
  const { exec } = require('child_process');

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
      break;

    default:
      console.log('Unknown operating system');
      break;
  }
  /** déclaration du store qui fera le lien avec la continuité des onglets */
  const Store = require('electron-store');
  const store = new Store();
  //Le store est clean ici
  store.clear();

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('showInfoWindow', () => {
  if (infoWindow == null) {
    createInfoWindow();
    let display = electron.screen.getPrimaryDisplay();
    let width = display.bounds.width;
    let height = display.bounds.height;
    let w = width - (Math.floor(width / 3) + 10);

    mainWindow.setMaximumSize(w, height);
  }
});

ipcMain.on('exitApp', () => {
  mainWindow.close();
});

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
