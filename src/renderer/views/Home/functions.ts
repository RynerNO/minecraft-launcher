import { router } from '../../router';
import { store } from '../../store';
import { ipcRenderer } from 'types';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const ipc: ipcRenderer = <ipcRenderer>window.ipcRenderer;

const status = ref({
	online: false,
	players: 0,
	maxPlayers: 0,
	favicon: '',
	fillPercent: 0,
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
