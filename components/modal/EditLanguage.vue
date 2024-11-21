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
    <FormButton size="btn-md" @click="updateLanguage">{{ $t("global.update") }}</FormButton>
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
  const response = await useFetch(`/api/admin/languages/${props.id}`);
  if (!response.data.value) throw createError({ statusCode: 400, message: "Details error" });
  return response.data.value;
};

const data = ref(await fetchDetails());

const updateLanguage = async () => {
  const body = clone(data.value) as any;
  body.default = body.default === "default";

  const response = await useFetch(`/api/admin/languages/${props.id}`, {
    method: "PUT",
    body,
  });

  if (!response.data.value) {
    return $toast.error(t("adminPanel.language.updateError"));
  }

  $toast.success(t("adminPanel.language.updateSuccess"));
  emit("close");
};
</script>
