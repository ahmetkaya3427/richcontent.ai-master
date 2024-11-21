<template>
  <Card>
    <template #header>{{ $t("userPanel.tabs.image.title") }}</template>
    <template #body>
      <div class="panel-upload panel-upload-single mb-4">
        <div
          v-auto-animate
          class="upload-dropzone"
          :class="{ 'drag-over': isDragging }"
          @dragover.prevent="isDragging = true"
          @dragenter.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <input ref="fileInput" type="file" multiple style="display: none" @change="handleChange" />

          <div v-if="readArray.length <= 0">
            <div class="upload-message mb-3">{{ $t("userPanel.tabs.image.uploadMessage") }}</div>
            <div v-auto-animate class="d-flex gap-3 align-items-center justify-content-center">
              <FormButton @click="fileInput.click()">{{ $t("userPanel.tabs.image.selectFile") }}</FormButton>
            </div>
          </div>
          <div v-else>
            <div v-auto-animate class="upload-items-wrapper">
              <div v-for="item in readArray" :key="item.file.name" class="upload-item">
                <img :src="item.url" />
                <span class="remove-item" @click="removeItem(item)"><i class="bx bx-x"></i></span>
              </div>
              <div class="upload-item add-item" @click="fileInput.click()"><i class="bx bx-plus"></i></div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <FormSelect v-model="selectedLanguage" class="mb-4 w-100" :label="$t('userPanel.tabs.descriptionLanguage')">
            <FormOption v-for="item in languages" :key="item.id" :value="item.code">{{ item.name }}</FormOption>
          </FormSelect>
        </div>
        <div class="col-6">
          <FormSelect
            :key="selectedLanguage + selectedPrompt"
            v-model="selectedPrompt"
            class="mb-4 w-100"
            :label="$t('userPanel.tabs.link.promptList')"
          >
            <FormOption v-for="option in prompts" :key="option.id" :value="option.id.toString()">
              {{ option.name }}
            </FormOption>
          </FormSelect>
        </div>
      </div>
      <div class="d-flex gap-3">
        <FormButton color="btn-success" :disabled="addDisabled" @click="handleUpload">
          {{ $t("userPanel.tabs.image.addProduct") }}
        </FormButton>
        <FormButton
          :disabled="actionDisabled || imageCount < 1"
          :loading="createAllLoading"
          @click="$emit('createDescriptions')"
        >
          {{ $t("userPanel.tabs.createAllDescriptions") }}
        </FormButton>
        <FormButton
          :disabled="!images.filter((e) => e.gpt_description).length || actionDisabled"
          @click="$emit('exportDescriptions')"
        >
          {{ $t("userPanel.tabs.image.exportAll") }}
        </FormButton>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { useToast } from "vue-toastification";
import type { GetImagesResponse, GetLanguagesResponse, GetPromptsResponse } from "~/types";

const { t } = useI18n();
const toast = useToast();
defineEmits(["createDescriptions", "exportDescriptions"]);

const images = inject<Ref<Array<GetImagesResponse>>>("images")!;
const prompts = inject<Ref<GetPromptsResponse>>("prompts")!;
const languages = inject<Ref<GetLanguagesResponse>>("languages")!;

// Select
const selectedPrompt = inject<Ref<string>>("selectedPrompt")!;
const selectedLanguage = inject<Ref<string>>("selectedLanguage")!;

// Progress
const progressDisabled = inject<Ref<boolean>>("progressDisabled")!;

// Loading
const createAllLoading = inject<Ref<boolean>>("createAllLoading")!;

// Action
const actionDisabled = inject<Ref<boolean>>("actionDisabled")!;
const imageCount = computed(() => images.value.length);
const addDisabled = computed(() => readArray.value.length <= 0 || progressDisabled.value);

// Other
const fileInput = ref();
const isDragging = ref(false);
const readArray = ref<any[]>([]);

const handleUpload = async () => {
  if (!selectedPrompt.value) return toast.error(t("userPanel.tabs.selectPromptError"));
  if (!selectedLanguage.value) return toast.error(t("userPanel.tabs.selectLanguageError"));

  const formData = new FormData();

  for (const item of readArray.value) {
    formData.append("file", item.file);
  }

  formData.append("language", selectedLanguage.value);
  formData.append("prompt_id", selectedPrompt.value);

  const response = await useFetch("/api/panel/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.data.value) {
    return toast.error(t("userPanel.tabs.image.uploadError"));
  }

  const data: GetImagesResponse = {
    link: response.data.value.groupUrl,
    images: response.data.value.fileUrls.map((e) => e.original),
    product_sku: "",
    product_title: "Özel Resim",
    product_description: "",
    loading: false,
    type: "upload",
    gpt_description: {},
    product_code: "",
    prompt_id: -1,
  };

  readArray.value = [];
  images.value.unshift(data);
  toast.success(t("userPanel.tabs.image.productAdded"));
};

const readFiles = (files: any[]) => {
  Array.from(files).forEach((file: any) => {
    const reader = new FileReader();

    return new Promise<void>((resolve, reject) => {
      reader.onload = async (event) => {
        const target = event.target;
        if (!target) return reject(new Error("FileReader error"));

        readArray.value.push({ file, url: target.result });
        await nextTick();
        resolve();
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  });
};

const handleDrop = (event: any) => {
  readArray.value = [];
  isDragging.value = false;
  const files = event.dataTransfer.files;
  if (files.length) readFiles(files);
};

const handleChange = (event: any) => {
  readArray.value = [];
  const files = event.target.files;
  if (files.length) readFiles(files);
};

const removeItem = (item: any) => {
  readArray.value = readArray.value.filter((file) => file.file !== item.file);
};
</script>
