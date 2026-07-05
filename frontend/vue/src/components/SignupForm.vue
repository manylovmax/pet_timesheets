<script setup lang="ts">
import { inject, ref } from 'vue'
import InputComponent from './InputComponent.vue';
import router from '@/router/index.ts';
import type AuthService from '@/services/auth.service.ts';

const authService: AuthService | undefined = inject('AuthService');

const email = ref('');
const fullname = ref('');
const password = ref('');
const passwordRepeat = ref('');

async function signup() {
  if (authService !== undefined) {
    const result = await authService.signup({
      email: email.value,
      password: password.value,
      fullname: fullname.value, 
    });
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
      label="Email"
      type="email"
      v-model:value="email"
    />
    <input-component 
      label="Fullname"
      type="text"
      v-model:value="fullname"
    />
    <input-component 
      label="Password"
      type="password" 
      v-model:value="password"
    />
    <input-component 
      label="Password repeat"
      type="password" 
      v-model:value="passwordRepeat"
    />
    <button 
      class="bg-green-300 rounded-2xl px-2 uppercase"
      @click="signup()"
    >submit</button>
    <RouterLink 
      class="underline"
      to="/signin">
      Signin
    </RouterLink>
  </div>
</template>