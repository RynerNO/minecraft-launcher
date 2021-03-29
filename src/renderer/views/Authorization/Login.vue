<template lang="pug">
div.p-col-12.p-d-flex.p-ai-center.p-flex-column.p-jc-center.r-container
	div(class="r-field-container").p-inputgroup
		span(class="p-inputgroup-addon")
			i(class="pi pi-envelope")
		InputText(placeholder="Почта" @blur="validateEmail" v-model="formData.email.value" :class="{'p-invalid' : formData.email.invalid}")
	p(class="r-field-error" v-if="formData.email.invalid") Введите email в формате example@domain.com


	div(class="r-field-container").p-inputgroup
		span(class="p-inputgroup-addon")
			i(class="pi pi-lock")
		InputText(placeholder="Пароль" type="password" @blur="validatePassword" v-model="formData.password.value" :class="{'p-invalid' : formData.password.invalid}")
	p(class="r-field-error" v-if="formData.password.invalid") Пароль должен содержать не менее восьми знаков
	Button(label="Войти" class="p-button-raised  p-button p-button-text p-pl-4 p-pr-4 p-mt-3" icon="pi pi-chevron-right" iconPos="right" :disabled="formData.invalid" @click.prevent="submitForm")
	p Нет аккаунта? 
		router-link(to="register") Регистрация
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import InlineMessage from 'primevue/inlinemessage'
import isEmail from 'validator/es/lib/isEmail';
import isEmpty from 'validator/es/lib/isEmpty';
import isLength from 'validator/es/lib/isLength';
import { useRouter } from 'vue-router'

export default defineComponent({
	name: 'Home',
	components: {
	 InputText,
	 Button,
	 InlineMessage
	},
	setup() {
		const store = useStore()
		const router = useRouter()
		const submitForm = () => {
			if(formData.value.invalid) return;
			const {email, password} = formData.value
			store.dispatch('login', {email: email.value, password: password.value}).then(() => {
				router.push('/')
			})
		}
		const formData = ref({
			invalid: true,
			email: {
				invalid: false,
				value: ""
			},
			password: {
				invalid: false,
				value: ""
			},
		})
		const validateEmail = (e: InputEvent) => {
			const input = <HTMLInputElement>e.target;
			formData.value.email.invalid = !isEmail(input.value);
			validateForm();
		}
	
		const validatePassword = (e: InputEvent) => {
			const input = <HTMLInputElement>e.target
			formData.value.password.invalid = isEmpty(input.value) || !isLength(input.value, {
				min: 8
			});
			validateForm();
		}
		const validateForm = () => {
			if( formData.value.email.invalid 
			|| formData.value.password.invalid ) formData.value.invalid = true;
			else formData.value.invalid = false;
		}
		const Test = () => {
			console.log(store.state.auth)
		}
		return {
			submitForm,
			validateEmail,
			validatePassword,
			formData,
			Test
		}
	}
   
	   
	 
})
</script>

<style lang="sass" scoped>
</style>