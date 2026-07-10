<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import RecordForm from '@/components/RecordForm.vue';
import { ref } from 'vue';
import RecordsService from '@/services/records.service';
import { useRouter, useRoute } from 'vue-router';

const recordsService = new RecordsService();
const router = useRouter();
const route = useRoute();

const minutes = ref<number>(1);
const date = ref<string>('');

const record = await recordsService.getRecord(Number(String(route.params.id)));
if (!record)
  router.push('/records');
else {
  minutes.value = record.minutes;
  date.value = record.date;
}


async function post() {
  const result = await recordsService.updateRecord({recordId: Number(String(route.params.id)), minutes: minutes.value, date: date.value});
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
        type="update"
        v-model:date="date"
        v-model:minutes="minutes"
        @submit="post()"
        />
    </div>
  </main-layout>
</template>