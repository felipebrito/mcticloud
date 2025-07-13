const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // Desabilita gestos de navegação por swipe
      enableRemoteModule: false
    }
  });

  win.loadFile('index.html');
  // win.removeMenu(); // opcional: remove a barra de menu

  // Bloqueia gestos de swipe (voltar/avançar)
  win.webContents.on('before-input-event', (event, input) => {
    if (
      (input.type === 'keyDown' && (
        (input.key === 'BrowserBack' || input.key === 'BrowserForward') ||
        (input.key === 'ArrowLeft' && input.alt) ||
        (input.key === 'ArrowRight' && input.alt)
      ))
    ) {
      event.preventDefault();
    }
  });

  // Bloqueia gestos de swipe do trackpad (macOS)
  win.on('swipe', (e) => {
    e.preventDefault();
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
}); 