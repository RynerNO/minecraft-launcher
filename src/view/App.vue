<template lang="pug">

router-view 

</template>

<script lang="ts">
import { defineComponent, onActivated  } from 'vue';
import { useRouter } from 'vue-router'
export default defineComponent({
  name: "App",
  setup() {
	  const router = useRouter()
		  router.push('/')

  } 	
});
</script>


<style lang="sass">

body
	background-color: var(--surface-e)
	margin: 0
	overflow-x: hidden
	overflow-y: auto
	background-color: var(--surface-e)
	font-family: var(--font-family)
	font-weight: 400
	color: var(--text-color)
	-webkit-font-smoothing: antialiased
	-moz-osx-font-smoothing: grayscale



.r-container 
	height: 100vh

.r-field-container 
	position: relative
	width: 100%
	max-width: 750px
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
	max-width: 750px
	width: 100%
a 
	color: var(--blue-300)
</style>
