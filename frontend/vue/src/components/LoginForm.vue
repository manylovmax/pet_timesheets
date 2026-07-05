<script setup lang="ts">
import { inject, ref } from 'vue'
import InputComponent from './InputComponent.vue';
import router from '@/router/index.ts';
import type AuthService from '@/services/auth.service.ts';

const authService: AuthService | undefined = inject('AuthService');

const email = ref('');
const password = ref('');

async function login() {
  if (authService !== undefined) {
    console.log('password, email', password.value, email.value);
    const result = await authService.login(password.value, email.value);
    if (result) {
      router.push('/records');
    } else {
      console.error('Ошибка логина');
    }
  } else {
    console.error('Ошибка инъектирования AuthService');
  }
}
</script>
<template>
  <div class="bg-gray-400 rounded-2xl py-16 px-4 flex flex-col gap-4">
    <div>Авторизация</div>
    <input-component 
      type="email"
      v-model:value="email"
    />
    <input-component 
      type="password" 
      v-model:value="password"
    />
    <button @click="login()">Login</button>
  </div>
</template>