import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    // {
    //     path: '/tx/:hash',
    //     name: 'Tx',
    //     component: () => import('../views/Tx.vue'),
    // },
    {
        path: '/',
        name: 'Main',
        component: () => import('../views/Main.vue'),
    },
    {
        path: '/:catchAll(.*)',
        component: () => import('../views/NotFound.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
