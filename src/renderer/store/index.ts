import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import SecureLS from 'secure-ls';
const ls = new SecureLS({ isCompression: false });
import { axios } from '../util';
import { Commit } from 'vuex/types/index';
import { authResponse, loginData, registerData } from '../types';
export type State = typeof initialState;
const initialState = {
	auth: {
		uuid: '',
		name: '',
		accessToken: '',
	},
	settings: {
		ramUsage: 5120,
	},
};

const mutations = {
	setAuth(state: State, payload: authResponse) {
		state.auth = payload;
	},
	unsetAuth(state: State) {
		state.auth = initialState.auth;
	},
	changeRamUsage(state: State, payload: number) {
		state.settings.ramUsage = payload;
	},
};
const actions = {
	login({ commit }: { commit: Commit }, payload: loginData) {
		return new Promise((resolve, reject) => {
			axios()
				.post('/login', payload)
				.then((response) => {
					commit('setAuth', response.data);
					resolve(response.data);
				})
				.catch((e) => {
					reject(e);
				});
		});
	},
	register({ commit }: { commit: Commit }, payload: registerData) {
		return new Promise((resolve, reject) => {
			axios()
				.post('/register', payload)
				.then((response) => {
					commit('setAuth', response.data);
					resolve(response.data);
				})
				.catch((e) => {
					reject(e);
				});
		});
	},
	verify({ commit }: { commit: Commit }, payload: { accessToken: string }) {
		return new Promise((resolve, reject) => {
			axios()
				.post('/verify', payload)
				.then((response) => {
					commit('setAuth', response.data);
					resolve(response.data);
				})
				.catch((e) => {
					if (e.message == 'Request failed with status code 401' || e.message == 'Request failed with status code 400') {
						commit('unsetAuth');
					}
					reject(e);
				});
		});
	},
};
export const store = createStore({
	state: initialState,
	mutations,
	actions,
	plugins: [
		createPersistedState({
			storage: {
				getItem: (key) => ls.get(key),
				setItem: (key, value) => ls.set(key, value),
				removeItem: (key) => ls.remove(key),
			},
		}),
	],
});
