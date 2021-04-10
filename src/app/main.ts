import { app, BrowserWindow, ipcMain, Tray } from 'electron';
import * as path from 'path';
import { Client } from 'minecraft-launcher-core';
import { existsSync, promises } from 'fs';
import { downloadGame } from './scripts/download';
import dotenv from 'dotenv';
import { autoUpdater, NsisUpdater } from 'electron-updater';
import { App as config } from './config/index';
import Debug from 'debug';
import { Client as McProtoClient, PacketWriter, State } from 'mcproto';
import { checkUpdate, updateGame } from './scripts/gameUpdater';
import open from 'open';
dotenv.config();

export const log = Debug('App');
Debug.enable('App');
export let mainWindow: BrowserWindow | undefined;

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		backgroundColor: '#2a323d',
		minWidth: 800,
		minHeight: 680,
		width: 800,
		height: 680,
		frame: process.env.DEV_ENV === 'true',
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: false, // add this
		},
	});

	// and load the index.html of the app.
	if (process.env.DEV_ENV === 'true') {
		mainWindow.loadURL('http://localhost:8080');
		mainWindow.webContents.openDevTools();
	} else {
		mainWindow.loadFile(path.join(__dirname, '../', 'renderer', 'index.html'));
		mainWindow.removeMenu();
	}

	// Open the DevTools.
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
	createWindow();
	autoUpdater.autoDownload = true;
	autoUpdater.checkForUpdates();
	autoUpdater.on('update-downloaded', () => {
		mainWindow.webContents.send('updateAvaliable');
		ipcMain.on('update', () => {
			autoUpdater.quitAndInstall(true, true);
		});
	});

	app.on('activate', function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});
app.on('browser-window-created', () => {
	setInterval(() => {
		checkServerStatus();
	}, 5000);
	checkServerStatus();
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

async function isDirEmpty(dirname: string) {
	if (!existsSync(dirname)) return true;
	const files = await promises.readdir(dirname);

	const isEmpty = files.length === 0;

	return isEmpty;
}

ipcMain.on(
	'launchGame',
	async (
		event,
		profile: {
			uuid: string;
			name: string;
			accessToken: string;
			status: boolean;
			ramUsage: number;
		}
	) => {
		log('Launch Game Event');
		const isEmpty = await isDirEmpty(path.join(path.dirname(app.getPath('userData')), 'ioe', 'minecraft'));
		log(isEmpty);
		if (isEmpty) {
			downloadGame();
		} else {
			const updateAvaliable = await checkUpdate();
			if (updateAvaliable) await updateGame();
			const launcher = new Client();

			let opts = {
				authorization: {
					access_token: profile.accessToken,
					name: profile.name,
					uuid: profile.uuid,
				},
				javaPath: path.resolve(
					path.dirname(app.getPath('userData')),
					'ioe',
					'minecraft',
					'jdk-win64/bin/java.exe'
				),
				root: path.resolve(path.dirname(app.getPath('userData')), 'ioe', 'minecraft'),
				version: {
					type: 'release',
					number: '1.12.2',
					custom: 'forge-14.23.5.2854',
				},
				memory: {
					max: `${profile.ramUsage / 1024}G`,
					min: `1G`,
				},
			};

			launcher.launch(<any>opts);
			launcher.on('debug', (e) => {
				console.log(e);
				mainWindow.webContents.send('gameLaunching', e);
			});
			launcher.on('data', (e) => {
				console.log(e);
				mainWindow.webContents.send('gameLaunching', e);
			});
		}
	}
);
async function checkServerStatus() {
	try {
		const client = await McProtoClient.connect(config.SERVER_HOST, config.SERVER_PORT);
		client.send(
			new PacketWriter(0x0)
				.writeVarInt(404)
				.writeString(config.SERVER_HOST)
				.writeUInt16(config.SERVER_PORT)
				.writeVarInt(State.Status)
		);

		client.send(new PacketWriter(0x0));
		const response = await client.nextPacket(0x0);

		if (mainWindow !== undefined)
			mainWindow.webContents.send('serverStatus', { ...response.readJSON(), name: config.SERVER_NAME });
		client.end();
	} catch (e) {
		if (mainWindow !== undefined) mainWindow.webContents.send('serverStatus', false);
	}
}

ipcMain.on('close', () => {
	app.exit();
});

ipcMain.on('minimize', () => {
	mainWindow.minimize();
});

ipcMain.on('openGameFolder', () => {
	open(path.resolve(path.dirname(app.getPath('userData')), 'ioe', 'minecraft'));
});
// {
//   [2]   description: { text: 'PvP/PvE Server based on Valhelsia modpack' },
//   [2]   players: { max: 20, online: 0 },
//   [2]   version: { name: 'Mohist 1.16.5', protocol: 754 },
//   [2]   favicon: 'data:image/png;base64,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',
//   [2]   forgeData: {
//   [2]     channels: [ [Object], [Object], [Object] ],
//   [2]     mods: [ [Object], [Object] ],
//   [2]     fmlNetworkVersion: 2
//   [2]   }
//   [2] }

export default app;
