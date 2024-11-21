<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <Card :in-body="false" header-class="d-flex align-items-center justify-content-between">
      <template #header>
        {{ $t("userPanel.history.title") }} ({{ selectedCount }} {{ $t("userPanel.history.selected") }})
        <div class="d-flex gap-3">
          <FormButton size="btn-md" @click="exportHistory">
            {{ selectedCount ? $t("userPanel.history.exportSelected") : $t("userPanel.history.exportAll") }}
          </FormButton>
          <FormButton :disabled="selectedCount <= 0" size="btn-md" @click="deleteHistory">
            {{ $t("userPanel.history.deleteSelected") }}
          </FormButton>
        </div>
      </template>
      <template #body>
        <Table ref="table" v-model="items" list="/api/panel/user-history">
          <template #default>
            <thead>
              <tr>
                <th><FormCheckbox v-model="selectAll" @change="toggleSelectAll" /></th>
                <th>{{ $t("global.id") }}</th>
                <th>{{ $t("userPanel.history.extra.productTitle") }}</th>
                <th>{{ $t("userPanel.history.extra.language") }}</th>
                <th>{{ $t("global.createdAt") }}</th>
                <th>{{ $t("userPanel.history.extra.preview") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>
                  <FormCheckbox v-model="item.checked" />
                </td>
                <td>{{ item.id }}</td>
                <td class="truncate-text">{{ item.product_title }}</td>
                <td>{{ item.prompt.language.code.toUpperCase() }}</td>
                <td>{{ dateConvert(item.created_at) }}</td>
                <td>
                  <img class="history-image" :src="item.images[0]" alt="" />
                </td>
              </tr>
            </tbody>
          </template>
        </Table>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import type { PromptGroups } from "~/types";
import { dateConvert } from "~/utils/dateConvert";

const { t } = useI18n();

useSeoMeta({
  title: t("userPanel.history.title"),
});

const table = ref();
const items = ref<any[]>([]);
const selectedCount = computed(() => items.value.filter((e) => e.checked).length);
const selectAll = ref(false);

const toggleSelectAll = () => {
  for (const item of items.value) item.checked = selectAll.value;
};

const exportHistory = async () => {
  const checkeds = items.value.filter((e) => e.checked);

  const groups: PromptGroups = checkeds.reduce((groups, item) => {
    const promptId = item.prompt.id;
    if (!groups[promptId]) groups[promptId] = [];
    groups[promptId].push(item.id);
    return groups;
  }, {});

  for (const [prompt_id, ids] of Object.entries(groups)) {
    await exportExcel({ ids, prompt_id });
  }
};

const deleteHistory = async () => {
  const history_ids = clone(items.value.filter((e) => e.checked).map((e) => e.id));
  const response = await useFetch("/api/panel/user-history/delete", {
    method: "POST",
    body: { history_ids },
  });

  if (!response.data.value) throw createError({ statusCode: 400, message: "History error" });
  if (table.value) table.value.refresh();
  return response.data.value;
};
</script>
