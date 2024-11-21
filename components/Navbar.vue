<!-- Navbar.vue -->
<template>
  <ul class="menu-inner py-1">
    <NavItem
      v-for="(item, index) in menuItems"
      :key="index"
      :item="item"
      :index="index"
      :is-open="isOpen(index)"
      :is-active="isActive(index)"
      @toggle-menu="toggleMenu"
    />
  </ul>
</template>

<script setup lang="ts">
export interface MenuItem {
  label: string;
  icon: string;
  to?: string;
  subItems?: MenuItem[];
}

defineProps<{
  menuItems: MenuItem[];
}>();

const toggleMenu = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const activeIndex = ref<number | null>(null);
const openIndex = ref<number | null>(null);

const isOpen = (index: number) => openIndex.value === index;
const isActive = (index: number) => activeIndex.value === index;
</script>
