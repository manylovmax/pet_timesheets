<script setup lang="ts">
import RecordsService from '@/services/records.service';

const recordsService = new RecordsService();
const records = await recordsService.getAllRecords();
console.log('records', records);
</script>
<template>
  <div class="flex justify-center">
  </div>
</template>