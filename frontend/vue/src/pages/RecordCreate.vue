<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import RecordForm from '@/components/RecordForm.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import RecordsService from '@/services/records.service';
import type { DropdownItem } from '@/interfaces';
import TasksService from '@/services/tasks.service';

const router = useRouter();
const recordsService = new RecordsService();
const tasksService = new TasksService();

const minutes = ref(1);
const date = ref();
const comment = ref('');
const selectedTask = ref<DropdownItem | undefined>();
const taskOptions = ref<DropdownItem[]>([]);
const tasks = await tasksService.getAll();
if (tasks.length) {
  taskOptions.value = tasks.map(t => ({id: t.id, title: t.title}));
}

async function post() {
  const task_id = selectedTask.value?.id;
  if (task_id) {
    const result = await recordsService.createRecord({
      task_id: task_id,
      minutes: minutes.value, 
      date: date.value, 
      comment: comment.value
    });
    if (result)
      router.push('/timetable');
    else
      alert('Record creation failure.');
    }
}
</script>
<template>
  <main-layout>
    <div class="grid place-items-center h-screen">
      <record-form
        type="create"
        :taskOptions="taskOptions"
        v-model:task="selectedTask"
        v-model:date="date"
        v-model:minutes="minutes"
        v-model:comment="comment"
        @submit="post()"
        />
    </div>
  </main-layout>
</template>