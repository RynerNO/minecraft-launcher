import { router } from '../../router';
import { store } from '../../store';
import { ipcRenderer } from 'types';
import { ref } from 'vue';

const ipc = window.ipcRenderer;

const status = ref({
	online: false,
	players: 0,
	maxPlayers: 0,
	favicon: '',
	fillPercent: 0,
	name: '',
});
interface serverStatus {
	description: {
		text: string;
	};
	players: {
		max: number;
		online: number;
	};
	favicon: string;
	name: string;
}

ipc.receive('serverStatus', (serverStatus: serverStatus | false) => {
	if (serverStatus === false) {
		status.value.online = false;
	} else {
		status.value = {
			online: true,
			players: serverStatus.players.online,
			maxPlayers: serverStatus.players.max,
			favicon: serverStatus.favicon,
			fillPercent: (serverStatus.players.online / serverStatus.players.max) * 100,
			name: serverStatus.name,
		};
	}
});

export const getServerStatus = () => {
	return status;
};

export const logout = () => {
	store.commit('unsetAuth');
	router.push('login');
};

export const launchGame = () => {
	ipc.send('launchGame', JSON.parse(JSON.stringify({ ...store.state.auth, ...store.state.settings })));
};

export const changeRamUsage = (e: { value: number }) => {
	console.log(e);
	store.commit('changeRamUsage', e.value);
};

export const openInBrowser = (url: string) => {
	window.nodeOpen(url);
};
