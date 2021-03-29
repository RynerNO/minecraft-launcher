import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
const ls = new SecureLS({ isCompression: false });
import { axios } from '../util'
import { Commit } from 'vuex/types/index';
export type State = typeof initialState
const initialState = {
  auth: {
    id: "",
    name: "",
    selectedProfile: {
    id: "",
    name: "",
    legacy: false
    },
    userProperties: {},
    token: "",
    accessToken: "",
    clientToken: "",
    avaliableProfiles: {},
    status: false
  },
   
  
};

const mutations = {
      setAuth(state: State, payload: authResponse) {
        state.auth = payload
        state.auth.status = true;
      },
      unsetAuth(state: State) {
        state.auth = initialState.auth;
      }
};
const actions = {
  login({commit} : {commit: Commit}, payload: loginData) {
    return new Promise((resolve, reject) => {
        axios().post('/login', payload).then((response) => {
          commit('setAuth', response.data)
          resolve(response.data)
        }).catch((e) => {
          reject(e)
        })
    })
  },
  register({commit} : {commit: Commit}, payload: registerData) {
    return new Promise((resolve, reject) => {
        axios().post('/register', payload).then((response) => {
          commit('setAuth', response.data)
          resolve(response.data)
        }).catch((e) => {
          reject(e)
        })
    })
  }

}
export const store = createStore({ 
    initialState, 
    mutations,
    actions,
    plugins: [createPersistedState({
        storage: {
          getItem: key => ls.get(key),
          setItem: (key, value) => ls.set(key, value),
          removeItem: key => ls.remove(key)
        }
      })],

});
