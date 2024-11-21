<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <Card class="mb-4">
      <template #header> {{ $t("adminPanel.configs.addTitle") }} </template>
      <template #body>
        <div class="row">
          <div class="col-5">
            <div class="row">
              <div class="col-6">
                <FormInput v-model="data.name" class="mb-4" :label="$t('adminPanel.configs.extra.name')" />
              </div>
              <div class="col-6">
                <FormInput v-model="data.domain" class="mb-4" :label="$t('adminPanel.configs.extra.domain')" />
              </div>
              <div class="col-12">
                <FormTextarea v-model="urlList" class="mb-4" :label="$t('adminPanel.configs.extra.urlList')" />
              </div>
              <div class="col-6">
                <FormInput
                  v-model="data.min_width"
                  class="mb-4"
                  type="number"
                  :label="$t('adminPanel.configs.extra.minWidth')"
                />
              </div>
              <div class="col-6">
                <FormInput
                  v-model="data.max_width"
                  class="mb-4"
                  type="number"
                  :label="$t('adminPanel.configs.extra.maxWidth')"
                />
              </div>
              <div class="col-6">
                <FormInput
                  v-model="data.min_height"
                  class="mb-4"
                  type="number"
                  :label="$t('adminPanel.configs.extra.minHeight')"
                />
              </div>
              <div class="col-6">
                <FormInput
                  v-model="data.max_height"
                  class="mb-4"
                  type="number"
                  :label="$t('adminPanel.configs.extra.maxHeight')"
                />
              </div>
              <div class="col-6">
                <FormInput
                  v-model="data.min_size"
                  class="mb-4"
                  type="number"
                  :label="$t('adminPanel.configs.extra.minSize')"
                />
              </div>
              <div class="col-6">
                <FormInput
                  v-model="data.max_size"
                  class="mb-4"
                  type="number"
                  :label="$t('adminPanel.configs.extra.maxSize')"
                />
              </div>
              <div class="col-12">
                <FormTextarea
                  v-model="data.prompt"
                  :height="510"
                  class="mb-4"
                  :label="$t('adminPanel.configs.extra.prompt')"
                />
              </div>
            </div>
          </div>
          <div class="col-5">
            <div class="row">
              <div class="col-12">
                <FormMultiSelect
                  v-model="data.extensions"
                  :label="$t('adminPanel.configs.extensions')"
                  class="mb-4"
                  :multiple="false"
                >
                  <FormOption value="jpg">jpg</FormOption>
                  <FormOption value="png">png</FormOption>
                  <FormOption value="jpeg">jpeg</FormOption>
                  <FormOption value="webp">webp</FormOption>
                  <FormOption value="svg">svg</FormOption>
                  <FormOption value="avif">avif</FormOption>
                </FormMultiSelect>
              </div>
              <div class="col-4">
                <FormTextarea
                  v-model="data.include_xpath"
                  class="mb-4"
                  :label="$t('adminPanel.configs.extra.includeXpath')"
                />
              </div>
              <div class="col-4">
                <FormTextarea
                  v-model="data.include_selector"
                  class="mb-4"
                  :label="$t('adminPanel.configs.extra.includeSelector')"
                />
              </div>
              <div class="col-4">
                <FormTextarea
                  v-model="data.include_url"
                  class="mb-4"
                  :label="$t('adminPanel.configs.extra.includeUrl')"
                />
              </div>
              <div class="col-4">
                <FormTextarea
                  v-model="data.ignore_xpath"
                  class="mb-4"
                  :label="$t('adminPanel.configs.extra.ignoreXpath')"
                />
              </div>
              <div class="col-4">
                <FormTextarea
                  v-model="data.ignore_selector"
                  class="mb-4"
                  :label="$t('adminPanel.configs.extra.ignoreSelector')"
                />
              </div>
              <div class="col-4">
                <FormTextarea
                  v-model="data.ignore_url"
                  class="mb-4"
                  :label="$t('adminPanel.configs.extra.ignoreUrl')"
                />
              </div>
              <div class="col-6">
                <FormTextarea
                  v-model="data.description_xpath"
                  class="mb-4"
                  :label="$t('adminPanel.configs.extra.descriptionXpath')"
                />
              </div>
              <div class="col-6">
                <FormTextarea
                  v-model="data.description_selector"
                  class="mb-4"
                  :label="$t('adminPanel.configs.extra.descriptionSelector')"
                />
              </div>
              <div class="col-6">
                <FormTextarea
                  v-model="data.code_xpath"
                  class="mb-4"
                  :label="$t('adminPanel.configs.extra.codeXpath')"
                />
              </div>
              <div class="col-6">
                <FormTextarea
                  v-model="data.code_selector"
                  class="mb-4"
                  :label="$t('adminPanel.configs.extra.codeSelector')"
                />
              </div>
            </div>
          </div>
          <div class="col-2">
            <label class="form-label">{{ $t("adminPanel.configs.images") }}</label>
            <div class="images">
              <a v-for="(image, key) in images" :key="key" class="image" :href="image" target="_blank">
                <span class="key">{{ key }}</span>
                <img :src="image" alt="" />
              </a>
            </div>
          </div>
        </div>
        <FormTextarea v-model="results" :label="$t('adminPanel.configs.results')" class="mb-4" />
        <div class="d-flex gap-3">
          <FormButton size="btn-md" @click="createConfig">{{ $t("adminPanel.configs.saveConfig") }}</FormButton>
          <FormButton size="btn-md" :disabled="testDisabled" @click="testConfig">
            {{ $t("adminPanel.configs.testConfig") }}
          </FormButton>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
const { $toast } = useNuxtApp();
const { t } = useI18n();
const router = useRouter();

const testDisabled = ref(false);
const resultArray = ref<Record<string, any>>([]);
const results = ref("");

const urlList = ref("");
const data = ref({
  name: "",
  domain: "",
  min_width: 0,
  max_width: 9999999,
  min_height: 0,
  max_height: 9999999,
  min_size: 0,
  max_size: 9999999,
  include_url: "",
  include_xpath: "",
  include_selector: "",
  ignore_url: "",
  ignore_xpath: "",
  ignore_selector: "",
  extensions: [],
  prompt: "",
  description_xpath: "",
  description_selector: "",
  code_xpath: "",
  code_selector: "",
});

const images = ref([]);

const createConfig = async () => {
  if (!data.value.name) return $toast.error(t("adminPanel.configs.nameError"));
  if (!data.value.domain) return $toast.error(t("adminPanel.configs.domainError"));

  const body = clone(data.value);

  const response = await useFetch("/api/admin/configs", {
    method: "POST",
    body,
  });

  if (!response.data.value) {
    return $toast.error(t("adminPanel.configs.saveError"));
  }

  $toast.success(t("adminPanel.configs.saveMessage"));
  router.push("/admin/configs");
};

const testConfig = async () => {
  resultArray.value = [];
  testDisabled.value = true;
  $toast.info(t("adminPanel.configs.scraping"));

  const body = clone(data.value) as any;
  const urls = urlList.value.split("\n").filter((e) => e);

  for (const url of urls) {
    body.url = url;

    const response = await useFetch("/api/admin/configs/test", {
      method: "POST",
      body,
    });

    if (!response.data.value) continue;
    resultArray.value.push(response.data.value);
  }

  $toast.success(t("adminPanel.configs.scrapeSuccess"));
  testDisabled.value = false;
};

watch(
  resultArray,
  () => {
    results.value = JSON.stringify(resultArray.value, null, 4);
    images.value = resultArray.value.map((e: any) => e.images).flat();
  },
  { deep: true },
);
</script>
