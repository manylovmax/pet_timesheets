<script setup lang="ts">
export interface TableColumn {label: string, attribute: string};
interface Props {
  columns: Array<TableColumn>,
  rows: Array<Record<string, string>>,
};
const props = defineProps<Props>();
</script>
<template>
  <table v-if="props.columns.length">
    <thead>
      <tr>
        <th scope="col" v-for="col in props.columns" :key="col.attribute">{{ col.label || ''}}</th>
      </tr>
    </thead>
    <tbody v-if="props.rows.length" >
      <tr v-for="(row, index) in props.rows" :key="index">
        <td v-for="col in props.columns" :key="col.attribute">{{ row[col.attribute] || '' }}</td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr>
        <td :colspan="props.columns.length">No data</td>
      </tr>
    </tbody>
  </table>
</template>