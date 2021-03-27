<template lang="pug">
div.p-col-12.p-d-flex.p-ai-center.p-flex-column.p-jc-center.r-container
	div.p-grid.p-fluid
		div.p-col-12
			div.p-inputgroup
				span(class="p-inputgroup-addon")
					i(class="pi pi-envelope")
				InputText(placeholder="Email")
	div.p-grid.p-fluid
		div.p-col-12
			div.p-inputgroup
				span(class="p-inputgroup-addon")
					i(class="pi pi-lock")
				InputText(placeholder="Password")
	Button(label="Войти" class="p-button-raised  p-button p-button-text p-pl-4 p-pr-4 p-mt-3" icon="pi pi-chevron-right" iconPos="right" )
	p Нет аккаунта? 
		router-link(to="/register") Зарегистрироваться
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
export default defineComponent({
	name: 'Home',
	components: {
	 InputText,
	 Button
	},
	
   
	   
	 
})
</script>

<style lang="sass" scoped>
</style>