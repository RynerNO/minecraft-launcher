<template lang="pug">
div
	div.r-menubar
		div.r-menubar-drag
		div.r-menubar-start
			div(class="p-d-flex p-ai-center p-p-1")
				img(alt="logo" :src="Logo" height="25" class="p-mr-2")
				span(class="r-app-title") Launcher
		div.r-menubar-end
			Button(icon="pi pi-minus" class="p-button-text  r-button-no-outline p-button-sm" @click="minimize")
			Button(icon="pi pi-times" class="p-button-text p-button-danger r-button-no-outline p-button-sm" @click="close")
	FlashMessage(:messages="flashMessages")
	router-view 
</template>

<script lang="ts">
import { defineComponent, onMounted, provide, Ref, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { v4 as uuidv4 } from 'uuid';
//@ts-ignore
import Logo from './assets/logo.png';

import Button from 'primevue/button';
import Menubar from 'primevue/menubar';
import FlashMessage from './components/FlashMessage.vue';
export default defineComponent({
	name: 'App',
	components: {
		Menubar,
		Button,
		FlashMessage,
	},
	setup() {
		const store = useStore();
		const router = useRouter();
		const ipc = window.ipcRenderer;
		const flashMessages: Ref<any[]> = ref([]);

		provide('flashMessages', flashMessages);
		ipc.receive('updateAvaliable', () => {
			flashMessages.value.push({
				id: uuidv4(),
				text: 'Доступно обновление',
				type: 'warning',
				command: {
					label: 'Обновить',
					function: () => {
						ipc.send('update');
					},
				},
			});
		});

		onMounted(() => {
			store
				.dispatch('verify', { accessToken: store.state.auth.accessToken })
				.then(() => {
					router.push('/');
				})
				.catch((e: any) => {
					router.push('login');
				});
		});

		const close = () => {
			ipc.send('close');
		};
		const minimize = () => {
			ipc.send('minimize');
		};
		return {
			Logo,
			close,
			minimize,
			flashMessages,
		};
	},
});
</script>


<style lang="sass">
.r-button-no-outline:focus
	box-shadow: unset !important
.r-menubar
	width: 100%
	display: flex
	background: var(--surface-0)

	position: relative
	button
		cursor: pointer
.r-menubar-drag
	position: absolute
	width: calc(100% - 76px)
	-webkit-app-region: drag
	pointer-events: none
	height: 100%
.r-menubar-start
	margin-right: auto
.r-menubar-end
	margin-left: auto
.r-app-title
	font-size: 13px
body
	background-color: var(--surface-e)
	margin: 0
	overflow: hidden
	background-color: var(--surface-e)
	font-family: var(--font-family)
	font-weight: 400
	color: var(--text-color)
	-webkit-font-smoothing: antialiased
	-moz-osx-font-smoothing: grayscale

.r-container

	height: calc(100vh - 32px)

.r-field-container
	position: relative
	width: 100%
	max-width: 450px
	margin-top: 10px
	margin-left: 10px
	margin-right: 10px
.r-field-error
	background: #f8d7da
	border: solid #f5c6cb
	border-width: 0px
	border-radius: 3px
	color: #721c24
	margin: 0
	padding: 10px
	max-width: 450px
	width: 100%
	font-size: 13px
a
	color: #4EC5F1

@font-face
	font-family: 'Montserrat'
	font-style: normal
	font-weight: 300
	font-display: swap
	src: url(./assets/fonts/Montserrat-Light.ttf) format('truetype')

@font-face
	font-family: 'Montserrat'
	font-style: normal
	font-weight: 400
	font-display: swap
	src: url(./assets/fonts/Montserrat-Regular.ttf) format('truetype')

@font-face
	font-family: 'Montserrat'
	font-style: normal
	font-weight: 500
	font-display: swap
	src: url(./assets/fonts/Montserrat-Medium.ttf) format('woff2')

@font-face
	font-family: 'Montserrat'
	font-style: normal
	font-weight: 700
	font-display: swap
	src: url(./assets/fonts/Montserrat-Bold.ttf) format('truetype')
</style>
