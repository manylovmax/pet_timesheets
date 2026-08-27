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
  <div class="flex justify-center">
    <div class="flex justify-between py-2 sm:px-16 max-w-[1920px] w-full">
      <div class="text-2xl">Timesheets</div>
      <div
        class="cursor-pointer"
        @click="signout()">
        <LogOut :size="32" :stroke-width="1" />
      </div>
    </div>
  </div>
</template>