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
    <FormButton size="btn-md" @click="updatePrompt">{{ $t("global.update") }}</FormButton>
  </div>
</template>

<script setup lang="ts">
const { $toast } = useNuxtApp();
const { t } = useI18n();
const emit = defineEmits(["close"]);

const route = useRoute();
const language_id = route.params.language_id;

const props = defineProps({
  id: { type: Number, required: true },
});

const fetchDetails = async () => {
  const response = await useFetch(`/api/admin/prompts/${props.id}`);
  if (!response.data.value) throw createError({ statusCode: 400, message: "Details error" });
  return response.data.value;
};

const data = ref(await fetchDetails());

const updatePrompt = async () => {
  const body = clone(data.value) as any;
  body.default = body.default === "default";
  body.language_id = language_id;

  const response = await useFetch(`/api/admin/prompts/${props.id}`, {
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
