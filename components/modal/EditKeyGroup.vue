<template>
  <div class="row">
    <FormInput v-model="data.name" class="mb-4" label="Grup Adı" />
    <FormMultiSelect v-model="data.ids" label="Prompt Anahtarı Seçin" class="mb-4" :multiple="true">
      <FormOption v-for="key in details.keys" :key="key.id" :selected="!key.selected" :value="key.id">
        {{ key.name }}
      </FormOption>
    </FormMultiSelect>
  </div>
  <div class="d-flex justify-content-end">
    <FormButton size="btn-md" @click="updateGroup">{{ $t("global.update") }}</FormButton>
  </div>
</template>

<script setup lang="ts">
const { $toast } = useNuxtApp();
const emit = defineEmits(["close"]);
const route = useRoute();
const prompt_id = route.params.prompt_id;

const props = defineProps({
  id: { type: Number, required: true },
});

const fetchDetails = async () => {
  const response = await useFetch(`/api/admin/prompt-groups/${props.id}`, { params: { prompt_id } });
  if (!response.data.value) throw createError({ statusCode: 400, message: "Details error" });
  return response.data.value;
};

const details = ref(await fetchDetails());
const data = ref({
  name: details.value.data.name,
  ids: details.value.keys.map((e) => e.id),
  prompt_id,
});

const updateGroup = async () => {
  const body = clone(data.value);

  const response = await useFetch(`/api/admin/prompt-groups/${props.id}`, {
    method: "PUT",
    body,
  });

  if (!response.data.value) {
    return $toast.error("Grup güncellenemedi.");
  }

  $toast.success("Grup güncellendi.");
  emit("close");
};
</script>
