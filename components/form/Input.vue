<template>
  <div>
    <label v-if="label" class="form-label">{{ label }}</label>
    <input
      v-model="inputValue"
      class="form-control"
      :type="type"
      :placeholder="placeholder || label"
      :disabled="disabled"
      @change="$emit('change', inputValue)"
      @keypress="$emit('keypress', inputValue)"
      @keyup="$emit('keyup', $event)"
      @keydown="$emit('keydown', $event)"
      @keyup.enter="handleEnter"
    />
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
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update:modelValue", "change", "keypress", "keyup", "keydown", "enter"]);

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emits("update:modelValue", value),
});

function handleEnter() {
  emits("enter", inputValue.value);
}
</script>
