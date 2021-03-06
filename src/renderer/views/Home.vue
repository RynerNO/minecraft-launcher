<template lang="pug">
div
	Menubar()
		template(#start)
			div(class="p-d-flex")
				Avatar(icon="pi pi-user" size="large")
				div(class="p-d-flex p-flex-column p-ml-2")
					span() {{ store.state.auth.name}}
					span(class="p-d-flex p-mt-2 p-ai-center")
						span 0$
						i(class="p-ml-2 pi pi-wallet") 
				
			
		template(#end)
			Button( label="Настройки" icon="pi pi-fw pi-cog" class="p-button-raised  p-button p-button-text p-pl-4 p-pr-4" overlay-parent="true" @click="settingsOverlay.toggle($event)")
			OverlayPanel(ref="settingsOverlay" class="r-settings-overlay")
				div
					p Скин:
					FileUpload(name="skin" :maxFileSize="2097152" :fileLimit="1" url="http://95.181.153.73:3001/v1/file/save" @before-send="fileUpload" 
					@upload="fileUploadSuccess"
					@error="fileUploadError" 
					chooseLabel="Выбрать" 
					uploadLabel="Загрузить"
					cancelLabel="Отменить")
						template(#empty)
							div(class="p-d-flex p-ai-center")
								SkinViewer(:skin="skin.img")
								Button(icon="pi pi-times" @click="removeSkinConfirm" v-if="!skin.default")
						template(#files="slotProps")
							div(class="p-d-flex p-ai-center")
								SkinViewer(:skin="slotProps.files[0].objectURL")

				div
					p Память: {{ ramSlider }}MB
					Slider( :step="1024" :min="2048" :max="8192" v-model="ramSlider" @slideend="changeRamUsage")
			Button( label="Выйти" icon="pi pi-fw pi-power-off" class="p-button-raised p-ml-3 p-button-danger p-button-text p-pl-4 p-pr-4" @click="logout")
	div
		canvas(ref="skinCanvas")
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
				Button(
				label="Открыть папку" 
				class="p-button-raised  p-button p-button-text p-pl-4 p-pr-4 p-mt-3 p-button-lg" 
				@click.prevent="openGameFolder"
				)
	div(class="r-bottom-social")
		div
			div(@click.prevent="openInBrowser('https://discord.gg/mNvhZtm')")
				i(class="pi pi-discord ")
				span(class="p-ml-2") Join Discord
	ConfirmDialog
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { useStore } from 'vuex';
import { ipcRenderer } from '../types';

import {
	getServerStatus,
	logout,
	launchGame,
	changeRamUsage,
	openInBrowser,
	removeSkin,
	getSkin,
	openGameFolder,
} from '../methods';

import ProgressBar from 'primevue/progressbar';
import Button from 'primevue/button';
import ServerStatus from '../components/ServerStatus.vue';
import Menubar from 'primevue/menubar';
import Avatar from 'primevue/avatar';
import OverlayPanel from 'primevue/overlaypanel';
import Slider from 'primevue/slider';
import FileUpload from '../components/fileupload/FileUpload.vue';
import SkinViewer from '../components/SkinViewer.vue';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import { sendFlashMessage } from '../components/FlashMessage/flashMessage';
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
		SkinViewer,
		ConfirmDialog,
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
		const skin = getSkin();
		const confirm = useConfirm();
		const removeSkinConfirm = () => {
			confirm.require({
				message: 'Удалить текущий скин?',
				header: 'Подтверждение',
				icon: 'pi pi-exclamation-triangle',
				acceptLabel: 'Да',
				rejectLabel: 'Нет',
				accept: () => {
					removeSkin();
				},
				reject: () => {
					//callback to execute when user rejects the action
				},
			});
		};

		const fileUploadError = () => {
			sendFlashMessage({
				text: 'Ошибка загрузки скина',
				type: 'error',
				closable: true,
			});
		};
		const fileUploadSuccess = () => {
			sendFlashMessage({
				text: 'Скин загружен',
				type: 'success',
				closable: true,
			});
			settingsOverlay.value.hide();
			getSkin();
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
			skin,
			removeSkinConfirm,
			openGameFolder,
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
	&>div
		display: flex
		justify-content: flex-start
		&>div
			cursor: pointer
			display: flex
			align-items: center
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