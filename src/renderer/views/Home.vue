<template lang="pug">
div.p-col-3.p-d-flex.p-ai-center.p-flex-column
    Button(label="Играть" class="p-button-raised  p-button p-button-text p-pl-4 p-pr-4 p-mt-3"  @click.prevent="launchGame")
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
import Button from 'primevue/button'

export default defineComponent({
    name: 'Home',
    components: {
     
    },
    setup() {
        const store = useStore()
        const launchGame = () => {}
        return {
            launchGame
        }
    }
    
   
       
     
})
</script>

<style lang="sass">
img 
    max-width: 100%
h1
    text-align: center
</style>
