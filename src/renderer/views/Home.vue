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
            Button( label="Настройки" icon="pi pi-fw pi-cog" class="p-button-raised  p-button p-button-text p-pl-4 p-pr-4" )
            Button( label="Выйти" icon="pi pi-fw pi-power-off" class="p-button-raised p-ml-3 p-button-danger p-button-text p-pl-4 p-pr-4" @click="logout")
    div.p-d-flex.p-ai-center.p-jc-center.p-flex-column.r-container
        div.launchStatus(v-if="showLaunchStatus")
            p {{ launchStatus }}
            ProgressBar(:value="launchProgress" v-if="launchProgress > 0") 
        Button(
        label="Играть" 
        :icon="(!readyToLaunch) ? 'pi pi-spin pi-spinner': ''" 
        class="p-button-raised  p-button p-button-text p-pl-4 p-pr-4 p-mt-3" 
        :disabled="!readyToLaunch"  
        @click.prevent="launchGame"
        )
    ServerStatus(v-bind="serverStatus" class="r-server-status")
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue'
import { useStore } from 'vuex';
import { ipcRenderer } from '../types'

import { getServerStatus, logout, launchGame} from './Home/functions'


//@ts-ignore
import Logo from '../assets/logo.png'

import ProgressBar from 'primevue/progressbar';
import Button from 'primevue/button'
import ServerStatus from '../components/ServerStatus.vue'
import Menubar from 'primevue/menubar';
import Avatar from 'primevue/avatar';
import Badge from 'primevue/badge';
export default defineComponent({
    name: 'Home',
    components: {
     Button,
     ProgressBar,
     ServerStatus,
     Menubar,
     Avatar,
     Badge
    },
    setup() {
        const store = useStore()
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
            store,
            Logo
        }
    }
    
   
       
     
})
</script>

<style lang="sass" scoped>
.r-server-status 
    position: fixed
    left: 10px
    bottom: 10px
    max-width: 300px
    width: 100%
::v-deep(.p-menubar-button) 
    display: none !important
</style>
