import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import { Client } from 'minecraft-launcher-core';
const globalAny:any = global;
import { format } from 'url'
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    backgroundColor: "#2a323d",
    minWidth: 600,
    minHeight: 600,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false// add this
    },
    width: 800,
  });

  // and load the index.html of the app.
  //mainWindow.loadFile(path.join(__dirname, "../view/index.html"));
  mainWindow.loadURL(format('http://localhost:8080'))
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
}
globalAny.config = () => "ddd";
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
ipcMain.on('test', () => {
 console.log('test')
})
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
