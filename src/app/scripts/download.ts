import axios from 'axios';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { log, mainWindow } from '../main';
import path from 'path';
import { unzipGame } from './unzip';
import { app } from 'electron';
import { App as config } from '../config/index';
const githubApi = config.GITHUB_API;

export const downloadGame = async () => {
	log('Starting game gownload');

	if (existsSync(path.join(path.dirname(app.getPath('userData')), 'ioe', 'game.zip'))) {
		unzipGame();
		return;
	}
	const { link, size } = await getDownloadData();
	if (mainWindow == undefined) return;
	mainWindow.webContents.send('gameDownload', { progress: 1 });
	axios.get(link, { responseType: 'stream' }).then((response) => {
		mkdirSync(path.join(path.dirname(app.getPath('userData')), 'ioe'), { recursive: true });
		const file = createWriteStream(path.join(path.dirname(app.getPath('userData')), 'ioe', 'game.zip'));
		response.data.pipe(file);

		const intervalId = setInterval(() => {
			const progress = Math.round((file.bytesWritten / size) * 100);

			mainWindow.webContents.send('gameDownload', { progress: progress });
		}, 2000);

		file.on('finish', () => {
			clearInterval(intervalId);
			unzipGame();
		});
	});
};

async function getDownloadData() {
	log('Get download data');
	const response = await axios.get(`${githubApi}/repos/RynerNO/minecraft-client/releases`);
	const downloadLink = response.data[0]['assets'][0]['browser_download_url'];
	const downloadSize = response.data[0]['assets'][0]['size'];
	const data = {
		link: downloadLink,
		size: downloadSize,
	};
	log('Data:', data);
	return data;
}

export const downloadAsset = (url: string, name: string, size: number) => {
	return new Promise((resolve, reject) => {
		if (!url) return resolve('');
		axios.get(url, { responseType: 'stream' }).then((response) => {
			mkdirSync(path.join(path.dirname(app.getPath('userData')), 'ioe'), { recursive: true });
			const file = createWriteStream(path.join(path.dirname(app.getPath('userData')), 'ioe', name));
			response.data.pipe(file);

			const intervalId = setInterval(() => {
				const progress = Math.round((file.bytesWritten / size) * 100);

				mainWindow.webContents.send('gameDownload', { progress: progress });
			}, 2000);

			file.on('finish', () => {
				clearInterval(intervalId);
				resolve('');
			});
		});
	});
};
