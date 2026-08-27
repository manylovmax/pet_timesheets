<script setup lang="ts">
import HeaderMenu from '@/components/HeaderMenu.vue';


</script>
<template>
  <header-menu />
    <div class="flex justify-center">
      <div class="justify-between py-2 sm:px-16 max-w-[1920px] w-full">
      <main>
        <slot></slot>
      </main>
    </div>
  </div>
</template>