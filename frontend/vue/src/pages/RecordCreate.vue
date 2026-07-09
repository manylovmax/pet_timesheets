<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import RecordForm from '@/components/RecordForm.vue';
import { ref } from 'vue';
import RecordsService from '@/services/records.service';
const minutes = ref(1);
const date = ref();
const recordsService = new RecordsService();
import { useRouter } from 'vue-router';

const router = useRouter();

async function post() {
  const result = await recordsService.createRecord({minutes: minutes.value, date: date.value});
  if (result)
    router.push('/records');
  else
    alert('Record creation failure.');
}
</script>
<template>
  <main-layout>
    <div class="grid place-items-center h-screen">
      <record-form
        type="create"
        v-model:date="date"
        v-model:minutes="minutes"
        @submit="post()"
        />
    </div>
  </main-layout>
</template>