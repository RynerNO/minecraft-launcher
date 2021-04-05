<template lang="pug">
div
  canvas(ref="skinCanvas")
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { SkinViewer, createOrbitControls } from 'skinview3d';

import { useStore } from 'vuex';

import Button from 'primevue/button';
export default defineComponent({
	name: 'SkinViewer',
	props: {
		skin: {
			type: String,
			required: false,
		},
	},
	components: {
		Button,
	},
	setup(props) {
		const skinCanvas = ref();
		const store = useStore();
		onMounted(() => {
			let skinViewer = new SkinViewer({
				canvas: skinCanvas.value,
				width: 300,
				height: 400,
				skin: props.skin,
			});
			let control = createOrbitControls(skinViewer);
			control.enableRotate = true;
			control.enableZoom = false;
			control.enablePan = false;
		});
		return {
			skinCanvas,
		};
	},
});
</script>

<style lang="sass" scoped>
</style>
