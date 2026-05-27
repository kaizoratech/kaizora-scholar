import { createRouter, createWebHistory } from 'vue-router';
import Landing from '../components/views/Landing.vue';
import Login from '../components/views/Login.vue';
import Dashboard from '../components/views/Dashboard.vue';

const routes = [
    {
        path: '/',
        name: 'Landing',
        component: Landing
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { requiresGuest: true }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Guard routes based on local storage of synced email
router.beforeEach((to, from, next) => {
    const userEmail = localStorage.getItem('kaizora_user_email');
    
    if (to.meta.requiresAuth && !userEmail) {
        next({ name: 'Login' });
    } else if (to.meta.requiresGuest && userEmail) {
        next({ name: 'Dashboard' });
    } else {
        next();
    }
});

export default router;
