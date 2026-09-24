<script setup lang="ts">
import TableComponent, { type TableColumn } from '@/components/TableComponent.vue';
import MainLayout from '@/layouts/MainLayout.vue';
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import ProjectsService from '@/services/projects.service';
import { minutesToString } from '@/utils/time';
import  TasksService, { type TimesheetsTask } from '@/services/tasks.service';

const router = useRouter();
const route = useRoute();
const projectId = Number(route.params.id);
const projectsService = new ProjectsService();
const project = await projectsService.get(projectId);
const title = ref(project?.title || '');
const code = ref(project?.code || '');
const description = ref(project?.description || '');
const tasksService = new TasksService();
const tasks = ref<Array<TimesheetsTask>>([]);
const mappedTasks = ref<Record<string, string>[]>([]);

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

tasks.value = await tasksService.getAllForProject(projectId);
mappedTasks.value = tasks.value.map(t => ({
  'id': `${t.id}`,
  'user_id': `${t.user_id}`,
  'title': t.title,
  'code': t.code,
  'description': t.description,
  'total_minutes': minutesToString(t.total_minutes || 0),
}));

async function deleteTask(index: number) {
  const id = tasks.value[index]?.id;
  if (id) {
    const result = await tasksService.delete(id);
    if (result) {
      tasks.value = await tasksService.getAllForProject(projectId);
      mappedTasks.value = tasks.value.map(t => ({
        'id': `${t.id}`,
        'user_id': `${t.user_id}`,
        'title': t.title,
        'code': t.code,
        'description': t.description,
        'total_minutes': minutesToString(t.total_minutes || 0),
      }));
    }
  }
}

function goToUpdatePage(index: number) {
  const id = tasks.value[index]?.id;
  router.push('/task/' + id + '/update');
}

</script>
<template>
  <main-layout>
    <div class="flex flex-col gap-8">
      <div class="flex place-items-end gap-4">
        <div class="text-2xl">Project</div>
        <div class="flex place-items-end gap-4">
          <div class="text-2xl">{{ title }}</div>
          <div>({{ code }})</div>
        </div>
      </div>
      <div >{{ description }}</div>
      <RouterLink 
        class="underline"
        :to="'/project/' + projectId + '/create-task'">Create task</RouterLink>
      <table-component 
        :columns="columns"
        :rows="mappedTasks"
        :delete-button="true"
        :update-button="true"
        @update="goToUpdatePage"
        @delete="deleteTask"
      />
    </div>
  </main-layout>
</template>