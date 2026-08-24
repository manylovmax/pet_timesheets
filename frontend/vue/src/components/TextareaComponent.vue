<script setup lang="ts">
import {v4 as uuidv4} from 'uuid';

interface Props {
  label?: string
}
const props = defineProps<Props>();
const id = uuidv4();
const value = defineModel('value', { 
  type: String, 
  required: false, 
  default: '' 
});
</script>
<template>
  <div class="flex flex-col">
    <label
      class="pl-2" 
      :for="id">{{ props.label || '' }}</label>
    <textarea 
      class="bg-white rounded-2xl px-2"
      :id="id"
      v-model="value"
    ></textarea>
  </div>
</template>