<script setup lang="ts">
import type AuthService from '@/services/auth.service';
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
  <div class="sm:px-16 max-w-[1920px] w-full">
    <div class="hidden sm:flex justify-between py-2 w-full place-items-end gap-4">
      <div class="flex gap-4 place-items-end">
        <RouterLink 
          class="text-2xl"
          to="/timetable">
          Timesheets
        </RouterLink>
        <RouterLink 
          class="underline"
          to="/timetable">
          Timetable
        </RouterLink>
        <RouterLink 
          class="underline"
          to="/projects">
          Projects
        </RouterLink>
      </div>
      <div
        class="cursor-pointer underline select-none"
        @click="signout()">
        Sign out
      </div>
    </div>
    
    <div class="flex sm:hidden flex-col gap-4">
      <div class="flex gap-4 w-full place-items-end justify-between">
        <RouterLink 
          class="text-2xl"
          to="/timetable">
          Timesheets
        </RouterLink>
        <div
          class="cursor-pointer underline select-none"
          @click="signout()">
          Sign out
        </div>
      </div>
      <div class="flex gap-4">
        <RouterLink 
          class="underline"
          to="/timetable">
          Timetable
        </RouterLink>
        <RouterLink 
          class="underline"
          to="/projects">
          Projects
        </RouterLink>
      </div>
    </div>
  </div>
</div>
</template>