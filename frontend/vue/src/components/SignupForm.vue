<script setup lang="ts">
import { inject, ref, watch } from 'vue'
import InputComponent from './InputComponent.vue';
import type AuthService from '@/services/auth.service.ts';
import { useRouter } from 'vue-router';

const router = useRouter();
const authService: AuthService | undefined = inject('AuthService');

const email = ref('');
const fullname = ref('');
const password = ref('');
const passwordRepeat = ref('');
const emailErrors = ref<string[]>([]);
const fullnameErrors = ref<string[]>([]);
const passwordErrors = ref<string[]>([]);
const passwordRepeatErrors = ref<string[]>([]);
const isValid = ref<boolean>(false);

watch(email, () => {
  const errors = [];
  if (!email.value)
    errors.push('This field is required');

  emailErrors.value = errors;
}, { immediate: true });

watch(fullname, () => {
  const errors = [];
  if (!fullname.value)
    errors.push('This field is required');

  fullnameErrors.value = errors;
}, { immediate: true });

watch(password, () => {
  const errors = [];
  if (!password.value)
    errors.push('This field is required');

  passwordErrors.value = errors;
}, { immediate: true });

watch(passwordRepeat, () => {
  const errors = [];
  if (!passwordRepeat.value)
    errors.push('This field is required');

  if (passwordRepeat.value !== password.value)
    errors.push('Passwords don\'t match')

  passwordRepeatErrors.value = errors;
}, { immediate: true });

watch([emailErrors, passwordErrors], () => {
  isValid.value = !Boolean(
    emailErrors.value.length || 
    passwordErrors.value.length || 
    passwordRepeatErrors.value.length || 
    fullnameErrors.value.length
  );
}, { immediate: true });

async function signup() {
  if (authService !== undefined) {
    if (!isValid.value)
      return;
    
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
    <div>Sign up</div>
    <input-component
      label="Email"
      type="email"
      v-model="email"
      :errors="emailErrors"
    />
    <input-component 
      label="Fullname"
      type="text"
      v-model="fullname"
      :errors="fullnameErrors"
    />
    <input-component 
      label="Password"
      type="password" 
      v-model="password"
      :errors="passwordErrors"
    />
    <input-component 
      label="Password repeat"
      type="password" 
      v-model="passwordRepeat"
      :errors="passwordRepeatErrors"
    />

    <div class="flex gap-4 justify-between w-full">
      <RouterLink 
        class="underline select-none cursor-pointer"
        to="/signin">
        Sign in
      </RouterLink>
      <div 
        class="select-none"
        :class="{
          'underline': isValid,
          'cursor-pointer': isValid,
        }"
        @click="signup()"
      >Submit</div>
    </div>

  </div>
</template>