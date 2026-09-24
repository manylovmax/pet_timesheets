<script setup lang="ts">
import {v4 as uuidv4} from 'uuid';

interface Props {
  type: 'text' | 'password' | 'email' | 'number' | 'date',
  label?: string,
  errors?: string[],
  spellcheck?: boolean,
}
const props = defineProps<Props>();
const id = uuidv4();
const value = defineModel();
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
      :spellcheck="spellcheck"
    >
    <div v-if="errors && errors.length"
      class="flex flex-col gap-4" >
      <div 
        v-for="(error, i) in errors"
        :key="i"
        class="text-red-400 px-2">{{ error }}</div>
    </div>
  </div>
</template>