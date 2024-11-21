<template>
  <Card header-class="d-flex align-items-center justify-content-between">
    <template #header>
      <span>{{ $t("userPanel.tabs.link.title") }}</span>
      <div class="d-flex gap-2">
        <FormBadge>
          {{ $t("userPanel.tabs.link.totalCount") }}: {{ links.split("\n").filter((e) => e).length }}
        </FormBadge>
        <FormBadge>{{ $t("userPanel.tabs.link.scrapeCount") }}: {{ images.length }}</FormBadge>
        <FormBadge>
          {{ $t("userPanel.tabs.link.descriptionCount") }}:
          {{ images.filter((e) => e.gpt_description).length }}
        </FormBadge>
      </div>
    </template>
    <template #body>
      <div class="mb-4">
        <FormTextarea v-model="links" :label="$t('userPanel.tabs.link.productList')" />
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
        <FormButton color="btn-success" :disabled="actionDisabled" :loading="getImagesLoading" @click="fetchImages">
          {{ $t("userPanel.tabs.link.getImages") }}
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
const userStore = useUserStore();
defineEmits(["createDescriptions", "exportDescriptions"]);

const links = inject<Ref<string>>("links")!;
const images = inject<Ref<Array<GetImagesResponse>>>("images")!;
const prompts = inject<Ref<GetPromptsResponse>>("prompts")!;
const languages = inject<Ref<GetLanguagesResponse>>("languages")!;

// Select
const selectedPrompt = inject<Ref<string>>("selectedPrompt")!;
const selectedLanguage = inject<Ref<string>>("selectedLanguage")!;

// Progress
const progressText = inject<Ref<string>>("progressText")!;
const progressValue = inject<Ref<number>>("progressValue")!;
const progressDisabled = inject<Ref<boolean>>("progressDisabled")!;

// Loading
const getImagesLoading = inject<Ref<boolean>>("getImagesLoading")!;
const createAllLoading = inject<Ref<boolean>>("createAllLoading")!;

// Action
const actionDisabled = inject<Ref<boolean>>("actionDisabled")!;

// Computeds
const splittedLinks = computed(() => links.value.split("\n").filter((e) => e));
const imageCount = computed(() => images.value.length);

const getProgressText = () =>
  `${t("userPanel.main.productsFetching")} ${imageCount.value}/${splittedLinks.value.length}`;

watch(imageCount, () => {
  progressText.value = getProgressText();
});

const getProductImages = async (url: string) => {
  const body = clone({
    url,
    language: selectedLanguage.value,
    prompt_id: selectedPrompt.value,
  });

  try {
    const response = await fetchWithTimeout("/api/panel/get-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      timeout: 300000,
    });

    const image = await response.json();
    images.value = [...images.value, image];
    return image;
  } catch (error) {
    console.log("Get product images error:", error);
    return false;
  }
};

const fetchImages = async () => {
  if (!splittedLinks.value.length) return toast.error(t("userPanel.main.imageCountError"));
  if (!userStore.credit) return toast.error(t("userPanel.main.insufficientCredit"));
  if (!selectedPrompt.value) return toast.error(t("userPanel.tabs.selectPromptError"));
  if (!selectedLanguage.value) return toast.error(t("userPanel.tabs.selectLanguageError"));

  images.value = [];
  progressValue.value = 0;
  actionDisabled.value = true;
  getImagesLoading.value = true;

  await nextTick();
  progressDisabled.value = true;
  toast.info(t("userPanel.tabs.link.productsFetching"));
  progressText.value = getProgressText();

  const tempUrls = clone(splittedLinks.value) as typeof splittedLinks.value;
  const totalCount = tempUrls.length;
  const threadCount = 20; // Aynı anda resim çekme sayısı
  const progressIncrease = 100 / totalCount;

  let currentProgress = 0;

  while (tempUrls.length) {
    const urls = tempUrls.splice(0, threadCount);
    const promises: any[] = [];

    for (const url of urls) {
      promises.push(
        getProductImages(url).then(() => {
          currentProgress += progressIncrease;
          progressValue.value = Math.min(Math.round(currentProgress), 100);
        }),
      );
    }

    await Promise.all(promises);
  }

  actionDisabled.value = false;
  getImagesLoading.value = false;

  await nextTick();
  toast.success(t("userPanel.tabs.link.scrapeSuccess"));
  eventBus.emit("fetchImagesCompleted");
};
</script>
