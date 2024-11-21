<template>
  <div class="row">
    <FormInput v-model="data.name" class="mb-4" :label="$t('adminPanel.prompts.extra.name')" />
    <FormSelect v-model="data.default" class="mb-4 w-100" :label="$t('adminPanel.prompts.extra.status')">
      <FormOption value="default">{{ $t("adminPanel.prompts.extra.default") }}</FormOption>
      <FormOption value="custom">{{ $t("adminPanel.prompts.extra.custom") }}</FormOption>
    </FormSelect>
    <FormTextarea v-model="data.content" class="mb-4" :label="$t('adminPanel.prompts.extra.prompt')" />
  </div>
  <div class="d-flex justify-content-end">
    <FormButton size="btn-md" @click="createPrompt">{{ $t("global.create") }}</FormButton>
  </div>
</template>

<script setup lang="ts">
const { $toast } = useNuxtApp();
const { t } = useI18n();
const route = useRoute();
const language_id = route.params.language_id;

const emit = defineEmits(["close"]);

const data = ref({
  name: "",
  content: "",
  default: "default",
  language_id,
});

const createPrompt = async () => {
  const body = clone(data.value) as any;
  body.default = body.default === "default";

  const response = await useFetch("/api/admin/prompts", {
    method: "POST",
    body,
  });

  if (!response.data.value) {
    return $toast.error(t("adminPanel.prompts.createError"));
  }

  $toast.success(t("adminPanel.prompts.createSuccess"));
  emit("close");
};
</script>
