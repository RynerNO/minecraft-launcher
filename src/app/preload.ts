// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import { contextBridge, ipcRenderer } from 'electron';

import { Renderer as config } from './config/index';

import open from 'open';
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object

contextBridge.exposeInMainWorld('ipcRenderer', {
	send: (channel: string, data: any) => {
		// whitelist channels
		ipcRenderer.send(channel, data);
	},
	receive: (channel: string, func: Function) => {
		// Deliberately strip event as it includes `sender`
		ipcRenderer.on(channel, (event, ...args) => func(...args));
	},
});

contextBridge.exposeInMainWorld('nodeOpen', (target: string) => {
	open(target);
});
contextBridge.exposeInMainWorld('config', {
	...config,
});
