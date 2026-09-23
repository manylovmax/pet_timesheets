<script setup lang="ts">
import { computed } from 'vue';

export interface TableColumn {
  label: string, 
  attribute: string,
};

interface Props {
  columns: Array<TableColumn>,
  openObjectPageColumnAttribute?: string,
  rows: Array<Record<string, string>>,
  deleteButton: boolean,
  updateButton: boolean,
};
const props = defineProps<Props>();
const emit = defineEmits(['delete', 'update', 'open']);
const colspan = computed(() => {
  const rowsCount = props.rows.length;
  const actionButtonPresent = props.deleteButton || props.updateButton;

  return rowsCount + (actionButtonPresent ? 1 : 0);
});
</script>
<template>
<div class="w-full overflow-auto">
  <table class="w-full min-w-[600px] py-2"
    v-if="props.columns.length">
    <thead>
      <tr>
        <th scope="col" v-for="col in props.columns" :key="col.attribute">{{ col.label || ''}}</th>
        <th scope="col" v-if="props.deleteButton || props.updateButton">Actions</th>
      </tr>
    </thead>
    <tbody v-if="props.rows.length" >
      <tr v-for="(row, index) in props.rows" :key="index">
        <td v-for="col in props.columns" :key="col.attribute">
          <div v-if="col.attribute === props.openObjectPageColumnAttribute"
            class="select-none cursor-pointer underline"
            @click="emit('open', index)"
          >{{ row[col.attribute] || '' }}</div>
          <div v-else >{{ row[col.attribute] || '' }}</div>
        </td>
        <td v-if="props.updateButton || props.deleteButton">
          <div
            class="flex gap-4 w-full justify-center">
            <div 
              v-if="props.updateButton"
              @click="emit('update', index)"  
              class="select-none cursor-pointer underline">Update</div>
            <div 
              v-if="props.deleteButton"
              @click="emit('delete', index)"  
              class="select-none cursor-pointer underline">Delete</div>
          </div>
        </td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr>
        <td :colspan="colspan">No data</td>
      </tr>
    </tbody>
  </table>
</div>
</template>
<style>
th, td {
  text-align: center;
}
</style>