<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <Card :in-body="false" header-class="d-flex align-items-center justify-content-between">
      <template #header>
        {{ $t("adminPanel.configs.title") }}
        <FormButton size="btn-md" @click="router.push('/admin/configs/add')">
          {{ $t("adminPanel.configs.create") }}
        </FormButton>
      </template>
      <template #body>
        <Table ref="table" v-model="items" list="/api/admin/configs">
          <template #default>
            <thead>
              <tr>
                <th>{{ $t("global.id") }}</th>
                <th>{{ $t("adminPanel.configs.extra.name") }}</th>
                <th>{{ $t("adminPanel.configs.extra.domain") }}</th>
                <th>{{ $t("table.action") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item">
                <td>{{ item.id }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.domain }}</td>
                <td>
                  <div class="d-flex gap-2">
                    <FormButton class="btn" :icon="true" @click="router.push(`/admin/configs/${item.id}`)">
                      <i class="bx bx-edit" />
                    </FormButton>
                    <FormButton color="btn-danger" class="btn" :icon="true" @click="removeConfig(item.id)">
                      <i class="bx bx-trash" />
                    </FormButton>
                  </div>
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
const { $toast } = useNuxtApp();
const { t } = useI18n();

const router = useRouter();
const table = ref();
const items = ref<any[]>([]);

const removeConfig = async (id: number) => {
  const response = await useFetch(`/api/admin/configs/${id}`, { method: "DELETE" });
  if (!response.data.value) throw createError({ statusCode: 400, message: "Delete error" });
  $toast.success(t("adminPanel.configs.deleteMessage"));
  if (table.value) table.value.refresh();
};
</script>
