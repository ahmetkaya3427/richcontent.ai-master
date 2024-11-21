<template>
  <div v-if="isActive">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  index: {
    type: Number,
    required: true,
  },
});

const activeIndex = inject<Ref<number>>("activeIndex");
const isActive = computed(() => props.index === activeIndex?.value);
</script>
