<script setup lang="ts">
import type { DropdownItem } from '@/interfaces';
import { ref, watchEffect } from 'vue';


interface Props {
  label?: string,
  options: DropdownItem[],
  required?: boolean,
}

const { label = '', required = true, options } = defineProps<Props>();
const model = defineModel<DropdownItem | null>({ default: null });
const visibleOptions = ref<DropdownItem[]>([]);
const listVisible = ref<boolean>(false);
const innerHTML = ref<string>('');

// watch();

watchEffect(() => {
  const selected = options.find(o => o.id === model.value?.id);
  if (selected) {
    innerHTML.value = '<div class="rounded bg-gray-200 px-1 w-fit">' + selected.title + '</div>';
    listVisible.value = false;
  } else {
    innerHTML.value = '';
  }
});


function onInput(event: InputEvent) {
  event.stopPropagation(); 
  const element = event.target as HTMLDivElement;
  let newValue = String(element.innerText);
  if (model.value) {
    model.value = null;
    innerHTML.value = '';
    newValue = '';
  }
  const cleanString = newValue.replace(/[\r\n]/g, "");
  if (cleanString.length)
    visibleOptions.value = options.filter(o => o.title.includes(cleanString));
  else
    visibleOptions.value = options;

  listVisible.value = true;
}

function onBlur() {
  listVisible.value = false;
}

function onFocus() {
  if (!model.value)
    listVisible.value = true;
}

function onSelect(id: string) {
  const selected = options.find(o => o.id === id);
  if (selected) {
    model.value = selected;
  }
  listVisible.value = false;
}

</script>
<template>
<div class="flex flex-col relative w-full">
  <label
    v-if="label"
    class="pl-2" 
  >{{ label }}</label>
  <div class="relative w-full">
    <div 
      contenteditable="true" 
      class="bg-white rounded-2xl px-2 mb-1 w-full h-6 min-w-[247px]"
      @input="onInput($event)"
      @focusin="onFocus()"
      @blur="onBlur()"
      :innerHTML="innerHTML"
      @keydown.enter="$event.preventDefault()"
    ></div>
    <div 
      v-if="required && !model"
      class="text-red-400 px-2">This field is required</div>

    <div class="absolute z-10 flex-col bg-white rounded top-6 left-0 w-full"
      :class="{
        'hidden': !listVisible,
        'flex': listVisible 
      }"
    >
      <div 
        v-for="option in visibleOptions" :key="option.id"
        class="hover:bg-gray-100 px-2 cursor-pointer"
        @mousedown="onSelect(option.id)">{{ option.title }}</div>
    </div>
  </div>
</div>
</template>