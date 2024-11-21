<template>
  <div :class="['badge', `bg-label-${type}`]"><slot /></div>
</template>

<script setup lang="ts">
type Badges = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "dark";

defineProps({
  type: {
    type: String as () => Badges,
    default: "primary",
  },
});
</script>
