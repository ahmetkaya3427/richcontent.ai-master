<template>
  <ul ref="dropdownRef" class="dropdown-menu dropdown-menu-end" :class="{ show: active }" @click.stop>
    <slot />
  </ul>
</template>

<script setup lang="ts">
import useClickOutside from "~/composables/clickOutside";
const props = defineProps({
  active: {
    type: Boolean,
    default: false,
  },
});

const dropdownRef = ref<HTMLElement | null>(null);

watch(
  () => props.active,
  (newVal) => {
    active.value = newVal;
  },
);

const active = ref(props.active);

useClickOutside(dropdownRef, () => {
  active.value = false;
});
</script>
