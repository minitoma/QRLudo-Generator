const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
var path = require('path');

require('electron-debug')({showDevTools: true}); // pour debugger

let mainWindow;


function createWindow () {


  mainWindow = new BrowserWindow({
    width: 1300, // on définit une taille pour notre fenêtre
    height: 700,
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

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }



});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Copyright © 12/02/2018, Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * The Software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders X be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the Software.
 * Except as contained in this notice, the name of the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP shall not be used in advertising or otherwise to promote the sale, use or other dealings in this Software without prior written authorization from the Corentin TALARMAIN, Thomas CALATAYUD, Rahmatou Walet MOHAMEDOUN, Jules LEGUY, David DEMBELE, Alassane DIOP
*/
