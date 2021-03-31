import { extractFull } from 'node-7z'
import dotenv from 'dotenv'
import { log, mainWindow} from '../main';
import { app } from 'electron';
dotenv.config()
const path = require('path')
const pass = "8F430AA5D4C837946EE84E78DBA738D4"; // it is not private.
const pathTo7zip = path.join(path.dirname(app.getPath('exe')), "resources", "extra", "7za.exe")
export const unzipGame = async () => {
    log('Unzipping Game')
  try {

    const seven = extractFull(path.join(path.dirname(app.getPath('exe')), 'resources', 'game.zip'), path.join(path.dirname(app.getPath('exe')), 'resources'), {
      $bin: pathTo7zip,
      password: pass,
      $progress: true
    })
    
    seven.on('progress', function (progress) {
      if(mainWindow == undefined) return;
      mainWindow.webContents.send('unpackGame', {progress: progress.percent})
    })
    seven.on('end', () => {
      if(mainWindow == undefined) return;
      mainWindow.webContents.send('gameDownloadFinished')
    })
  } catch(e) {
    console.log(e);
  }
};