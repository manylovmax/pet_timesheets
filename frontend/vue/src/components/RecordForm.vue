<script setup lang="ts">
import { type DropdownItem } from '@/interfaces.ts';
import InputComponent from './InputComponent.vue';
import TextareaComponent from './TextareaComponent.vue';
import DropdownComponent from './DropdownComponent.vue';
import TimeInput from './TimeInput.vue';

interface Props {
  type: 'create' | 'update',
  taskOptions: DropdownItem[],
};
const props = defineProps<Props>();

const dateModel = defineModel<string>('date');
const minutesModel = defineModel<number>('minutes');
const commentModel = defineModel<string>('comment');
const selectedTask = defineModel<DropdownItem | undefined>('task');

const emit = defineEmits(['submit']);
</script>
<template>
<div class="bg-gray-200 rounded-2xl p-4 flex flex-col gap-4 items-center w-[360px] sm:w-[400px]">
  <div>{{ props.type === 'create' ? 'Create' : 'Update' }} a record</div>

  <DropdownComponent
    label="Task"
    :required="true"
    :options="props.taskOptions"
    v-model="selectedTask"
  />
  <input-component 
    type="date"
    label="Date"
    v-model="dateModel"
  />

  <TimeInput
    label="Spent time"
    v-model="minutesModel"
  />

  <textarea-component 
    label="Comment"
    v-model="commentModel"
  />

  <div class="flex gap-4 justify-between w-full">
    <RouterLink 
      class="underline"
      to="/timetable">
      To timetable
    </RouterLink>
    <div 
      class="underline cursor-pointer select-none"
      @click="emit('submit')"
    >{{ props.type === 'create' ? 'Create' : 'Update' }}</div>
  </div>
</div>
</template>