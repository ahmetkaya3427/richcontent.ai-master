<template>
  <nav
    id="layout-navbar"
    class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
  >
    <div id="navbar-collapse" class="navbar-nav-right d-flex align-items-center">
      <div class="navbar-nav align-items-center">
        <div class="nav-item d-flex align-items-center">
          <span>{{ $t("credit") }}: {{ store.credit }}</span>
        </div>
      </div>

      <ul class="navbar-nav flex-row align-items-center ms-auto gap-4">
        <FormSelect v-model="localeValue" placeholder="Bir dil seçin">
          <FormOption value="tr">Türkçe</FormOption>
          <FormOption value="en">İngilizce</FormOption>
        </FormSelect>
        <li class="nav-item navbar-dropdown dropdown-user dropdown" @click="toggleDropdown">
          <a class="nav-link dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
            <div class="avatar avatar-online">
              <img src="../assets/sneat/img/avatars/1.png" class="w-px-40 h-auto rounded-circle" />
            </div>
          </a>
          <DropdownGroup :active="isActive">
            <DropdownItem>
              <div class="d-flex">
                <div class="flex-shrink-0 me-3 d-flex align-items-center">
                  <div class="avatar avatar-online">
                    <img src="../assets/sneat/img/avatars/1.png" class="w-px-40 h-auto rounded-circle" />
                  </div>
                </div>
                <div class="flex-grow-1">
                  <span class="fw-medium d-block">{{ store.name }} {{ store.surname }}</span>
                  <small class="text-muted">{{ store.role === "admin" ? $t("role.admin") : $t("role.user") }}</small>
                </div>
              </div>
            </DropdownItem>
            <DropdownItem :include="false">
              <div class="dropdown-divider"></div>
            </DropdownItem>
            <DropdownItem :include="false">
              <NuxtLink to="/auth/logout" class="dropdown-item">
                <i class="bx bx-exit me-2"></i>
                <span class="align-middle">{{ $t("menu.logout") }}</span>
              </NuxtLink>
            </DropdownItem>
          </DropdownGroup>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
const store = useUserStore();
const isActive = ref(false);
const { setLocale, locale } = useI18n();

const localeValue = ref(locale.value);

const toggleDropdown = (event: MouseEvent) => {
  event.stopPropagation();
  isActive.value = !isActive.value;
};

watch(localeValue, async (newLocale) => {
  await setLocale(newLocale);

  if (import.meta.client) {
    window.location.reload();
  }
});
</script>
