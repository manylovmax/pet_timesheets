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
    const result = await authService.signin(password.value, email.value);
    if (result) {
      router.push('/records');
    }
  } else {
    console.error('AuthService injecting error');
  }
}
</script>
<template>
  <div class="bg-gray-200 rounded-2xl p-4 flex flex-col gap-4 items-center">
    <div>Sign in</div>
    <input-component 
      type="email"
      label="Email"
      v-model:value="email"
    />
    <input-component 
      label="Password"
      type="password" 
      v-model:value="password"
    />
    <button 
      class="bg-green-300 rounded-2xl px-2 uppercase"
      @click="login()"
    >submit</button>
    <RouterLink 
      class="underline"
      to="/signup">
      Signup
    </RouterLink>
  </div>
</template>