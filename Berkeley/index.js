const { app, BrowserWindow } = require("electron");

// Need electron to expose udp to js
app.whenReady().then(createWindow);

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 400,
    resizable: true,
    // nodeIntegration: true,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
    }
  });
  // win.maximize()
  win.loadFile("index.html");
}