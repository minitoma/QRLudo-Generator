const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

require('electron-debug')({showDevTools: true}); // pour debugger

let mainWindow;


function createWindow () {


  mainWindow = new BrowserWindow({
    width: 1300, // on définit une taille pour notre fenêtre
    height: 700,
    maximized: true,
    center: true,
    frame: true // en faire une fenetre
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
