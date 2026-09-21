<script setup lang="ts">
import {v4 as uuidv4} from 'uuid';
import { ref } from 'vue';

interface Props {
  label?: string
}
const {label = ''} = defineProps<Props>();
const isValid = ref<boolean>(false);
const errorMessage = 'Input time in format "Xh Ym", where X and Y are integers, and first or second group is optional.';
const id = uuidv4();
const inputText = ref<string>('');
const model = defineModel<number>({default: 0});
const regex = /^(?:\d+h(?: \d+m)?|\d+m)$/;

function onInput(event: InputEvent) {
  event.stopPropagation(); 
  const element = event.target as HTMLInputElement;
  const newValue = String(element.value);
  inputText.value = newValue;
  isValid.value = Boolean(newValue.match(regex));
  if (isValid.value)
    model.value = parse(newValue);
}

function parse(str: string): number {
  const hoursMatch = str.match(/(\d+)h/);
  const minutesMatch = str.match(/(\d+)m/);

  const hours = hoursMatch  && hoursMatch[1] ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch && minutesMatch[1] ? parseInt(minutesMatch[1], 10) : 0;

  return (hours * 60) + minutes;
}

</script>
<template>
<div class="flex flex-col">
  <label
    class="pl-2" 
    :for="id">{{ label }}</label>
  <input 
    class="bg-white rounded-2xl px-2 mb-1"
    :id="id"
    type="text"
    spellcheck="false"
    :value="inputText"
    @input="onInput($event)"
  >
  <div v-if="!isValid" class="text-red-400 px-2">{{ errorMessage }}</div>
</div>
</template>