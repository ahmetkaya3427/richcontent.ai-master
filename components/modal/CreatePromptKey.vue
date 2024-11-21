<template>
  <div class="row">
    <FormInput v-model="data.name" class="mb-4" :label="$t('adminPanel.prompts.extra.keyName')" />
    <FormInput v-model="data.key" class="mb-4" :label="$t('adminPanel.prompts.extra.key')" />
    <FormSelect v-model="data.type" class="mb-4 w-100" :label="$t('adminPanel.prompts.extra.outputType')">
      <FormOption value="input">{{ $t("adminPanel.prompts.extra.input") }}</FormOption>
      <FormOption value="editor">{{ $t("adminPanel.prompts.extra.editor") }}</FormOption>
    </FormSelect>
  </div>
  <div class="d-flex justify-content-end">
    <FormButton size="btn-md" @click="createPrompt">{{ $t("global.create") }}</FormButton>
  </div>
</template>

<script setup lang="ts">
const { $toast } = useNuxtApp();
const { t } = useI18n();

const emit = defineEmits(["close"]);
const route = useRoute();
const prompt_id = route.params.prompt_id;

const data = ref({
  key: "",
  name: "",
  type: "",
  prompt_id,
});

const generateKey = (name: string) => {
  return name
    .toLowerCase()
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/\s+/g, "_")
    .replace(/[^\w-]+/g, "");
};

watch(
  () => data.value.name,
  (newName) => {
    data.value.key = generateKey(newName);
  },
);

const createPrompt = async () => {
  const body = clone(data.value) as any;

  const response = await useFetch(`/api/admin/prompt-keys`, {
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
