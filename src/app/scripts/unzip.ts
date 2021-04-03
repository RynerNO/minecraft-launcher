import { extractFull } from 'node-7z';
import dotenv from 'dotenv';
import { log, mainWindow } from '../main';
import { app } from 'electron';
import fs from 'fs';
dotenv.config();
const path = require('path');
const pass = '8F430AA5D4C837946EE84E78DBA738D4'; // it is not private.
const pathTo7zip = path.join(path.dirname(app.getPath('exe')), 'resources', 'build', '7za.exe');
export const unzipGame = async () => {
	log('Unzipping Game');
	try {
		const seven = extractFull(
			path.join(path.dirname(app.getPath('userData')), 'ioe', 'game.zip'),
			path.join(path.dirname(app.getPath('userData')), 'ioe'),
			{
				$bin: pathTo7zip,
				password: pass,
				$progress: true,
			}
		);

		seven.on('progress', function (progress) {
			if (mainWindow == undefined) return;
			mainWindow.webContents.send('unpackGame', { progress: progress.percent });
		});
		seven.on('end', () => {
			if (mainWindow == undefined) return;
			mainWindow.webContents.send('gameDownloadFinished');
			fs.promises.unlink(path.join(path.dirname(app.getPath('userData')), 'ioe', 'game.zip')).catch(() => {});
		});
	} catch (e) {
		console.log(e);
	}
};
