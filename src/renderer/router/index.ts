import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
	{
		path: '/',
		component: () => import('../views/Home.vue'),
		name: 'home',
	},
	{
		path: '/register',
		component: () => import('../views/Authorization/Register.vue'),
		name: 'register',
	},
	{
		path: '/login',
		component: () => import('../views/Authorization/Login.vue'),
		name: 'login',
	},
];

export const router = createRouter({
	history: createWebHashHistory('/'),
	routes,
});
