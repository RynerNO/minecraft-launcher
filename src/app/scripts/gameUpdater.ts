import axios from 'axios';
import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { App as config } from '../config/index';
import { downloadAsset } from './download';
import { unpackAsset } from './unzip';
export const updateGame = async () => {
	try {
		const response = await axios.get(`${config.GITHUB_API}/repos/RynerNO/minecraft-client/releases`);
		const responseData = response.data[0];
		const newVersion = responseData['tag_name'];

		for (let i = 0; i < responseData['assets'].length; i++) {
			if (responseData['assets'][i]['name'] === 'update.zip') {
				await downloadAsset(
					responseData['assets'][i]['browser_download_url'],
					'update.zip',
					responseData['assets'][i]['size']
				);
			}
		}
		await unpackAsset('update.zip');
		fs.writeFileSync(
			path.join(path.dirname(app.getPath('userData')), 'ioe', 'minecraft', 'version.txt'),
			newVersion,
			{
				encoding: 'utf8',
			}
		);
		return;
	} catch (e) {}
};

export const checkUpdate = async () => {
	try {
		if (!fs.existsSync(path.join(path.dirname(app.getPath('userData')), 'ioe', 'minecraft', 'version.txt')))
			return true;
		const response = await axios.get(`${config.GITHUB_API}/repos/RynerNO/minecraft-client/releases`);
		const responseData = response.data;
		const currentVersion = fs.readFileSync(
			path.join(path.dirname(app.getPath('userData')), 'ioe', 'minecraft', 'version.txt'),
			'utf8'
		);
		if (responseData[0]['tag_name'] == currentVersion) return false;
		else return true;
	} catch (e) {}
};
