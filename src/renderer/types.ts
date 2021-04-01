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
		ipcRenderer: ipcRenderer;
	}
}
