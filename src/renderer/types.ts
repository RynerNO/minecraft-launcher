export interface loginData {
	email: string;
	password: string;
}

export interface registerData {
	email: string;
	name: string;
	password: string;
}

export interface Window {
	config: {
		AUTH_URL: string;
	};
	ipcRenderer: ipcRenderer;
}

export interface authResponse {
	uuid: string;
	name: string;
	accessToken: string;
}

export interface ipcRenderer {
	send: (channel: string, data?: any) => void;
	receive: (channel: string, func: Function) => void;
}

declare global {
	interface Window {
		config: {
			AUTH_URL: string;
		};
		nodeOpen: (target: string) => void;
		ipcRenderer: ipcRenderer;
		hide: () => void;
		close: () => void;
	}
}
