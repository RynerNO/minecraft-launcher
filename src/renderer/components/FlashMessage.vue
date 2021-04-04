<template lang="pug">
div(
	v-for="message in messagesList" 
	:key="message" 
	class="r-flash-message p-d-flex p-ai-center p-jc-between"
	:class=`{ 
		'r-flash-message-warning' : message.type == 'warning',
		'r-flash-message-success' : message.type == 'success',
		'r-flash-message-error' : message.type == 'error'
		}`
	)
	div(class="p-d-flex p-ai-center")
		i(class="pi" 
		:class=`{ 
			'pi-exclamation-triangle' : message.type == 'warning', 
			'pi-check' : message.type == 'success',
			'pi-minus-circle' : message.type == 'error'
			}`
			
			)
		p(class="p-ml-2") {{ message.text }}
	Button(v-if="message.command" @click="message.command.function" class="p-button-sm" :label="message.command.label"
	 :class=`{ 
		 'p-button-warning' : message.type == 'warning',
		 'p-button-success' : message.type == 'success',
		 'p-button-danger' : message.type == 'error'
		 }`)
	Button(v-if="message.closable", @click="messageClose(message.id)" icon="pi pi-times" class="p-ml-auto p-button-secondary")
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Button from 'primevue/button';
export default defineComponent({
	name: 'Flash Message',
	props: {
		messages: {
			type: Array,
			required: false,
			default: [],
		},
	},
	components: {
		Button,
	},

	setup(props) {
		const messagesList = ref(props.messages);

		const messageClose = (id: string) => {
			const index = messagesList.value.findIndex((el: any) => {
				if (el.id === id) return true;
				else return false;
			});
			messagesList.value.splice(index, 1);
		};
		return {
			messagesList,
			messageClose,
		};
	},
});
</script>

<style lang="sass" scoped>
.r-flash-message
	width: 100%
	padding: 2px 10px
	font-weight: 500
	font-size: 16px
	i
		font-size: 21px
.r-flash-message-warning
	background: #fff3cd
	color: #856404
.r-flash-message-success
	background: #d4edda
	color: #155724
.r-flash-message-error
	background: #f8d7da
	color: #721c24
</style>
