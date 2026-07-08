<script setup lang="ts">
import UnauthorizedLayout from '@/layouts/UnauthorizedLayout.vue';
import SigninForm from '@/components/SigninForm.vue';
</script>
<template>
  <unauthorized-layout>
    <div class="grid place-items-center h-screen">
      <signin-form />
    </div>
  </unauthorized-layout>
</template>