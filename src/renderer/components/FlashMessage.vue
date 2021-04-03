<template lang="pug">
div(
	v-for="message in messages" 
	:key="message" 
	class="r-flash-message p-d-flex p-ai-center p-jc-between"
	:class="{ 'r-flash-message-warning' : message.type == 'warning'}"
	)
	div(class="p-d-flex p-ai-center")
		i(class="pi" :class="{ 'pi-exclamation-triangle' : message.type == 'warning'}")
		p(class="p-ml-2") {{ message.text }}
	Button(v-if="message.command" @click="message.command.function" class="p-button-sm" :label="message.command.label" :class="{ 'p-button-warning' : message.type == 'warning'}")
</template>

<script lang="ts">
import { defineComponent } from 'vue';
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
});
</script>

<style lang="sass" scoped>
.r-flash-message
	width: 100%
	padding: 2px 10px
	i
		font-size: 21px
.r-flash-message-warning
	background: #fff3cd
	color: #856404
	font-weight: 500
	font-size: 16px
</style>
