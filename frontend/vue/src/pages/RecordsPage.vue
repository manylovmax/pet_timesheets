<script setup lang="ts">
import TableComponent, { type TableColumn } from '@/components/TableComponent.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import RecordsService from '@/services/records.service';
import { useRouter } from 'vue-router';

const router = useRouter();
const recordsService = new RecordsService();

function goToCreate() {
  router.push('/record-create');
}

const columns: Array<TableColumn> = [
  {
    label: 'ID',
    attribute: 'id',
  },
  {
    label: 'Date',
    attribute: 'date',
  },
  {
    label: 'Minutes',
    attribute: 'minutes',
  },
];
const records = (await recordsService.getAllRecords()).map(r => ({
  'id': `${r.id}`,
  'user_id': `${r.user_id}`,
  'date': r.date,
  'minutes': `${r.minutes}`,
}));

async function deleteRecord(index: number) {
  const recordId = records[index]?.id;
  console.log('delete record', recordId)
}

function goToUpdatePage(index: number) {
  const recordId = records[index]?.id;
  router.push('/record-update/' + recordId);
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
      <table-component 
        :columns="columns"
        :rows="records"
        :delete-button="true"
        :update-button="true"
        @update="goToUpdatePage"
        @delete="deleteRecord"
      />
    </div>
  </main-layout>
</template>