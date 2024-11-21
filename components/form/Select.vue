<template>
  <div>
    <label v-if="label" class="form-label">{{ label }}</label>
    <div ref="select" :class="['custom-select', { active }, addClass]">
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
  placeholder: { type: String, default: "" },
  modelValue: { type: [String, Boolean, Number], default: "" },
  addClass: { type: String, default: "" },
});

const active = ref(false);
const options = ref([] as any[]);
const currentLabel = ref("");
const select = ref(null) as any;
const emits = defineEmits(["update:modelValue"]);

watch(
  options.value,
  () => {
    const find = options.value.find((option) => option.selected);

    if (find) {
      currentLabel.value = find.label;
      return updateValue(find.value);
    }

    currentLabel.value = props.label || props.placeholder;
  },
  { deep: true },
);

onMounted(() => {
  if (options.value.length === 0) {
    return (currentLabel.value = props.placeholder || t("global.selectLabel"));
  }
});

const pushOption = (option: any) => {
  const index = options.value.push(option);
  if (option.value === props.modelValue) selectOption(option.key.value);
  return index;
};

const convertValue = (value: any) => {
  if (value === "true") value = true;
  if (value === "false") value = false;
  return value;
};

const updateValue = (value: any) => {
  const convert = convertValue(value);
  emits("update:modelValue", convert);
};

const selectOption = (index: number) => {
  active.value = false;
  options.value.forEach((option) => {
    if (option.key !== index) {
      return (option.selected = false);
    }

    option.selected = true;
    updateValue(option.value);
  });
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
