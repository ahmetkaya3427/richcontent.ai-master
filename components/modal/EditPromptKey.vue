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
    <FormButton size="btn-md" @click="updatePrompt">{{ $t("global.create") }}</FormButton>
  </div>
</template>

<script setup lang="ts">
const { $toast } = useNuxtApp();
const { t } = useI18n();

const props = defineProps({
  id: { type: Number, required: true },
});

const emit = defineEmits(["close"]);

const fetchDetails = async () => {
  const response = await useFetch(`/api/admin/prompt-keys/${props.id}`);
  if (!response.data.value) throw createError({ statusCode: 400, message: "Details error" });
  return response.data.value;
};

const data = ref(await fetchDetails());

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

const updatePrompt = async () => {
  const body = clone(data.value) as any;

  const response = await useFetch(`/api/admin/prompt-keys/${props.id}`, {
    method: "PUT",
    body,
  });

  if (!response.data.value) {
    return $toast.error(t("adminPanel.prompts.updateError"));
  }

  $toast.success(t("adminPanel.prompts.updateSuccess"));
  emit("close");
};
</script>
