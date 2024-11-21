<template>
  <div class="text-center mb-2">{{ modelText }} ({{ modelValue }}%)</div>
  <div class="progress mb-4" :style="{ height: `${height}px` }">
    <div
      :class="['progress-bar', { 'bg-success': modelValue >= 100 }]"
      role="progressbar"
      :style="{ width: `${modelValue}%` }"
      :aria-valuenow="modelValue"
      aria-valuemin="0"
      aria-valuemax="100"
    />
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(["update:modelValue", "update:text"]);

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: false,
    default: "",
  },
});

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emits("update:modelValue", value),
});

const modelText = computed({
  get: () => props.text,
  set: (value) => emits("update:text", value),
});
</script>
