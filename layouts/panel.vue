<template>
  <div class="layout-wrapper layout-content-navbar">
    <div class="layout-container">
      <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
        <div class="app-brand demo">
          <NuxtLink class="app-brand-link" to="/panel">
            <img src="../assets/img/logo.png" width="50" height="50" alt="Logo" class="logo" />
            <span class="app-brand-text demo menu-text fw-bold">RichContent AI</span>
          </NuxtLink>
        </div>

        <div class="menu-inner-shadow"></div>
        <Navbar :menu-items="menuItems" />
      </aside>
      <div class="layout-page">
        <Topbar />
        <div class="content-wrapper">
          <NuxtPage />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();
const store = useUserStore();

const menuItems = ref([
  {
    label: t("menu.home"),
    icon: "bx bx-home-alt-2",
    to: "/panel",
  },
  {
    label: t("menu.history"),
    icon: "bx bxs-report",
    to: "/panel/history",
  },
  {
    label: t("menu.information"),
    icon: "bx bx-user",
    to: "/panel/information",
  },
  {
    label: t("menu.logout"),
    icon: "bx bx-exit me-2",
    to: "/auth/logout",
  },
]);

onMounted(() => {
  if (store.role === "admin") {
    menuItems.value.splice(-1, 0, {
      label: t("menu.adminPanel"),
      icon: "bx bxs-data",
      to: "/admin",
    });
  }
});
</script>
