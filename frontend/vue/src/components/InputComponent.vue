<script setup lang="ts">
import {v4 as uuidv4} from 'uuid';

interface Props {
  type: 'text' | 'password' | 'email' | 'number' | 'date',
  label?: string
}
const props = defineProps<Props>();
const id = uuidv4();
const value = defineModel('value');
</script>
<template>
  <div class="flex flex-col">
    <label
      class="pl-2" 
      :for="id">{{ props.label || '' }}</label>
    <input 
      class="bg-white rounded-2xl px-2"
      :id="id"
      :type="props.type"
      v-model="value"
    >
  </div>
</template>