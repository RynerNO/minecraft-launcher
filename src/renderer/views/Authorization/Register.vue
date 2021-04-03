<template lang="pug">
div.p-col-12.p-d-flex.p-ai-center.p-flex-column.p-jc-center.r-container
	p(class="r-field-error" v-if="registerFailed.status") {{ registerFailed.message }}
	div(class="r-field-container").p-inputgroup
		span(class="p-inputgroup-addon")
			i(class="pi pi-envelope")
		InputText(placeholder="Почта" @blur="validateEmail" v-model="formData.email.value" :class="{'p-invalid' : formData.email.invalid}")
	p(class="r-field-error" v-if="formData.email.invalid") Введите email в формате example@domain.com

	div(class="r-field-container").p-inputgroup
		span(class="p-inputgroup-addon")
			i(class="pi pi-user")
		InputText(placeholder="Ник" @blur="validateName" v-model="formData.name.value" :class="{'p-invalid' : formData.name.invalid}")
	p(class="r-field-error" v-if="formData.name.invalid") Имя пользователя может включать латинские буквы (a-z), цифры (0-9) и точку (.).


	div(class="r-field-container").p-inputgroup
		span(class="p-inputgroup-addon")
			i(class="pi pi-lock")
		InputText(placeholder="Пароль" type="password" @blur="validatePassword" v-model="formData.password.value" :class="{'p-invalid' : formData.password.invalid}")
	p(class="r-field-error" v-if="formData.password.invalid") Пароль должен содержать не менее восьми знаков
	Button(label="Создать аккаунт" class="p-button-raised  p-button p-button-text p-pl-4 p-pr-4 p-mt-3" icon="pi pi-chevron-right" iconPos="right" :disabled="formData.invalid" @click.prevent="submitForm")
	p(class="p-mt-3") Уже есть акканут? 
		router-link(to="login") Войти
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import InlineMessage from 'primevue/inlinemessage';
import isEmail from 'validator/es/lib/isEmail';
import isEmpty from 'validator/es/lib/isEmpty';
import isLength from 'validator/es/lib/isLength';
import isAlphanumeric from 'validator/es/lib/isAlphanumeric';
import { useRouter } from 'vue-router';
import { ErrorResponse } from '../../types';

export default defineComponent({
	name: 'Register',
	components: {
		InputText,
		Button,
		InlineMessage,
	},
	setup() {
		const store = useStore();
		const router = useRouter();
		const registerFailed = ref({
			status: false,
			message: '',
		});
		const submitForm = () => {
			if (formData.value.invalid) return;
			const { email, name, password } = formData.value;
			store
				.dispatch('register', { email: email.value, name: name.value, password: password.value })
				.then((data: ErrorResponse | undefined) => {
					if (data === undefined) return router.push('/');
					if (data.status === 'Error') {
						registerFailed.value.status = true;
						registerFailed.value.message = data.message;
					}
				});
		};
		const formData = ref({
			invalid: true,
			email: {
				invalid: false,
				value: '',
			},
			name: {
				invalid: false,
				value: '',
			},
			password: {
				invalid: false,
				value: '',
			},
		});
		const validateEmail = (e: InputEvent) => {
			const input = <HTMLInputElement>e.target;
			formData.value.email.invalid = !isEmail(input.value);
			validateForm();
		};
		const validateName = (e: InputEvent) => {
			const input = <HTMLInputElement>e.target;
			formData.value.name.invalid =
				isEmpty(input.value) ||
				!isLength(input.value, {
					min: 3,
					max: 13,
				}) ||
				!isAlphanumeric(input.value, 'en-US');
			validateForm();
		};
		const validatePassword = (e: InputEvent) => {
			const input = <HTMLInputElement>e.target;
			formData.value.password.invalid =
				isEmpty(input.value) ||
				!isLength(input.value, {
					min: 8,
				});
			validateForm();
		};
		const validateForm = () => {
			registerFailed.value.status = false;
			if (formData.value.email.invalid || formData.value.name.invalid || formData.value.password.invalid)
				formData.value.invalid = true;
			else formData.value.invalid = false;
		};

		return {
			submitForm,
			validateEmail,
			validateName,
			validatePassword,
			formData,
			registerFailed,
		};
	},
});
</script>

<style lang="sass" scoped>
</style>