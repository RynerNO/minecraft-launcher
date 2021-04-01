<template lang="pug">
div.r-status-container
    p(class="p-text-center") Server
    p(class="p-d-flex p-ai-center ") Status: 
        i(class="pi pi-circle-on p-ml-4 r-status-icon" :style="{'color': (online) ? '#00cc6e' : '#848484'}")
        span(class="p-ml-1" :style="{'color': (online) ? '#00cc6e' : '#848484'}") {{ (online ) ? "Online" : "Offline"}}
    p Players: 
        span(class="p-ml-3" :style="{ 'color': calcPlayersColor()}") {{ `${players} / ${maxPlayers}`}}
    
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'ServerStatus',
    props: {
        online: {
            type: Boolean,
            required: true
        },
        players: {
            type: Number,
            required: true
        },
        maxPlayers: {
            type: Number,
            required: true
        },
        favicon: {
            type: String,
            required: false
        }
    
    }, 
    setup(props) {
    

        const calcPlayersColor = () => {
            
            const percent = props.players / props.maxPlayers * 100;
            let color = {
                R: 0,
                G: 204, 
                B:110
            }
            if(percent < 45) color = { R: 0, G: 204, B:110 }
            else if(percent >= 45 && percent <= 75) color = { R: 185, G: 230, B:7 }
            else if(percent > 75) color = { R: 250, G: 87, B:0 }

            return `rgb(${color.R}, ${color.G}, ${color.B}`
        }
        return {
            calcPlayersColor
        }
    }

})
</script>

<style lang="sass" scoped>
.r-status-icon
    font-size: 9px
.r-status-container 
    background: var(--surface-0)
    padding: 15px
    min-width: 300px
    border-radius: 5px
    box-shadow: 0 3px 1px -2px rgb(0 0 0 / 20%), 0 3px 2px 0 rgb(0 0 0 / 14%), 0 1px 5px 0 rgb(0 0 0 / 12%)

input
    font-size: 24px
</style>
