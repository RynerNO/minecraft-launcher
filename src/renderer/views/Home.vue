<template lang="pug">
div
    Menubar()
        template(#start)
            div(class="p-d-flex")
                Avatar(icon="pi pi-user" size="large")
                div(class="p-d-flex p-flex-column p-ml-2")
                    span() {{ store.state.auth.name}}
                    span(class="p-d-flex p-mt-2")
                        span 0$
                        i(class="p-ml-2 pi pi-wallet") 
                        
            
        template(#end)
            Button( label="Настройки" icon="pi pi-fw pi-cog" class="p-button-raised  p-button p-button-text p-pl-4 p-pr-4" overlay-parent="true" @click="settingsOverlay.toggle($event)")
            OverlayPanel(ref="settingsOverlay" class="r-settings-overlay")
                div
                    p Скин:
                    FileUpload(name="skin" url="http://95.181.153.73:3001/v1/file/save" @before-send="fileUpload" 
                    @upload="fileUploadSuccess"
                    @error="fileUploadError" 
                    chooseLabel="Выбрать" 
                    uploadLabel="Загрузить"
                    cancelLabel="Отменить")
                div
                    p Память: {{ ramSlider }}MB
                    Slider( :step="1024" :min="2048" :max="8192" v-model="ramSlider" @slideend="changeRamUsage")
            Button( label="Выйти" icon="pi pi-fw pi-power-off" class="p-button-raised p-ml-3 p-button-danger p-button-text p-pl-4 p-pr-4" @click="logout")
    div(class="r-server-list p-d-flex p-mt-auto p-ml-auto")
        div(class="r-server-container p-d-flex p-jc-evenly p-ai-center")
            ServerStatus(v-bind="serverStatus" class="r-server-status" )
            div(class="p-d-flex p-ai-center p-jc-center p-flex-column r-launch-container")
                div.launchStatus(v-if="showLaunchStatus")
                        p {{ launchStatus }}
                        ProgressBar(:value="launchProgress" v-if="launchProgress > 0") 
                Button(
                label="Играть" 
                :icon="(!readyToLaunch) ? 'pi pi-spin pi-spinner': ''" 
                class="p-button-raised  p-button p-button-text p-pl-4 p-pr-4 p-mt-3 p-button-lg" 
                :disabled="!readyToLaunch"  
                @click.prevent="launchGame"
                )
    div(class="r-bottom-social")
            div(@click.prevent="openInBrowser('https://discord.gg/mNvhZtm')")
                i(class="pi pi-discord ")
                span(class="p-ml-2") Join Discord
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { useStore } from 'vuex';
import { ipcRenderer } from '../types';
import { v4 as uuidv4 } from 'uuid';

import { getServerStatus, logout, launchGame, changeRamUsage, openInBrowser } from './Home/functions';

import ProgressBar from 'primevue/progressbar';
import Button from 'primevue/button';
import ServerStatus from '../components/ServerStatus.vue';
import Menubar from 'primevue/menubar';
import Avatar from 'primevue/avatar';
import OverlayPanel from 'primevue/overlaypanel';
import Slider from 'primevue/slider';
import FileUpload from 'primevue/fileupload';
export default defineComponent({
	name: 'Home',
	components: {
		Button,
		ProgressBar,
		ServerStatus,
		Menubar,
		Avatar,
		OverlayPanel,
		Slider,
		FileUpload,
	},
	setup() {
		const store = useStore();
		const ipc: ipcRenderer = <ipcRenderer>inject('ipcRenderer');
		const showLaunchStatus = ref(false);
		const launchStatus = ref('Проверка файлов');
		const launchProgress = ref(0);
		const readyToLaunch = ref(true);
		const settingsOverlay = ref();
		const ramSlider = ref(store.state.settings.ramUsage);
		const flashMessages: any = inject('flashMessages');
		const fileUploadError = () => {
			flashMessages.value.push({
				id: uuidv4(),
				text: 'Ошибка загрузки скина',
				type: 'error',
				closable: true,
			});
		};
		const fileUploadSuccess = () => {
			flashMessages.value.push({
				id: uuidv4(),
				text: 'Скин загружен',
				type: 'success',
				closable: true,
			});
		};

		ipc.receive('gameDownload', ({ progress }: { progress: number }) => {
			showLaunchStatus.value = true;
			readyToLaunch.value = false;
			launchStatus.value = 'Загрузка файлов';
			launchProgress.value = progress;
		});
		ipc.receive('unpackGame', ({ progress }: { progress: number }) => {
			showLaunchStatus.value = true;
			readyToLaunch.value = false;
			launchStatus.value = 'Распаковка файлов';
			launchProgress.value = progress;
		});

		ipc.receive('gameDownloadFinished', () => {
			showLaunchStatus.value = true;
			readyToLaunch.value = true;
			launchProgress.value = 0;
			launchStatus.value = 'Готово к запуску';
		});

		ipc.receive('gameLaunching', (data: any) => {
			showLaunchStatus.value = false;
			readyToLaunch.value = false;
		});
		const fileUpload = (e: { xhr: XMLHttpRequest }) => {
			e.xhr.setRequestHeader('access-token', store.state.auth.accessToken);
		};
		const serverStatus = getServerStatus();
		return {
			launchGame,
			launchStatus,
			launchProgress,
			showLaunchStatus,
			readyToLaunch,
			logout,
			serverStatus,
			store,
			settingsOverlay,
			ramSlider,
			changeRamUsage,
			openInBrowser,
			fileUpload,
			fileUploadSuccess,
			fileUploadError,
		};
	},
});
</script>

<style lang="sass" scoped>
.r-bottom-social
    position: fixed
    left: 10px
    bottom: 10px
    width: 100%
    div
        display: flex
        align-items: center
        cursor: pointer
    i
        font-size: 35px
.r-server-status
    max-width: 205px
.r-server-container
    background: var(--surface-0)
    box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 3px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)
    width: 100%
    max-width: 400px
    position: fixed
    bottom: 10px
    right: 10px
</style>
<style lang="sass">
.p-menubar-button
    display: none !important
.r-settings-overlay
    min-width: 240px
</style>