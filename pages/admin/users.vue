<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <Modal v-model:visible="createState" :title="$t('adminPanel.users.create')">
      <ModalCreateUser @close="createState = false" />
    </Modal>

    <Modal v-model:visible="editState" :title="$t('adminPanel.users.edit')">
      <ModalEditUser :id="editId" @close="closeEditModal" />
    </Modal>

    <Card :in-body="false" header-class="d-flex align-items-center justify-content-between">
      <template #header>
        {{ $t("adminPanel.users.title") }}
        <FormButton size="btn-md" @click="createState = true">{{ $t("adminPanel.users.create") }}</FormButton>
      </template>
      <template #body>
        <Table ref="table" v-model="items" list="/api/admin/users">
          <template #default>
            <thead>
              <tr>
                <th>{{ $t("global.id") }}</th>
                <th>{{ $t("adminPanel.users.extra.name") }}</th>
                <th>{{ $t("adminPanel.users.extra.surname") }}</th>
                <th>{{ $t("adminPanel.users.extra.username") }}</th>
                <th>{{ $t("adminPanel.users.extra.role") }}</th>
                <th>{{ $t("table.action") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item">
                <td>{{ item.id }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.surname }}</td>
                <td>{{ item.username }}</td>
                <td>{{ item.role === "admin" ? $t("role.admin") : $t("role.user") }}</td>
                <td>
                  <div class="d-flex gap-2">
                    <FormButton class="btn" :icon="true" @click="openEditModal(item.id)">
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

const createState = ref(false);
const editState = ref(false);
const editId = ref(0);
const table = ref();
const items = ref<any[]>([]);

const openEditModal = (id: number) => {
  editId.value = id;
  editState.value = true;
};

const closeEditModal = () => {
  editState.value = false;
  if (table.value) table.value.refresh();
};

const removeConfig = async (id: number) => {
  const response = await useFetch(`/api/admin/users/${id}`, { method: "DELETE" });
  if (!response.data.value) throw createError({ statusCode: 400, message: "Delete error" });
  $toast.success(t("adminPanel.users.deleteMessage"));
  if (table.value) table.value.refresh();
};
</script>
