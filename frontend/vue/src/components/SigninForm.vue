<script setup lang="ts">
import { inject, ref, watch } from 'vue'
import InputComponent from './InputComponent.vue';
import type AuthService from '@/services/auth.service.ts';
import { useRouter } from 'vue-router';

const router = useRouter();
const authService: AuthService | undefined = inject('AuthService');

const email = ref('');
const password = ref('');
const emailErrors = ref<string[]>([]);
const passwordErrors = ref<string[]>([]);
const isValid = ref<boolean>(false);

watch(email, () => {
  const errors = [];
  if (!email.value)
    errors.push('This field is required');

  emailErrors.value = errors;
}, { immediate: true });

watch(password, () => {
  const errors = [];
  if (!password.value)
    errors.push('This field is required');

  passwordErrors.value = errors;
}, { immediate: true });

watch([emailErrors, passwordErrors], () => {
  isValid.value = !Boolean(emailErrors.value.length || passwordErrors.value.length);
}, { immediate: true });

async function login() {
  if (authService !== undefined) {
    if (!isValid.value)
      return;
    
      const result = await authService.signin(password.value, email.value);
    if (result) {
      router.push('/');
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
      v-model="email"
      :errors="emailErrors"
    />
    <input-component 
      label="Password"
      type="password" 
      v-model="password"
      :errors="passwordErrors"
    />

    <div class="flex gap-4 justify-between w-full">
      <RouterLink 
        class="underline select-none cursor-pointer"
        to="/signup">
        Sign up
      </RouterLink>
      <div 
        class="select-none"
        :class="{
          'underline': isValid,
          'cursor-pointer': isValid,
        }"
        @click="login()"
      >Submit</div>
    </div>
  </div>
</template>