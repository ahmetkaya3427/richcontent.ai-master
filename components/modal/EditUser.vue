<template>
  <div class="row">
    <div class="col-6">
      <FormInput v-model="data.name" class="mb-4" :label="$t('adminPanel.users.extra.name')" />
    </div>
    <div class="col-6">
      <FormInput v-model="data.surname" class="mb-4" :label="$t('adminPanel.users.extra.surname')" />
    </div>
    <div class="col-6">
      <FormInput v-model="data.email" class="mb-4" :label="$t('adminPanel.users.extra.email')" />
    </div>
    <div class="col-6">
      <FormInput v-model="data.phone" class="mb-4" :label="$t('adminPanel.users.extra.phone')" />
    </div>
    <div class="col-6">
      <FormInput v-model="data.username" class="mb-4" :label="$t('adminPanel.users.extra.username')" />
    </div>
    <div class="col-6">
      <FormInput v-model="newPassword" class="mb-4" type="password" :label="$t('adminPanel.users.extra.password')" />
    </div>
    <div class="col-6">
      <FormInput v-model="data.credit" class="mb-4" type="number" :label="$t('adminPanel.users.extra.credit')" />
    </div>
    <div class="col-6">
      <FormSelect v-model="data.role" :label="$t('adminPanel.users.extra.role')" class="mb-4" :multiple="false">
        <FormOption value="user">{{ $t("role.user") }}</FormOption>
        <FormOption value="admin">{{ $t("role.admin") }}</FormOption>
      </FormSelect>
    </div>
    <div class="col-12">
      <FormMultiSelect v-model="selectedPrompts" label="Prompt Seçin" class="mb-4" :multiple="true">
        <FormOption v-for="prompt in prompts" :key="prompt.id" :value="prompt.id">
          {{ prompt.language.code.toUpperCase() }} - {{ prompt.name }}
        </FormOption>
      </FormMultiSelect>
    </div>
  </div>
  <div class="d-flex justify-content-end">
    <FormButton size="btn-md" @click="updateUser">{{ $t("global.update") }}</FormButton>
  </div>
</template>

<script setup lang="ts">
const { $toast } = useNuxtApp();
const { t } = useI18n();
const emit = defineEmits(["close"]);

const props = defineProps({
  id: { type: Number, required: true },
});

const fetchDetails = async () => {
  const response = await useFetch(`/api/admin/users/${props.id}`);
  if (!response.data.value) throw createError({ statusCode: 400, message: "Details error" });
  return response.data.value;
};

const fetchAllPrompts = async () => {
  const response = await useFetch("/api/admin/all-prompts");
  if (!response.data.value) return;
  return response.data.value;
};

const data = ref(await fetchDetails());
const prompts = ref(await fetchAllPrompts());
const selectedPrompts = ref([] as any[]);
const newPassword = ref("");

const updateUser = async () => {
  const body = clone(data.value) as any;
  if (newPassword.value) body.password = newPassword.value;
  body.prompt_ids = clone(selectedPrompts.value);

  const response = await useFetch(`/api/admin/users/${props.id}`, {
    method: "PUT",
    body,
  });

  if (!response.data.value) {
    return $toast.error(t("adminPanel.users.updateError"));
  }

  $toast.success(t("adminPanel.users.updateSuccess"));
  emit("close");
};
</script>
