<template lang="pug">
div.p-col-12.p-d-flex.p-ai-center.p-jc-center.p-flex-column.r-container
    
    div.launchStatus(v-if="showLaunchStatus")
        p {{ launchStatus }}
        ProgressBar(:value="launchProgress" v-if="showProgressBar") 
    Button(label="Играть" class="p-button-raised  p-button p-button-text p-pl-4 p-pr-4 p-mt-3" :disabled="!readyToLaunch"  @click.prevent="launchGame")
    Button(label="Сменить аккаунт" class="p-button-raised  p-button-danger p-button-text p-pl-4 p-pr-4 p-mt-3" @click.prevent="logout")
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue'
import { useStore } from 'vuex'
import Button from 'primevue/button'
import { ipcRenderer } from '../types'
import ProgressBar from 'primevue/progressbar';
import { useRouter } from 'vue-router';
export default defineComponent({
    name: 'Home',
    components: {
     Button,
     ProgressBar
    },
    // @ts-ignore
    setup({ props }) {
        const store = useStore()
        const router = useRouter()
        const ipc: ipcRenderer = <ipcRenderer>inject('ipcRenderer')
        const showLaunchStatus = ref(false)
        const launchStatus = ref('Проверка файлов')
        const launchProgress = ref(0)
        const readyToLaunch = ref(true)
        const showProgressBar = ref(false)
        const launchGame = () => {      
               
        
            ipc.send('launchGame', JSON.parse(JSON.stringify(store.state.auth)));
            showLaunchStatus.value = true
            ipc.receive('gameDownload', ({ progress } : { progress: number}) => {
                readyToLaunch.value = false
                showProgressBar.value = true;
                launchStatus.value = "Загрузка файлов"
                launchProgress.value = progress
            })
            ipc.receive('unpackGame', ({ progress }: { progress: number}) => {
                readyToLaunch.value = false;
                 showProgressBar.value = true;
                launchStatus.value = "Распаковка файлов"
                launchProgress.value = progress
            })

            ipc.receive('gameDownloadFinished', () => {
                readyToLaunch.value = true;
                showProgressBar.value = false;
                launchStatus.value = "Готово к запуску"
            })


            ipc.receive('gameLaunching', (data: any) => {
                readyToLaunch.value = false;
                showProgressBar.value = false;
                launchStatus.value = "Игра запускается!"
            })
        }
        const logout = () => {
            store.commit('unsetAuth')
            router.push('login');
        }
        return {
            launchGame,
            launchStatus,
            launchProgress,
            showLaunchStatus,
            readyToLaunch,
            showProgressBar,
            logout
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
