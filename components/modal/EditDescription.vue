<template>
  <div class="row">
    <!-- @vue-ignore -->
    <div
      v-for="[key, value] in Object.entries(JSON.parse(data.gpt_description) as Record<string, DescriptionItem>)"
      :key="key"
      class="mb-4"
    >
      <template v-if="value.type === 'editor'">
        <CustomEditor
          v-model="value.content"
          class="mb-4"
          :title="value.name"
          @input="immediateSave(key, value.content)"
        />
      </template>
      <template v-else-if="value.type === 'input'">
        <FormInput v-model="value.content" :label="value.name" @input="immediateSave(key, value.content)" />
      </template>
    </div>
  </div>
  <div class="d-flex justify-content-end">
    <FormButton size="btn-md" @click="saveDescription(data.id, data.gpt_description, true)">Kaydet</FormButton>
  </div>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";
import { useToast } from "vue-toastification";

const { t } = useI18n();
const toast = useToast();
const emit = defineEmits(["close", "updateDescription"]);

const props = defineProps({
  id: { type: Number, required: true },
});

const getHistory = async () => {
  const response = await useFetch("/api/panel/history", { query: { id: props.id } });
  if (!response.data.value) throw createError({ statusCode: 400, message: "Get history error" });
  return response.data.value;
};

const data = ref(await getHistory());

interface DescriptionItem {
  name: string;
  type: "editor" | "input";
  content: string;
}

const saveDescription = async (id: number, description: string, close = false): Promise<void> => {
  const body = clone({ id, description });

  const response = await useFetch("/api/panel/save-description", {
    method: "POST",
    body,
  });

  if (!response.data.value) {
    toast.error(t("userPanel.main.saveError"));
    return;
  }

  toast.success(t("userPanel.main.saveSuccess"));
  debouncedSave.cancel();

  if (close) emit("close");
  emit("updateDescription", description);
};

const immediateSave = (key: string, newValue: string) => {
  const description = JSON.parse(data.value.gpt_description);
  description[key].content = newValue;
  data.value.gpt_description = JSON.stringify(description);
  debouncedSave();
};

// @ts-ignore
const debouncedSave = debounce(async () => {
  await saveDescription(data.value.id, data.value.gpt_description);
}, 2000);
</script>
