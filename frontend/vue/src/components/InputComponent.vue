<script setup lang="ts">
import {v4 as uuidv4} from 'uuid';

interface Props {
  type: 'text' | 'password' | 'email'
  label?: string
}
const props = defineProps<Props>();
const id = uuidv4();
const value = defineModel('value');
</script>
<template>
  <div>
    <label :for="id">{{ props.label || '' }}</label>
    <input 
      :id="id"
      :type="props.type"
      v-model="value"
    >
  </div>
</template>