<script setup lang="ts">
import axios, {AxiosError} from 'axios';
import { ref } from 'vue'
import InputComponent from './InputComponent.vue';
import config from '@/constants.ts';
import router from '@/router/index.ts';

const email = ref();
const password = ref();
async function login() {
  await axios.post(config.api.login, {
    email: email.value,
    password: password.value,
  })
    .catch((error: AxiosError) => {
      console.log('Ошибка логина ' + error.message)
    })
    .then(() => {
      router.push('/records')
    });
}
</script>
<template>
  <div class="bg-gray-400 rounded-2xl py-16 px-4 flex flex-col gap-4">
    <div>Авторизация</div>
    <input-component 
      type="email"
      v-model="email"
    />
    <input-component 
      type="password" 
      v-model="password"
    />
    <button @click="login()">Login</button>
  </div>
</template>