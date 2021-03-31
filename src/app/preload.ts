// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import { contextBridge, ipcRenderer } from "electron";

import config from './config'
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "ipcRenderer", {
        send: (channel: string, data: any) => {
            // whitelist channels
                ipcRenderer.send(channel, data);

        },
        receive: (channel: string, func: Function) => {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            
        }
    }
);

contextBridge.exposeInMainWorld(
    "config", {
        ...config
    }
);

