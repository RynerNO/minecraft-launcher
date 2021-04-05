import { State } from './store/index';
import { ComponentOptions } from 'vue';
declare module '*.vue' {
	const component: ComponentOptions;
	export default component;
}

declare module 'vuex' {
	export const state: State;
}

declare module '*.png' {
	const value: string;
	export default value;
}
