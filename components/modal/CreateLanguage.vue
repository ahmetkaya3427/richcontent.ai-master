<template>
  <div class="row">
    <div class="col-6">
      <FormInput v-model="data.name" class="mb-4" :label="$t('adminPanel.language.modal.name')" />
    </div>
    <div class="col-6">
      <FormInput v-model="data.code" class="mb-4" :label="$t('adminPanel.language.modal.code')" />
    </div>
  </div>
  <div class="d-flex justify-content-end">
    <FormButton size="btn-md" @click="createPrompt">{{ $t("global.create") }}</FormButton>
  </div>
</template>

<script setup lang="ts">
const { $toast } = useNuxtApp();
const { t } = useI18n();

const emit = defineEmits(["close"]);

const data = ref({
  name: "",
  code: "",
});

const createPrompt = async () => {
  const body = clone(data.value) as any;
  body.default = body.default === "default";

  const response = await useFetch("/api/admin/languages", {
    method: "POST",
    body,
  });

  if (!response.data.value) {
    return $toast.error(t("adminPanel.language.createError"));
  }

  $toast.success(t("adminPanel.language.createSuccess"));
  emit("close");
};
</script>
