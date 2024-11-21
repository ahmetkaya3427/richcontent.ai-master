<template>
  <li class="nav-item w-100">
    <button class="nav-link" :class="{ active: isActive }" @click="tabClick">
      <slot />
    </button>
  </li>
</template>

<script setup lang="ts">
interface Tab {
  isActive: boolean;
}

const props = defineProps({
  index: {
    type: Number,
    default: -1,
  },
});

const activeIndex = inject<Ref<number>>("activeIndex");
const registerTab = inject<(tab: Tab, index: number) => void>("registerTab");
const isActive = computed(() => (activeIndex ? props.index === activeIndex.value : false));

const tabClick = () => {
  if (props.index === -1) return;
  if (registerTab && activeIndex) {
    registerTab({ isActive: true }, props.index);
    activeIndex.value = props.index;
  }
};

if (activeIndex) {
  watch(activeIndex, (newIndex) => {
    if (registerTab) {
      registerTab({ isActive: props.index === newIndex }, props.index);
    }
  });
}
</script>
