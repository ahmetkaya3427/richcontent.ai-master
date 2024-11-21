<template>
  <div>
    <label class="form-label">{{ label }}</label>
    <div ref="select" class="custom-select" :class="{ active }">
      <div class="selected-option" @click="toggleActive">
        <span>{{ currentLabel }}</span>
      </div>
      <div class="options">
        <slot />
        <div v-if="options.length === 0" class="no-options">{{ $t("global.selectLabel") }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

const props = defineProps({
  label: { type: String, default: "" },
  modelValue: { type: Array, default: () => [] },
});

const active = ref(false);
const options = ref([] as any[]);
const currentLabel = ref("");
const select = ref(null) as any;
const emits = defineEmits(["update:modelValue"]);

watch(
  options.value,
  () => {
    const selectedOptions = options.value.filter((option) => option.selected);

    if (selectedOptions.length > 1) {
      currentLabel.value = `${selectedOptions.length} seçildi`;
    } else {
      currentLabel.value = selectedOptions.length > 0 ? selectedOptions[0].label : t("global.selectLabel");
    }

    updateValue(selectedOptions.map((option) => option.value));
  },
  { deep: true },
);

onMounted(() => {
  if (options.value.length === 0) {
    return (currentLabel.value = t("global.selectLabel"));
  }
});

const pushOption = (option: any) => {
  const index = options.value.push(option);
  if (props.modelValue.includes(option.value)) selectOption(option.key.value, true);
  return index;
};

const convertValue = (value: any) => {
  if (value === "true") value = true;
  if (value === "false") value = false;
  return value;
};

const updateValue = (values: any[]) => {
  emits("update:modelValue", values.map(convertValue));
};

const selectOption = (index: number, multiple: boolean = false) => {
  const option = options.value.find((o) => o.key === index);
  if (!option) return;

  option.selected = multiple ? !option.selected : true;
  if (!multiple) {
    options.value.forEach((o) => {
      if (o.key !== index) o.selected = false;
    });
  }

  const selectedOptions = options.value.filter((o) => o.selected);
  updateValue(selectedOptions.map((o) => o.value));
};

provide("pushOption", pushOption);
provide("selectOption", selectOption);

const toggleActive = () => {
  active.value = !active.value;
};

const listener = (e: MouseEvent) => {
  const target = e.target as HTMLElement;

  if (select.value && !select.value.contains(target)) {
    active.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", listener);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", listener);
});
</script>
