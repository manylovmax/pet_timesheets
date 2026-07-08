<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
// import RecordsService from '@/services/records.service';
import { useRouter } from 'vue-router';

const router = useRouter();
// const recordsService = new RecordsService();
// const records = await recordsService.getAllRecords();
function goToCreate() {
  router.push('/record-create');
}
</script>
<template>
  <main-layout>
    <div class="flex flex-col">
      <div class="flex">
        <div class="uppercase cursor-pointer p-2 bg-gray-100 rounded-2xl"
          @click="goToCreate()"
        >Create</div>
      </div>
    </div>
  </main-layout>
</template>