import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import { Client } from 'minecraft-launcher-core';
import { existsSync, promises } from 'fs'
import { downloadGame } from "./scripts/download";

import { autoUpdater, NsisUpdater } from "electron-updater"

import Debug from 'debug';

export const log = Debug('App')
Debug.enable('App')
export let mainWindow: BrowserWindow | undefined;

const updater = new NsisUpdater({
  provider: "github"
});

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
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
  //mainWindow.removeMenu()
  // and load the index.html of the app.
  //mainWindow.loadFile(path.join(__dirname, "../view/index.html"));
  mainWindow.loadFile(path.join(__dirname, "../", "renderer", "index.html"))
  // mainWindow.loadURL('http://localhost:8080')
  // Open the DevTools.
   mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  createWindow();
  autoUpdater.autoDownload = true
  autoUpdater.checkForUpdates()
  autoUpdater.on('update-downloaded', () => {

    autoUpdater.quitAndInstall(true, true)
  })
  
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

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



 async function isDirEmpty(dirname: string) {
    if(!existsSync(dirname)) return true;
   const files = await promises.readdir(dirname)

   const isEmpty = files.length === 0;

  return isEmpty;
}

ipcMain.on('launchGame', async (event, profile: {
      id: string;
      name: string;
      selectedProfile: {
          id: string;
          name: string;
          legacy: boolean;
      };
      userProperties: {};
      token: string;
      accessToken: string;
      clientToken: string;
      avaliableProfiles: {};
      status: boolean;
}) => {
  log('Launch Game Event')
  const isEmpty = await isDirEmpty(path.join(path.dirname(app.getPath('exe')), 'resources', 'minecraft'))
  log(isEmpty)
  if(isEmpty) {
    
    downloadGame()
  } else {
    const launcher = new Client();
    let opts = {
      authorization: {
          access_token: profile.accessToken,
          name: profile.name,
          client_token: profile.clientToken,
          uuid: profile.id,
          selected_profile: profile.selectedProfile,
          user_properties: JSON.stringify({}),},
      javaPath: path.resolve(path.dirname(app.getPath('exe')), 'resources', 'minecraft', 'jdk-win64/bin/java.exe'),
      root: path.resolve(path.dirname(app.getPath('exe')), 'resources', 'minecraft'),
      version: {
          type: "release",
          number: "1.16.5",
          custom: "forge-36.1.0"
      },
      memory: {
          max: "4G",
          min: "2G"
      }
  }


      launcher.launch(<any>opts);
      launcher.on('debug', (e) => {
        console.log(e)
        mainWindow.webContents.send('gameLaunching', e)
      });
      launcher.on('data', (e) => {
        console.log(e)
        mainWindow.webContents.send('gameLaunching', e)
      });
  }
 })


