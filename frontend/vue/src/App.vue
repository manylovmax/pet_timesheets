<script setup lang="ts">
</script>

<template>
  <component :is="$route.meta.layout || 'div'">
    <router-view />
  </component>
</template>

<style scoped></style>
