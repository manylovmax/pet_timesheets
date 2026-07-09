<script setup lang="ts">
import { Pencil, Trash } from '@lucide/vue';

export interface TableColumn {
  label: string, 
  attribute: string,
  type: 'attribute' | 'actions',
  actions?: string[],
};
interface Props {
  columns: Array<TableColumn>,
  rows: Array<Record<string, string>>,
};
const props = defineProps<Props>();
const emit = defineEmits(['delete', 'update']);
</script>
<template>
  <table 
    class="rounded-2xl"
    v-if="props.columns.length">
    <thead>
      <tr>
        <th scope="col" v-for="col in props.columns" :key="col.attribute">{{ col.type === 'actions' ? 'Actions' : col.label || ''}}</th>
      </tr>
    </thead>
    <tbody v-if="props.rows.length" >
      <tr v-for="(row, index) in props.rows" :key="index">
        <td v-for="col in props.columns" :key="col.attribute">
          <div v-if="col.type === 'actions'"
            class="flex gap-2 w-full justify-center">
            <Pencil 
              class="cursor-pointer"
              v-if="col?.actions?.includes('update')"
              @click="emit('update', index)"  
            />
            <Trash 
              class="cursor-pointer"
              v-if="col?.actions?.includes('delete')" 
              @click="emit('delete', index)"
              />
          </div>
          <div v-else>{{ row[col.attribute] || '' }}</div>
        </td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr>
        <td :colspan="props.columns.length">No data</td>
      </tr>
    </tbody>
  </table>
</template>
<style>
th, td {
  text-align: center;
}
</style>