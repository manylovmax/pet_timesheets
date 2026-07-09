<script setup lang="ts">
</script>

<template>
<RouterView v-slot="{ Component }" :key="$route.fullPath">
  <template v-if="Component">
    <KeepAlive>
      <Suspense>
        <!-- main content -->
        <component :is="Component"></component>

        <!-- loading state -->
        <template #fallback>
          Loading...
        </template>
      </Suspense>
    </KeepAlive>
  </template>
</RouterView>
</template>

<style scoped></style>
