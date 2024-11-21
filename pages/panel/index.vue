<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <div class="mb-4">
      <Modal v-model:visible="editState" title="Oluşturulan Açıklamayı Düzenle">
        <ModalEditDescription :id="editId" @close="closeEdit" @update-description="updateDescription" />
      </Modal>

      <TabGroup>
        <template #tab-button>
          <TabItem :index="0" :active="true">
            <i class="bx bx-link-alt me-2" />{{ $t("userPanel.main.createFromLink") }}
          </TabItem>
          <TabItem :index="1">
            <i class="bx bx-image-alt me-2" />
            {{ $t("userPanel.main.createFromImages") }}
          </TabItem>
          <TabItem
            data-bs-toggle="tooltip"
            data-bs-offset="0,4"
            data-bs-placement="right"
            data-bs-html="true"
            :data-bs-original-title="`<span>${$t('userPanel.main.importInformation')}</span>`"
          >
            <label class="w-100" style="cursor: pointer">
              <input type="file" style="display: none" @change="handleFileUpload" />
              <i class="bx bxs-file-import me-2" />
              <span>{{ $t("userPanel.main.import") }}</span>
            </label>
          </TabItem>
        </template>
        <template #tab-content>
          <TabContent :index="0">
            <TabsLinkContent @create-descriptions="createAllDescriptions" @export-descriptions="exportDescriptions" />
          </TabContent>
          <TabContent :index="1">
            <TabsImageContent @create-descriptions="createAllDescriptions" @export-descriptions="exportDescriptions" />
          </TabContent>
        </template>
      </TabGroup>
    </div>

    <ProgressBar
      v-if="progressDisabled"
      v-model="progressValue"
      v-model:text="progressText"
      class="mb-4"
      :height="23"
    />

    <div v-auto-animate class="scrape-images">
      <Card
        v-for="item in images"
        :key="item.product_title"
        class="image-item"
        header-class="d-flex justify-content-between"
      >
        <template v-if="item.product_title" #header>
          <div>
            <a v-if="item.type !== 'upload'" :href="item.link" target="_blank">{{ item.product_title }}</a>
            <span v-else>{{ item.product_title }}</span>
          </div>
          <div class="d-flex gap-2">
            <FormBadge v-if="item.product_code">
              {{ $t("userPanel.main.productCode") }} {{ item.product_code }}
            </FormBadge>
            <FormBadge v-if="item.product_sku">
              {{ $t("userPanel.main.productSku") }} {{ item.product_sku }}
            </FormBadge>
          </div>
        </template>
        <template #body>
          <div class="row">
            <div class="col-3">
              <Swiper
                class="image-swiper"
                :pagination="true"
                :modules="[Pagination]"
                :slides-per-view="1"
                :space-between="20"
                :auto-height="true"
              >
                <SwiperSlide v-for="image in item.images.slice(0, 7)" :key="image">
                  <div class="slider-item">
                    <a :data-fslightbox="item.link" :href="image">
                      <img :src="image" alt="" />
                    </a>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
            <div class="col-9">
              <div class="top-images mb-3">
                <div v-for="image in item.images.slice(0, 7)" :key="image" class="top-image">
                  <a :data-fslightbox="item.link + '2'" :href="image">
                    <img :src="image" alt="" />
                  </a>
                </div>
              </div>
              <div class="d-flex gap-2 mb-4 align-items-center">
                <FormButton
                  class="text-nowrap"
                  :disabled="item.loading"
                  :loading="item.loading"
                  @click="createDescription(item)"
                >
                  {{
                    isEmptyObject(item.gpt_description)
                      ? $t("userPanel.main.createDescription")
                      : $t("userPanel.main.createDescriptionAgain")
                  }}
                </FormButton>

                <FormButton
                  class="text-nowrap"
                  :disabled="isEmptyObject(item.gpt_description)"
                  @click="copyClipboard(item.gpt_description!)"
                >
                  {{ $t("userPanel.main.copyClipboard") }}
                </FormButton>

                <FormButton
                  class="text-nowrap"
                  :disabled="isEmptyObject(item.gpt_description)"
                  @click="openEditModal(item.id!)"
                >
                  Düzenle
                </FormButton>

                <FormSelect
                  v-model="item.prompt_id"
                  add-class="description"
                  :placeholder="$t('userPanel.main.differentPromptAgain')"
                >
                  <FormOption v-for="option in prompts" :key="option.id" :value="option.id.toString()">
                    {{ option.name }}
                  </FormOption>
                </FormSelect>
              </div>

              <div v-if="!isEmptyObject(item.gpt_description)" class="description-wrapper">
                <div
                  v-for="(description, index) in Object.values(item.gpt_description)"
                  :key="index"
                  class="description"
                >
                  <strong>{{ description.name }}</strong>
                  <div>{{ formatDescription(description.content) }}</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as XLSX from "xlsx";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination } from "swiper/modules";
import { useToast } from "vue-toastification";
import { cleanTags } from "#imports";
import type { GetImagesResponse, PromptGroups } from "~/types";

const { t } = useI18n();
const toast = useToast();
const userStore = useUserStore();

useSeoMeta({
  title: t("menu.home"),
});

useHead({
  script: [
    {
      src: "fslightbox.js",
    },
  ],
});

// @ts-ignore
const updateFsLightbox = () => nextTick(() => refreshFsLightbox());

const fetchPrompts = async (language: string) => {
  const response = await useFetch("/api/panel/prompts", {
    method: "GET",
    params: { language },
  });

  if (!response.data.value) return;
  return response.data.value || [];
};

const fetchLanguages = async () => {
  const response = await useFetch("/api/panel/languages");
  if (!response.data.value) return;
  return response.data.value || [];
};

const formatDescription = (description: string) => {
  description = description.replaceAll("<br>", "\n");
  return cleanTags(description);
};

const links = ref("");
const images = ref<Array<GetImagesResponse>>([]);
const languages = ref(await fetchLanguages());
const prompts = ref(await fetchPrompts("tr"));

// Select
const selectedLanguage = ref("tr");
const selectedPrompt = ref(prompts.value && prompts.value.length ? prompts.value[0].id.toString() : "");

// Progress
const progressText = ref("");
const progressValue = ref(0);
const progressDisabled = ref(false);

// Action
const actionDisabled = ref(false);

// Loading
const getImagesLoading = ref(false);
const createAllLoading = ref(false);

watch(selectedLanguage, async () => {
  prompts.value = await fetchPrompts(selectedLanguage.value);
  selectedPrompt.value = prompts.value && prompts.value.length ? prompts.value[0].id.toString() : "";
});

provide("links", links);
provide("images", images);
provide("prompts", prompts);
provide("languages", languages);

provide("selectedPrompt", selectedPrompt);
provide("selectedLanguage", selectedLanguage);

provide("progressText", progressText);
provide("progressValue", progressValue);
provide("progressDisabled", progressDisabled);

provide("actionDisabled", actionDisabled);

provide("getImagesLoading", getImagesLoading);
provide("createAllLoading", createAllLoading);

const imageCount = computed(() => images.value.length);
watch(imageCount, () => updateFsLightbox(), { deep: true });

const editId = ref(0);
const editState = ref(false);

const openEditModal = (id: number) => {
  editId.value = id;
  editState.value = true;
};

const updateDescription = (description: string) => {
  const find = images.value.find((e) => e.id === editId.value);
  if (!find) return;

  find.gpt_description = JSON.parse(description);
};

const closeEdit = () => {
  editState.value = false;
};

const readCSV = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const contents = e.target?.result as string;
    const rows = contents.split("\n");
    links.value = rows
      .map((e: any) => e[0])
      .filter((e) => e)
      .join("\n");
  };
  reader.readAsText(file);
};

const readXLSX = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target?.result as ArrayBuffer);
    const excel = XLSX.read(data, { type: "array" });
    const firstSheet = excel.Sheets[excel.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
    links.value = jsonData
      .map((e: any) => e[0])
      .filter((e) => e)
      .join("\n");
  };
  reader.readAsArrayBuffer(file);
};

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  const file = input.files[0];
  const fileExtension = file.name.split(".").pop()?.toLowerCase();

  if (fileExtension === "csv") return readCSV(file);
  if (fileExtension && ["xls", "xlsx"].includes(fileExtension)) {
    return readXLSX(file);
  }

  toast.error(t("userPanel.main.unsupportedFile"));
};

const exportDescriptions = async () => {
  const groups: PromptGroups = images.value.reduce((groups, item) => {
    if (item.prompt_id !== -1 && item.id !== undefined) {
      if (!groups[item.prompt_id]) groups[item.prompt_id] = [];
      groups[item.prompt_id].push(item.id);
    }

    return groups;
  }, {} as PromptGroups);

  for (const [prompt_id, ids] of Object.entries(groups)) {
    await exportExcel({ ids, prompt_id });
  }
};

const convertDescription = (description: object) => {
  return Object.values(description)
    .map((item) => `${item.name}: ${item.content}`)
    .join("\n\n");
};

const copyClipboard = (description: object) => {
  const convert = convertDescription(description);
  const text = cleanTags(convert);
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand("copy");
    toast.success(t("userPanel.main.copiedClipboard"));
  } catch (error) {}

  document.body.removeChild(textarea);
};

const fetchDescription = async (item: GetImagesResponse, recreate: boolean) => {
  const body = clone({
    recreate,
    url: item.link,
    type: item.type,
    prompt_id: item.prompt_id.toString() || selectedPrompt.value.toString(),
    language: selectedLanguage.value,
  });

  try {
    const response = await fetch("/api/panel/description", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await response.json();
    if (json.content) return json;
  } catch (error) {
    console.error("Fetch description error", error);
    return false;
  }
};

const isEmptyObject = (obj: any) => {
  return !obj || (Object.keys(obj).length === 0 && obj.constructor === Object);
};

const createDescription = async (item: GetImagesResponse) => {
  const find = images.value.find((e) => e.link === item.link);
  if (!find) {
    toast.error(t("global.failed"));
    return;
  }

  const recreate = !isEmptyObject(find.gpt_description);

  find.loading = true;
  find.gpt_description = {};

  const description = await Promise.race([fetchDescription(find, recreate), sleep(90000)]);

  if (!description) {
    await sleep(1000);
    await createDescription(item);
    return;
  }

  userStore.setCredit(description.credit);
  find.gpt_description = description.content;
  find.loading = false;
};

const createAllDescriptions = async () => {
  actionDisabled.value = true;
  progressValue.value = 0;
  createAllLoading.value = true;
  progressText.value = t("userPanel.main.allDescriptionCreating");

  const tempImages = clone<Array<GetImagesResponse>>(images.value).filter((e) => !e.loading);
  images.value.forEach((item) => (item.loading = true));
  console.log(images.value);

  const threadCount = 30; // Aynı anda açıklama oluşturma sayısı
  const totalImages = tempImages.length;
  const progressStep = 100 / totalImages;
  let currentProgress = 0;

  while (tempImages.length) {
    const items = tempImages.splice(0, threadCount);
    const promises: any[] = [];

    for (const item of items) {
      promises.push(
        createDescription(item).then(() => {
          currentProgress += progressStep;
          progressValue.value = Math.min(Math.round(currentProgress), 100);
        }),
      );
    }

    await Promise.all(promises);
  }

  actionDisabled.value = false;
  createAllLoading.value = false;
  toast.success(t("userPanel.main.allDescriptionCreated"));
};

onMounted(async () => {
  const bootstrap = await import("bootstrap");
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));

  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  eventBus.on("fetchImagesCompleted", async () => {
    await nextTick();
    progressText.value = t("userPanel.main.scrapeSuccess");
  });
});
</script>

<style lang="scss" scoped>
.description-wrapper {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #000;

  .description {
    white-space: pre-wrap;
    margin-bottom: 1.25rem;
  }

  .description:last-child {
    margin-bottom: 0;
  }
}
</style>
