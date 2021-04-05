<template lang="pug">
div
  canvas(ref="skinCanvas")
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { SkinViewer, createOrbitControls } from 'skinview3d';

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
		onMounted(() => {
			let skinViewer = new SkinViewer({
				canvas: skinCanvas.value,
				width: 200,
				height: 200,
				skin: props.skin,
			});
			let control = createOrbitControls(skinViewer);
			control.enableRotate = true;
			control.enableZoom = true;
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
