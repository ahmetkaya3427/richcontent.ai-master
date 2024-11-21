<template>
  <div class="row">
    <FormInput v-model="data.name" class="mb-4" label="Grup Adı" />
    <FormMultiSelect v-model="data.ids" label="Prompt Anahtarı Seçin" class="mb-4" :multiple="true">
      <FormOption v-for="key in keys" :key="key.id" :value="key.id">
        {{ key.name }}
      </FormOption>
    </FormMultiSelect>
  </div>
  <div class="d-flex justify-content-end">
    <FormButton size="btn-md" @click="createGroup">{{ $t("global.create") }}</FormButton>
  </div>
</template>

<script setup lang="ts">
const { $toast } = useNuxtApp();
const emit = defineEmits(["close"]);
const route = useRoute();
const prompt_id = route.params.prompt_id;

const fetchKeys = async () => {
  const response = await useFetch("/api/admin/prompt-groups/valid", {
    params: { prompt_id },
  });

  if (!response.data.value) return;
  return response.data.value;
};

const data = ref({
  ids: [],
  name: "",
  prompt_id,
});

const keys = ref(await fetchKeys());

const createGroup = async () => {
  const body = clone(data.value);

  const response = await useFetch("/api/admin/prompt-groups", {
    method: "POST",
    body,
  });

  if (!response.data.value) {
    return $toast.error("Grup oluşturulamadı.");
  }

  $toast.success("Grup oluşturuldu.");
  emit("close");
};
</script>
