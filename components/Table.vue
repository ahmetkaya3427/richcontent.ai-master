<template>
  <div class="table-responsive text-nowrap">
    <table class="table table-hover">
      <caption class="me-4">
        <div class="d-flex justify-content-end gap-3 mt-3 mb-2">
          <FormButton :disabled="loading || page === 1" size="btn-md" @click="previousPage">Önceki</FormButton>
          <FormButton :disabled="loading || page === pageCount" size="btn-md" @click="nextPage">Sonraki</FormButton>
        </div>
      </caption>
      <slot />
    </table>
  </div>
</template>

<script setup lang="ts">
const { $toast } = useNuxtApp();

interface GetDataResponse {
  data: any;
  pageCount: number;
  totalCount: number;
}

const total = ref(0);
const pageCount = ref(0);
const loading = ref(false);
const page = ref(1);
const emits = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  list: {
    type: String,
    required: true,
  },
  body: {
    type: Object,
    default: () => ({}),
  },
});

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emits("update:modelValue", value),
});

const getData = async (page = 1) => {
  loading.value = true;
  const response = await useFetch<GetDataResponse>(props.list, {
    method: "GET",
    params: { page, ...props.body },
  });

  if (!response.data.value) {
    $toast.error("Tablo verileri çekilemedi.");
    loading.value = false;
    return;
  }

  pageCount.value = Math.ceil(response.data.value.totalCount / response.data.value.pageCount);
  total.value = response.data.value.totalCount;
  loading.value = false;
  modelValue.value = response.data.value.data || [];
};

const previousPage = () => {
  if (page.value > 1) {
    page.value--;
    getData(page.value);
  }
};

const nextPage = () => {
  if (page.value < pageCount.value) {
    page.value++;
    getData(page.value);
  }
};

const refresh = () => {
  getData(page.value);
};

defineExpose({ refresh });
await getData(page.value);
</script>
