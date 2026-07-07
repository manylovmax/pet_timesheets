<script setup lang="ts">
import type AuthService from '@/services/auth.service';
import { LogOut } from '@lucide/vue';
import { inject } from 'vue';
import router from '@/router/index.ts';

const authService: AuthService | undefined = inject('AuthService');

async function signout() {
  if (authService === undefined) {
    console.error('Error injecting AuthService');
  } else {
    const result = await authService.signout();
    if (result)
      router.push('/signin');
  }
}
</script>
<template>
  <div class="flex justify-between w-full px-16 py-2">
    <div class="text-2xl">Timesheets</div>
    <div
      class="cursor-pointer"
      @click="signout()">
      <LogOut :size="32" :stroke-width="1" />
    </div>
  </div>
</template>