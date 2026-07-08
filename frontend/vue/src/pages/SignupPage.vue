<script setup lang="ts">
import UnauthorizedLayout from '@/layouts/UnauthorizedLayout.vue';
import SignupForm from '@/components/SignupForm.vue';
</script>
<template>
  <unauthorized-layout>
    <div class="grid place-items-center h-screen">
      <signup-form />
    </div>
  </unauthorized-layout>
</template>