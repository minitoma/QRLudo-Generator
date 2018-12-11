/**
 * @Author: alassane
 * @Date:   2018-12-05T17:35:22+01:00
 * @Last modified by:   alassane
 * @Last modified time: 2018-12-11T00:36:46+01:00
 */

const electron = require('electron');
const app = electron.app;
app.commandLine.appendSwitch('enable-speech-dispatcher');
const {
  ipcMain
} = require('electron');
const BrowserWindow = electron.BrowserWindow;
var path = require('path');

require('electron-debug')({
  showDevTools: true
}); // pour debugger

let mainWindow;
let infoWindow = null;


function createWindow() {
  let display = electron.screen.getPrimaryDisplay();
  let width = display.bounds.width;
  let height = display.bounds.height;

  mainWindow = new BrowserWindow({
    width: width, // on définit une taille pour notre fenêtre
    height: height,
    maximized: true,
    center: true,
    frame: true, // en faire une fenetre
    icon: path.join(__dirname, 'Views/assets/images/qrludo-icon.png')
  });

  mainWindow.setResizable(true); // autoriser le redimensionnement

  mainWindow.loadURL(`file://${__dirname}/index.html`); // on doit charger un chemin absolu
  //  mainWindow.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

}

function createInfoWindow() {
  let display = electron.screen.getPrimaryDisplay();
  let width = display.bounds.width;
  let height = display.bounds.height;

  let w = Math.floor(width / 3);

  infoWindow = new BrowserWindow({
    parent: mainWindow,
    maxWidth: w, // on définit une taille pour notre fenêtre
    height: height,
    maximized: true,
    x: width - w,
    y: 0,
    frame: true, // en faire une fenetre
    icon: path.join(__dirname, 'Views/assets/images/qrludo-icon.png')
  });

  infoWindow.setResizable(true); // autoriser le redimensionnement
  infoWindow.loadURL(`file://${__dirname}/index-info.html`); // on doit charger un chemin absolu

  infoWindow.on('closed', () => {
    infoWindow = null;
    if (mainWindow != null) {
      mainWindow.setMaximumSize(width, height); // restore main window size
      mainWindow.setSize(width, height); // restore main window size
      mainWindow.maximize();
    }
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }

  // delete all music in folder Download
  const fs = require('fs');
  const path = require('path');
  let directory = path.join(__dirname, 'Download');

  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });

});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('showInfoWindow', (e, arg) => {
  if (infoWindow == null) {
    createInfoWindow();
    let display = electron.screen.getPrimaryDisplay();
    let width = display.bounds.width;
    let height = display.bounds.height;
    let w = width - (Math.floor(width / 3) + 10);

    mainWindow.setMaximumSize(w, height);
  }
});

/**
 * Copyright © 12/02/2018, Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * The Software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders X be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the Software.
 * Except as contained in this notice, the name of the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
 */
