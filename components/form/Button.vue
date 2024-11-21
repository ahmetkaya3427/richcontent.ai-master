<template>
  <button
    :class="['btn', size, { disabled }, color, { 'btn-icon': icon }]"
    :disabled="disabled || loading"
    type="button"
  >
    <template v-if="loading">
      <span class="spinner-border me-2" role="status" aria-hidden="true"></span>
      <slot />
    </template>
    <template v-else>
      <slot />
    </template>
  </button>
</template>

<script lang="ts" setup>
type ButtonSize = "btn-xl" | "btn-lg" | "btn-md" | "btn-sm" | "btn-xs";
type ButtonColor =
  | "btn-primary"
  | "btn-secondary"
  | "btn-success"
  | "btn-danger"
  | "btn-warning"
  | "btn-info"
  | "btn-dark";

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as () => ButtonSize,
    required: false,
    default: "btn-md",
  },
  color: {
    type: String as () => ButtonColor,
    required: false,
    default: "btn-primary",
  },
  icon: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
</script>
