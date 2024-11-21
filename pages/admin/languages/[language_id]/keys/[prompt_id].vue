<template>
  <div>
    <div class="container-xxl flex-grow-1 container-p-y">
      <Modal v-model:visible="keyCreateState" :title="$t('adminPanel.prompts.keys.create')">
        <ModalCreatePromptKey @close="closeKeyCreate" />
      </Modal>

      <Modal v-model:visible="keyEditState" :title="$t('adminPanel.prompts.keys.edit')">
        <ModalEditPromptKey :id="keyEditId" @close="closeKeyEdit" />
      </Modal>

      <Card :in-body="false" header-class="d-flex align-items-center justify-content-between">
        <template #header>
          {{ $t("adminPanel.prompts.keys.title") }}
          <FormButton size="btn-md" @click="keyCreateState = true">
            {{ $t("adminPanel.prompts.keys.create") }}
          </FormButton>
        </template>
        <template #body>
          <Table ref="keyTable" v-model="keyItems" :list="`/api/admin/prompt-keys`" :body="{ prompt_id }">
            <template #default>
              <thead>
                <tr>
                  <th>{{ $t("global.id") }}</th>
                  <th>{{ $t("adminPanel.prompts.extra.keyName") }}</th>
                  <th>{{ $t("adminPanel.prompts.extra.key") }}</th>
                  <th>{{ $t("table.action") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in keyItems" :key="item">
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.key }}</td>
                  <td>
                    <div class="d-flex gap-2">
                      <FormButton class="btn" :icon="true" @click="openKeyModal(item.id)">
                        <i class="bx bx-edit" />
                      </FormButton>
                      <FormButton color="btn-danger" class="btn" :icon="true" @click="removeKey(item.id)">
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

    <div class="container-xxl flex-grow-1 container-p-y">
      <Modal v-model:visible="groupCreateState" title="Prompt Grup Oluştur">
        <ModalCreateKeyGroup @close="closeGroupCreate" />
      </Modal>

      <Modal v-model:visible="groupEditState" title="Prompt Grup Düzenle">
        <ModalEditKeyGroup :id="groupEditId" @close="closeGroupEdit" />
      </Modal>

      <Card :in-body="false" header-class="d-flex align-items-center justify-content-between">
        <template #header>
          Prompt Grup Listesi
          <FormButton size="btn-md" @click="groupCreateState = true"> Grup Oluştur </FormButton>
        </template>
        <template #body>
          <Table ref="groupTable" v-model="groupItems" :list="`/api/admin/prompt-groups`" :body="{ prompt_id }">
            <template #default>
              <thead>
                <tr>
                  <th>{{ $t("global.id") }}</th>
                  <th>{{ $t("adminPanel.prompts.extra.keyName") }}</th>
                  <th>{{ $t("table.action") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in groupItems" :key="item">
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>
                    <div class="d-flex gap-2">
                      <FormButton class="btn" :icon="true" @click="openGroupModal(item.id)">
                        <i class="bx bx-edit" />
                      </FormButton>
                      <FormButton color="btn-danger" class="btn" :icon="true" @click="removeGroup(item.id)">
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
  </div>
</template>

<script setup lang="ts">
const { $toast } = useNuxtApp();
const { t } = useI18n();

const route = useRoute();
const prompt_id = route.params.prompt_id;

// * Keys
const keyTable = ref();
const keyItems = ref<any[]>([]);
const keyCreateState = ref(false);
const keyEditId = ref(0);
const keyEditState = ref(false);

const openKeyModal = (id: number) => {
  keyEditId.value = id;
  keyEditState.value = true;
};

const closeKeyCreate = () => {
  keyCreateState.value = false;
  if (keyTable.value) keyTable.value.refresh();
};

const closeKeyEdit = () => {
  keyEditState.value = false;
  if (keyTable.value) keyTable.value.refresh();
};

const removeKey = async (id: number) => {
  const response = await useFetch(`/api/admin/prompt-keys/${id}`, { method: "DELETE" });

  if (!response.data.value) {
    throw createError({ statusCode: 400, message: "Delete error" });
  }

  $toast.success(t("adminPanel.prompts.deleteMessage"));
  if (keyTable.value) keyTable.value.refresh();
  if (groupTable.value) groupTable.value.refresh();
};

// * Groups
const groupTable = ref();
const groupItems = ref<any[]>([]);
const groupCreateState = ref(false);
const groupEditId = ref(0);
const groupEditState = ref(false);

const openGroupModal = (id: number) => {
  groupEditId.value = id;
  groupEditState.value = true;
};

const closeGroupCreate = () => {
  groupCreateState.value = false;
  if (groupTable.value) groupTable.value.refresh();
};

const closeGroupEdit = () => {
  groupEditState.value = false;
  if (groupTable.value) groupTable.value.refresh();
};

const removeGroup = async (id: number) => {
  const response = await useFetch(`/api/admin/prompt-groups/${id}`, { method: "DELETE" });

  if (!response.data.value) {
    throw createError({ statusCode: 400, message: "Delete error" });
  }

  $toast.success(t("adminPanel.prompts.deleteMessage"));
  if (groupTable.value) groupTable.value.refresh();
};
</script>
