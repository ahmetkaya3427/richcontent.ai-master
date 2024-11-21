<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <Modal v-model:visible="createState" :title="$t('adminPanel.language.create')">
      <ModalCreateLanguage @close="closeCreate" />
    </Modal>

    <Modal v-model:visible="editState" :title="$t('adminPanel.language.edit')">
      <ModalEditLanguage :id="editId" @close="closeEdit" />
    </Modal>

    <Card :in-body="false" header-class="d-flex align-items-center justify-content-between">
      <template #header>
        {{ $t("adminPanel.language.title") }}
        <div class="d-flex gap-3">
          <FormButton size="btn-md" @click="createState = true">
            {{ $t("adminPanel.language.create") }}
          </FormButton>
        </div>
      </template>
      <template #body>
        <Table ref="table" v-model="items" list="/api/admin/languages">
          <template #default>
            <thead>
              <tr>
                <th>{{ $t("global.id") }}</th>
                <th>{{ $t("adminPanel.language.modal.name") }}</th>
                <th>{{ $t("adminPanel.language.modal.code") }}</th>
                <th>{{ $t("table.action") }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item">
                <td>{{ item.id }}</td>
                <td class="truncate-text">{{ item.name }}</td>
                <td class="truncate-text">{{ item.code.toUpperCase() }}</td>
                <td>
                  <div class="d-flex gap-2">
                    <FormButton class="btn" :icon="true" @click="openEditModal(item.id)">
                      <i class="bx bx-edit" />
                    </FormButton>
                    <FormButton color="btn-danger" class="btn" :icon="true" @click="removePrompt(item.id)">
                      <i class="bx bx-trash" />
                    </FormButton>
                    <FormButton class="btn" :icon="true" @click="router.push(`/admin/languages/${item.id}`)">
                      <i class="bx bx-door-open" />
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
const router = useRouter();
const { $toast } = useNuxtApp();
const { t } = useI18n();

const table = ref();
const items = ref<any[]>([]);
const createState = ref(false);

const editId = ref(0);
const editState = ref(false);

const openEditModal = (id: number) => {
  editId.value = id;
  editState.value = true;
};

const removePrompt = async (id: number) => {
  const response = await useFetch(`/api/admin/languages/${id}`, { method: "DELETE" });
  if (!response.data.value) throw createError({ statusCode: 400, message: "Delete error" });
  $toast.success(t("adminPanel.language.deleteMessage"));
  if (table.value) table.value.refresh();
};

const closeCreate = () => {
  createState.value = false;
  if (table.value) table.value.refresh();
};

const closeEdit = () => {
  editState.value = false;
  if (table.value) table.value.refresh();
};
</script>
