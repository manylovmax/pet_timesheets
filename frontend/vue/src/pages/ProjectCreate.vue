<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import ProjectsService from '@/services/projects.service';
import InputComponent from '@/components/InputComponent.vue';
import TextareaComponent from '@/components/TextareaComponent.vue';

const router = useRouter();

const projectsService = new ProjectsService();

const title = ref('');
const code = ref('');
const description = ref('');

const titleErrors = ref<string[]>([]);
const codeErrors = ref<string[]>([]);
const isValid = ref<boolean>(false);

watch(title, () => {
  if (!title.value)
    titleErrors.value = ['This field is required'];
  else
    titleErrors.value = [];
}, { immediate: true });

watch(code, () => {
  if (!code.value)
    codeErrors.value = ['This field is required'];
  else
    codeErrors.value = [];
}, { immediate: true });

watch([titleErrors, codeErrors], () => {
  isValid.value = !Boolean(titleErrors.value.length || codeErrors.value.length);
}, { immediate: true });

async function onSave() {
  if (!isValid.value)
    return;
  
    const result = await projectsService.create({
    title: title.value,
    code: code.value,
    description: description.value,
  });
  if (result)
    router.push('/projects');
}
</script>
<template>
  <main-layout>
    <div class="grid place-items-center h-screen">
      <div 
        class="bg-gray-200 rounded-2xl p-4 flex flex-col gap-4 items-center z-10 relative w-[360px] sm:w-[400px]">

        <div>Create project</div>
        
        <InputComponent 
          type="text"
          label="Title"
          v-model="title"
          :errors="titleErrors"
        />

        <InputComponent 
          type="text"
          label="Code"
          v-model="code"
          :errors="codeErrors"
        />

        <textarea-component 
          label="Description"
          v-model="description"
        />

        <div class="flex gap-4 justify-between w-full">
          <RouterLink 
            class="underline cursor-pointer select-none"
            to="/projects">
            Go to projects
          </RouterLink>
          <div 
            class="select-none"
            :class="{
              'underline': isValid,
              'cursor-pointer': isValid,
            }"
            @click="onSave()"
          >
            Create
          </div>
        </div>

      </div>

    </div>
  </main-layout>
</template>