<template lang="pug">
div.p-col-3.p-d-flex.p-ai-center.p-flex-column
    img(src="../assets/logo.png").p-col-6
    h1 Vue 3
    h2 PrimeFlex && PrimeVue
    h3 Template   
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'


export default defineComponent({
    name: 'Home',
    components: {
     
    },
    setup() {
        const router = useRouter();
        router.push('/login')
    }
    
   
       
     
})
</script>

<style lang="sass">
img 
    max-width: 100%
h1
    text-align: center
</style>
