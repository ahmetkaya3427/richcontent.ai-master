<template>
  <div>
    <input
      v-model="inputValue"
      :checked="modelValue"
      class="form-check-input"
      type="checkbox"
      @change="$emit('change', inputValue)"
    />
    <label class="form-check-label">
      <slot />
    </label>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["update:modelValue", "change"]);

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emits("update:modelValue", value),
});
</script>
