import { createApp } from 'vue';
import { router } from './router';
import { store } from './store';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';

import App from './App.vue';
import 'primevue/resources/themes/bootstrap4-dark-blue/theme.css';
import './assets/themes/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
const app = createApp(App);
app.use(router);
app.use(store);
app.use(PrimeVue);
app.use(ConfirmationService);
app.provide('ipcRenderer', window.ipcRenderer);

app.mount('#app');
