<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <Card :in-body="false">
      <template #header>{{ $t("adminPanel.history.title") }}</template>
      <template #body>
        <Table ref="table" v-model="items" list="/api/admin/history">
          <template #default>
            <thead>
              <tr>
                <th>{{ $t("global.id") }}</th>
                <th>{{ $t("adminPanel.history.extra.link") }}</th>
                <th>{{ $t("global.createdAt") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item">
                <td>{{ item.id }}</td>
                <td class="truncate-text">{{ item.link }}</td>
                <td>{{ dateConvert(item.created_at) }}</td>
              </tr>
            </tbody>
          </template>
        </Table>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { dateConvert } from "~/utils/dateConvert";
const items = ref<any[]>([]);
</script>
