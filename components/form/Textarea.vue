<template>
  <div>
    <label v-if="label" class="form-label">{{ label }}</label>
    <textarea
      v-model="value"
      class="form-control"
      :type="type"
      :placeholder="placeholder || label"
      :style="`height: ${height}px`"
      @change="$emit('change', value)"
      @keypress="$emit('keypress', value)"
      @keyup="$emit('keyup', value)"
      @keydown="$emit('keydown', value)"
      @keyup.enter="$emit('enter', value)"
    ></textarea>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  height: {
    type: Number,
    default: 225,
  },
});

const emits = defineEmits(["update:modelValue", "change", "keypress", "keyup", "keydown", "enter"]);

const value = computed({
  get: () => props.modelValue,
  set: (value) => emits("update:modelValue", value),
});
</script>
