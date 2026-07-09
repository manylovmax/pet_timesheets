<script setup lang="ts">
import InputComponent from './InputComponent.vue';

interface Props {
  type: 'create' | 'update',
};
const props = defineProps<Props>();

const dateModel = defineModel('date');
const minutesModel = defineModel('minutes');
const emit = defineEmits(['submit']);
</script>
<template>
  <div class="bg-gray-200 rounded-2xl p-4 flex flex-col gap-4 items-center">
    <div>{{ props.type === 'create' ? 'Create' : 'Update' }} record</div>
    <input-component 
      type="date"
      label="Date"
      v-model:value="dateModel"
    />
    <input-component 
      type="number"
      label="Minutes"
      v-model:value="minutesModel"
    />
    <button 
      class="bg-green-300 rounded-2xl px-2 uppercase cursor-pointer"
      @click="emit('submit')"
    >submit</button>
    <RouterLink 
      class="underline"
      to="/records">
      To records
    </RouterLink>
  </div>
</template>