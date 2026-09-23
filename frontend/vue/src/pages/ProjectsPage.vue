<script setup lang="ts">
import TableComponent, { type TableColumn } from '@/components/TableComponent.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import ProjectsService, { type TimesheetsProject } from '@/services/projects.service';
import { minutesToString } from '@/utils/time';

const router = useRouter();
const projectsService = new ProjectsService();
const projects = ref<Array<TimesheetsProject>>([]);
const mappedProjects = ref<Record<string, string>[]>([]);

const columns: Array<TableColumn> = [
  {
    label: 'Title',
    attribute: 'title',
  },
  {
    label: 'Code',
    attribute: 'code',
  },
  {
    label: 'Description',
    attribute: 'description',
  },
  {
    label: 'Spent time',
    attribute: 'total_minutes',
  },
];

projects.value = await projectsService.getAll();
mappedProjects.value = projects.value.map(p => ({
  'id': `${p.id}`,
  'user_id': `${p.user_id}`,
  'title': p.title,
  'code': p.code,
  'description': p.description,
  'total_minutes': minutesToString(p.total_minutes || 0),
}));

async function deleteProject(index: number) {
  const id = projects.value[index]?.id;
  if (id) {
    const result = await projectsService.delete(id);
    if (result) {
      projects.value = await projectsService.getAll();
      mappedProjects.value = projects.value.map(p => ({
        'id': `${p.id}`,
        'user_id': `${p.user_id}`,
        'title': p.title,
        'code': p.code,
        'description': p.description,
        'total_minutes': minutesToString(p.total_minutes || 0),
      }));
    }
  }
}

function goToUpdatePage(index: number) {
  const id = projects.value[index]?.id;
  router.push('/project/' + id + '/update');
}

function goToProjectPage(index: number) {
  const id = projects.value[index]?.id;
  router.push('/project/' + id);
}

</script>
<template>
  <main-layout>
    <div class="flex flex-col gap-8">
      <div class="flex place-items-end gap-4">
        <div class="text-2xl">Projects</div>
        <RouterLink 
        class="underline"
        to="/project/create">Create</RouterLink>
      </div>
      <table-component 
        :columns="columns"
        openObjectPageColumnAttribute="title"
        :rows="mappedProjects"
        :delete-button="true"
        :update-button="true"
        @update="goToUpdatePage"
        @delete="deleteProject"
        @open="goToProjectPage"
      />
    </div>
  </main-layout>
</template>