<template lang="pug">
router-view 
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
export default defineComponent({
	name: 'App',
	setup() {
		const store = useStore();
		const router = useRouter();
		onMounted(() => {
			store
				.dispatch('verify', { accessToken: store.state.auth.accessToken })
				.then(() => {
					router.push('/');
				})
				.catch((e: any) => {
					router.push('login');
				});
		});
	},
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
	max-width: 450px
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
	max-width: 450px
	width: 100%
	font-size: 13px
a
	color: #4EC5F1

@font-face
	font-family: 'Montserrat'
	font-style: normal
	font-weight: 300
	font-display: swap
	src: url(./assets/fonts/Montserrat-Light.ttf) format('truetype')

@font-face
	font-family: 'Montserrat'
	font-style: normal
	font-weight: 300
	font-display: swap
	src: url(./assets/fonts/Montserrat-Light.ttf) format('truetype')
	unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116

@font-face
	font-family: 'Montserrat'
	font-style: normal
	font-weight: 300
	font-display: swap
	src: url(./assets/fonts/Montserrat-Light.ttf) format('truetype')
	unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB

@font-face
	font-family: 'Montserrat'
	font-style: normal
	font-weight: 300
	font-display: swap
	src: url(./assets/fonts/Montserrat-Light.ttf) format('truetype')
	unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF

@font-face
	font-family: 'Montserrat'
	font-style: normal
	font-weight: 300
	font-display: swap
	src: url(./assets/fonts/Montserrat-Light.ttf) format('truetype')
	unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD

@font-face
	font-family: 'Montserrat'
	font-style: normal
	font-weight: 400
	font-display: swap
	src: url(./assets/fonts/Montserrat-Regular.ttf) format('truetype')
	unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F

@font-face
	font-family: 'Montserrat'
	font-style: normal
	font-weight: 400
	font-display: swap
	src: url(./assets/fonts/Montserrat-Regular.ttf) format('truetype')
	unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116

@font-face
	font-family: 'Montserrat'
	font-style: normal
	font-weight: 400
	font-display: swap
	src: url(./assets/fonts/Montserrat-Regular.ttf) format('truetype')
	unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB

@font-face
	font-family: 'Montserrat'
	font-style: normal
	font-weight: 400
	font-display: swap
	src: url(./assets/fonts/Montserrat-Regular.ttf) format('truetype')
	unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF

@font-face
	font-family: 'Montserrat'
	font-style: normal
	font-weight: 400
	font-display: swap
	src: url(./assets/fonts/Montserrat-Regular.ttf) format('truetype')
	unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD

@font-face
	font-family: 'Montserrat'
	font-style: normal
	font-weight: 700
	font-display: swap
	src: url(./assets/fonts/Montserrat-Bold.ttf) format('truetype')
	unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F

@font-face
	font-family: 'Montserrat'
	font-style: normal
	font-weight: 700
	font-display: swap
	src: url(./assets/fonts/Montserrat-Bold.ttf) format('truetype')
	unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116

@font-face
	font-family: 'Montserrat'
	font-style: normal
	font-weight: 700
	font-display: swap
	src: url(./assets/fonts/Montserrat-Bold.ttf) format('truetype')
	unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB

@font-face
	font-family: 'Montserrat'
	font-style: normal
	font-weight: 700
	font-display: swap
	src: url(./assets/fonts/Montserrat-Bold.ttf) format('truetype')
	unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF

@font-face
	font-family: 'Montserrat'
	font-style: normal
	font-weight: 700
	font-display: swap
	src: url(./assets/fonts/Montserrat-Bold.ttf) format('truetype')
	unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD
</style>
