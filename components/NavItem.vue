<template>
  <li :class="{ 'menu-item': true, open: isOpen, active: isActive }">
    <NuxtLink
      :class="{ 'menu-link': true, 'menu-toggle': item.subItems?.length }"
      :to="item.to"
      @click.prevent="handleClick"
    >
      <i :class="`menu-icon tf-icons ${item.icon}`"></i>
      <div>{{ item.label }}</div>
    </NuxtLink>
    <ul v-if="item.subItems" class="menu-sub">
      <NavItem
        v-for="(subItem, subIndex) in item.subItems"
        :key="subIndex"
        :item="subItem"
        :index="subIndex"
        :is-open="false"
        :is-active="false"
      />
    </ul>
  </li>
</template>

<script setup lang="ts">
import type { MenuItem } from "./Navbar.vue";

interface NavItem {
  item: MenuItem;
  index: number;
  isOpen: boolean;
  isActive: boolean;
}

const props = defineProps<NavItem>();
const emit = defineEmits(["toggle-menu"]);

const handleClick = () => {
  if (props.item.subItems?.length) {
    emit("toggle-menu", props.index);
  }
};
</script>

<style scoped>
.menu-link {
  cursor: pointer;
}
</style>
