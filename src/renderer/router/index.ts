import {createRouter, createMemoryHistory } from 'vue-router';
import Home from "../views/Home.vue";

const routes = [
    {
        path: '/',
        component: Home,
        name: 'home'
    },
    {
        path: '/register',
        component: import("../views/Authorization/Register.vue"),
        name: 'register'
    },
    {
        path: '/login',
        component: import("../views/Authorization/Login.vue"),
        name: 'login'
    }
];

export const router = createRouter({
    history: createMemoryHistory('/'),
    routes
});
