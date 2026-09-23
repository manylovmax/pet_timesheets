<script setup lang="ts">
import type { DropdownItem } from '@/interfaces';
import { RecordsService, type TimesheetsRecord } from '@/services/records.service';
import TasksService from '@/services/tasks.service';
import { minutesToString } from '@/utils/time';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { LucideX } from '@lucide/vue';
import { cloneDeep } from 'lodash';

import DropdownComponent from './DropdownComponent.vue';
import TimeInput from './TimeInput.vue';
import TextareaComponent from './TextareaComponent.vue';


const router = useRouter();
const recordsService = new RecordsService();
const tasksService = new TasksService();

interface weekDay {
  title: string;
  date: number;
  month: number;
  year: number;
  dateObj: Date;
  index: number;
  records: TimesheetsRecord[];
  isToday: boolean;
  totalMinutes: number;
}

const globalWeekDays = ref<weekDay[]>([]);
const weekDaysPeriodString = ref<string>('');
const records = ref<TimesheetsRecord[]>([]);
const editingRecord = ref<TimesheetsRecord | undefined>(undefined);
const currentDate = new Date();
const taskOptions = ref<DropdownItem[]>([]);

const minutes = ref<number>(0);
const date = ref<string>('');
const comment = ref<string>('');
const selectedTask = ref<DropdownItem | undefined>();
const modalOpen = ref<boolean>(false);


initializeWeekdays(currentDate);
refreshRecords();
const tasks = await tasksService.getAll();
if (tasks.length) {
  taskOptions.value = tasks.map(t => ({id: t.id, title: t.title}));
}

function initializeWeekdays(startDay: Date) {
  const today = new Date();
  const weekDays: weekDay[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDay);
    const dayOfWeek = date.getDay();// starting from Sunday = 0, Saturday = 6
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    date.setDate(startDay.getDate() - daysToSubtract + i)// remove the daysToSubtract term to start from Sunday
    weekDays.push({
    title: date.toLocaleDateString('en-US', { weekday: 'long' }), 
    date: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    dateObj: date,
    index: i,
    records: [],
    isToday: today.toLocaleDateString('en-CA') == date.toLocaleDateString('en-CA'),
    totalMinutes: 0,
    });
  }
  globalWeekDays.value = weekDays;
  weekDaysPeriodString.value = 
      weekDays[0]?.dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) || ''
      + ' - ' +
      weekDays[weekDays.length - 1]?.dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) || '';
}

async function  refreshRecords(): Promise<void> {
  const weekDays = cloneDeep(globalWeekDays.value);
  for (let i = 0; i < weekDays.length; i++) {
    const weekDay = weekDays[i];
    if (weekDay) {
      weekDay.records = [];
      weekDay.totalMinutes = 0;
    }
  }
  const startDate = weekDays[0]?.dateObj.toLocaleDateString('en-CA');
  const endDate = weekDays[weekDays.length - 1]?.dateObj.toLocaleDateString('en-CA');
  if (startDate && endDate) {
    records.value = await recordsService.getRecordsForPeriod(startDate, endDate);
  }
  for (let i = 0; i < records.value.length; i++) {
    const record = records.value[i];
    const weekDay = weekDays.find(wd => wd.dateObj.toLocaleDateString('en-CA') == record!.date);
    if (weekDay && record) {
      weekDay.records.push(record);
      weekDay.totalMinutes += record.minutes;
    }
  }
  globalWeekDays.value = weekDays;
}

function onEdit(recordId: number) {
  editingRecord.value = records.value.find(r => r.id === recordId);
  if (editingRecord.value) {
    minutes.value = editingRecord.value?.minutes;
    date.value = String(editingRecord.value?.date);
    comment.value = editingRecord.value?.comment;
    selectedTask.value = taskOptions.value.find(to => to.id === editingRecord.value?.task_id);
    modalOpen.value = true;
  }
}

function closeModal() {
  modalOpen.value = false;
}

async function onSave() {
  if (!editingRecord.value)
    return;

  const result = await recordsService.updateRecord({
    task_id: editingRecord.value.task_id,
    record_id: editingRecord.value.id,
    minutes: minutes.value, 
    date: date.value,
    comment: comment.value,
  });
  if (result) {
    await refreshRecords();
    modalOpen.value = false;
  } else
    alert('Record update failure.');
}

async function onDelete() {
  const recordId = editingRecord.value?.id;
  if (recordId) {
    const result = await recordsService.deleteRecord(recordId);
    if (result) {
      await refreshRecords();
      modalOpen.value = false;
    }
  }
}

function goToCreate() {
  router.push('/record-create');
}

async function goToPreviousWeek() {
  currentDate.setDate(currentDate.getDate() - 7);
  initializeWeekdays(currentDate);
  await refreshRecords();
}

async function goToNextWeek() {
  currentDate.setDate(currentDate.getDate() + 7);
  initializeWeekdays(currentDate);
  await refreshRecords();
}

</script>
<template>
<div>
  <div class="hidden sm:flex  justify-between">
    <div>
      <div class="p-2 text-2xl">{{ weekDaysPeriodString }}</div>
    </div>
    <div class="flex flex-row-reverse pb-4 gap-4 items-end">
      <RouterLink 
        class="underline"
        to="/record-create">
        Add a record
      </RouterLink>
      <div 
        class="cursor-pointer select-none underline"
        @click="goToNextWeek()"  
      >Later</div>
      <div 
        class="cursor-pointer select-none underline"
        @click="goToPreviousWeek()"  
      >Earlier</div>
    </div>
  </div>
  <div class="sm:hidden">
    <div>
      <div class="p-2 text-2xl">{{ weekDaysPeriodString }}</div>
    </div>
    <div class="flex flex-row-reverse pb-4 gap-2">
      <div
        class="cursor-pointer p-2 underline select-none" 
        @click="goToCreate()"
      >Add a record</div>
      <div 
        class="cursor-pointer p-2 select-none underline"
        @click="goToNextWeek()"  
      >Later</div>
      <div 
        class="cursor-pointer p-2 select-none underline"
        @click="goToPreviousWeek()"  
      >Earlier</div>
    </div>
  </div>

  <div class="flex w-full overflow-x-auto">
    <div 
      v-for="weekDay in globalWeekDays" :key="weekDay.index"
      class="p-2 border-gray-200 min-h-[60vh] w-[225px] min-w-[225px]"
      :class="{
        'border-r-2': weekDay.index !== 6,
        'bg-gray-100': weekDay.isToday
      }"
    >
      <div class="flex justify-between gap-8 mb-2">
        <div class="flex gap-4">
          <div>{{ weekDay.title }}</div>
          <div>{{ weekDay.date }}</div>
        </div>
        <div>{{ minutesToString(weekDay.totalMinutes) }}</div>
      </div>

      <div class="flex flex-col gap-2">
        <div 
          v-for="record in weekDay.records" :key="record.id"
          class="p-2 rounded-xl cursor-pointer border-gray-200 border-2 bg-white"
          @click="onEdit(record.id)"  
        >
          <div>{{ record.task_title }}</div>
          <div>{{ minutesToString(record.minutes) }}</div>
          <div>{{ record.comment }}</div>
        </div>
      </div>
    </div>  
  </div>
</div>


<div class="flex items-center justify-center z-50 fixed inset-0"
  :class="[modalOpen ? 'block' : 'hidden']"
  @click="closeModal()"
>
  <div class="fixed inset-0 transition-opacity backdrop-blur-md"></div>
  <div 
    @click="$event.stopPropagation()"
    class="bg-gray-200 rounded-2xl p-4 flex flex-col gap-4 items-center z-10 relative w-[360px] sm:w-[400px]">
    <LucideX 
      class="cursor-pointer absolute top-2 right-2"
      @click="closeModal()"
    />
    <div>Update record</div>
    <DropdownComponent
      label="Task"
      :required="true"
      :options="taskOptions"
      v-model="selectedTask"
    />
    <TimeInput
      label="Spent time"
      v-model="minutes"
    />
    <TextareaComponent 
      label="Comment"
      v-model="comment"
    />
    <div class="flex gap-4 justify-between w-full">
      <div 
        class="underline cursor-pointer select-none"
        @click="onDelete()"
      >Delete</div>
      <div 
        class="underline cursor-pointer select-none"
        @click="onSave()"
      >Update</div>
    </div>
  </div>
</div>
</template>