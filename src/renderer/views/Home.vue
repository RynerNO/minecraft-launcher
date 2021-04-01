<template lang="pug">
div.p-col-12.p-d-flex.p-ai-center.p-jc-center.p-flex-column.r-container
    
    div.launchStatus(v-if="showLaunchStatus")
        p {{ launchStatus }}
        ProgressBar(:value="launchProgress" v-if="launchProgress > 0") 
    Button(label="Играть" :icon="(!readyToLaunch) ? 'pi pi-spin pi-spinner': ''" class="p-button-raised  p-button p-button-text p-pl-4 p-pr-4 p-mt-3" :disabled="!readyToLaunch"  @click.prevent="launchGame")
    Button(label="Сменить аккаунт" class="p-button-raised  p-button-danger p-button-text p-pl-4 p-pr-4 p-mt-3" @click.prevent="logout")
    ServerStatus(v-bind="serverStatus")
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue'
import { ipcRenderer } from '../types'

import { getServerStatus, logout, launchGame} from './Home/functions'

import ProgressBar from 'primevue/progressbar';
import Button from 'primevue/button'
import ServerStatus from '../components/ServerStatus.vue'

export default defineComponent({
    name: 'Home',
    components: {
     Button,
     ProgressBar,
     ServerStatus
    },
    setup() {
        const ipc: ipcRenderer = <ipcRenderer>inject('ipcRenderer')
        const showLaunchStatus = ref(false)
        const launchStatus = ref('Проверка файлов')
        const launchProgress = ref(0)
        const readyToLaunch = ref(true)

        ipc.receive('gameDownload', ({ progress } : { progress: number}) => {
                showLaunchStatus.value = true
                readyToLaunch.value = false
                launchStatus.value = "Загрузка файлов"
                launchProgress.value = progress
            })
            ipc.receive('unpackGame', ({ progress }: { progress: number}) => {
                showLaunchStatus.value = true
                readyToLaunch.value = false;
                launchStatus.value = "Распаковка файлов"
                launchProgress.value = progress
            })

            ipc.receive('gameDownloadFinished', () => {
                showLaunchStatus.value = true
                readyToLaunch.value = true;
                launchProgress.value = 0
                launchStatus.value = "Готово к запуску"
            })


            ipc.receive('gameLaunching', (data: any) => {
                showLaunchStatus.value = false
                readyToLaunch.value = false;
            })

        

      
        

        const serverStatus = getServerStatus();
        return {
            launchGame,
            launchStatus,
            launchProgress,
            showLaunchStatus,
            readyToLaunch,
            logout,
            serverStatus,
        }
    }
    
   
       
     
})
</script>

<style lang="sass">
img 
    max-width: 100%
h1
    text-align: center


p 
    margin-top: 0
.p-terminal 
    background: #212121 !important

.r-terminal
    margin-top: 15px
    width: 100%
    max-width: 500px
    height: 500px

</style>
