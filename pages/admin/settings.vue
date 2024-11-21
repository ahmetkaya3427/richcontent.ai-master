<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <Card class="mb-4">
      <template #header> {{ $t("adminPanel.settings.title") }} </template>
      <template #body>
        <FormInput v-model="data.chatgpt_api_key" class="mb-4" :label="$t('adminPanel.settings.apiKey')" />
        <div class="d-flex justify-content-end">
          <FormButton size="btn-md" @click="saveSettings">{{ $t("global.save") }}</FormButton>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
const { $toast } = useNuxtApp();
const { t } = useI18n();

const details = async () => {
  const response = await useFetch("/api/admin/settings");
  if (!response.data.value) throw createError({ statusCode: 400, message: "Details error" });
  return response.data.value;
};

const data = ref(await details());

const saveSettings = async () => {
  const body = clone(data.value);

  const response = await useFetch("/api/admin/settings", {
    method: "POST",
    body,
  });

  if (!response.data.value) {
    return $toast.error(t("adminPanel.settings.saveErrorMessage"));
  }

  $toast.success(t("adminPanel.settings.saveMessage"));
};
</script>
