<template>
  <li>
    <div v-if="include" class="dropdown-item">
      <slot />
    </div>
    <template v-else>
      <slot />
    </template>
  </li>
</template>

<script setup lang="ts">
defineProps({
  include: {
    type: Boolean,
    default: true,
  },
});
</script>

<style lang="scss" scoped>
.dropdown-item {
  cursor: pointer;
}
</style>
