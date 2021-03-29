import { createApp } from 'vue';
import { router } from './router';
import { store } from './store';
import PrimeVue from 'primevue/config';
import App from "./App.vue";
import './assets/themes/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css';    
const app = createApp(App)
app.use(router)
app.use(store)
app.use(PrimeVue)
app.mount('#app');

