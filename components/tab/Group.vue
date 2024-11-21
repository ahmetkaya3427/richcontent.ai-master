<template>
  <div>
    <div :id class="nav nav-pills flex-column flex-md-row mb-4">
      <div class="d-flex align-items-center w-100 gap-3">
        <slot name="tab-button" />
      </div>
    </div>
    <div v-auto-animate>
      <slot name="tab-content" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  isActive: boolean;
}

const id = Math.random().toString(36).substr(2, 9);
const tabs = ref<Tab[]>([]);
const activeIndex = ref<number>(0);

provide("activeIndex", activeIndex);
provide("registerTab", (tab: Tab, index: number) => {
  tabs.value[index] = tab;
});

const changeTab = (index: number) => {
  activeIndex.value = index;
  tabs.value.forEach((tab, i) => {
    if (tab) {
      tab.isActive = i === index;
    }
  });
};

onMounted(() => {
  const initialIndex = tabs.value.findIndex((tab) => tab?.isActive);
  changeTab(Math.max(initialIndex, 0));
});
</script>
