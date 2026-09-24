<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import RecordsService from '@/services/records.service';
import TasksService from '@/services/tasks.service';
import { type DropdownItem } from '@/interfaces.ts';
import DropdownComponent from '@/components/DropdownComponent.vue';
import InputComponent from '@/components/InputComponent.vue';
import TextareaComponent from '@/components/TextareaComponent.vue';
import { parseTime, validateTimeString } from '@/utils/time';

const router = useRouter();
const recordsService = new RecordsService();
const tasksService = new TasksService();

const time = ref('');
const date = ref();
const comment = ref('');
const selectedTask = ref<DropdownItem | undefined>();
const taskOptions = ref<DropdownItem[]>([]);
const tasks = await tasksService.getAll();
if (tasks.length) {
  taskOptions.value = tasks.map(t => ({id: t.id, title: t.title}));
}


const dateErrors = ref<string[]>([]);
const timeErrors = ref<string[]>([]);
const taskErrors = ref<string[]>([]);
const isValid = ref<boolean>(false);

watch(date, () => {
  if (!date.value)
    dateErrors.value = ['This field is required'];
  else
    dateErrors.value = [];
}, { immediate: true });

watch(time, () => {
  const errors = [];

  if (!time.value)
    errors.push('This field is required');
  
  if (!validateTimeString(time.value))
    errors.push('Input time in format "Xh Ym", where X and Y are integers, and first or second group is optional.');

  timeErrors.value = errors;
}, { immediate: true });

watch(selectedTask, () => {
  if (!selectedTask.value)
    taskErrors.value = ['This field is required'];
  else
    taskErrors.value = [];
}, { immediate: true });

watch([dateErrors, timeErrors, taskErrors], () => {
  isValid.value = !Boolean(dateErrors.value.length || timeErrors.value.length || taskErrors.value.length);
}, { immediate: true });


async function post() {
  if (!isValid.value)
    return;

  const task_id = selectedTask.value?.id;
  if (task_id) {
    const result = await recordsService.createRecord({
      task_id: task_id,
      minutes: parseTime(time.value), 
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
      <div class="bg-gray-200 rounded-2xl p-4 flex flex-col gap-4 items-center w-[360px] sm:w-[400px]">
        <div>Create a record</div>

        <DropdownComponent
          label="Task"
          :required="true"
          :options="taskOptions"
          v-model="selectedTask"
          :errors="taskErrors"
        />

        <InputComponent
          type="date"
          label="Date"
          v-model="date"
          :errors="dateErrors"
        />

        <InputComponent
          type="text"
          label="Spent time"
          v-model="time"
          :errors="timeErrors"
          :spellcheck="false"
        />

        <TextareaComponent
          label="Comment"
          v-model="comment"
        />

        <div class="flex gap-4 justify-between w-full">
          <RouterLink 
            class="underline"
            to="/timetable">
            To timetable
          </RouterLink>
          <div 
            class="select-none"
            :class="{
              'underline': isValid,
              'cursor-pointer': isValid,
            }"
            @click="post"
          >Create</div>
        </div>
      </div>
    </div>
  </main-layout>
</template>