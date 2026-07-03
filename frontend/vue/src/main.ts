import { createApp } from 'vue';
import { createPinia } from 'pinia';
import AuthService from '@/services/auth.service';

import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.provide('AuthService', new AuthService());
app.mount('#app')
