import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";

const ls = new SecureLS({ isCompression: false });

export type State = typeof state
const state = {

};

const mutations = {

};
const actions = {
  login({}, payload: loginData) {
      
  }

}
export const store = createStore({ 
    state, 
    mutations,
    plugins: [createPersistedState({
        storage: {
          getItem: key => ls.get(key),
          setItem: (key, value) => ls.set(key, value),
          removeItem: key => ls.remove(key)
        }
      })],

});
