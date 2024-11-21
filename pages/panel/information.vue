<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <Card class="mb-4">
      <template #header> {{ $t("userPanel.information.information") }} </template>
      <template #body>
        <div class="row">
          <div class="col-6">
            <FormInput v-model="store.name" class="mb-4" :label="$t('userPanel.information.extra.name')" disabled />
          </div>
          <div class="col-6">
            <FormInput
              v-model="store.surname"
              class="mb-4"
              :label="$t('userPanel.information.extra.surname')"
              disabled
            />
          </div>
          <div class="col-6">
            <FormInput v-model="store.email" class="mb-4" :label="$t('userPanel.information.extra.email')" disabled />
          </div>
          <div class="col-6">
            <FormInput v-model="store.phone" class="mb-4" :label="$t('userPanel.information.extra.phone')" disabled />
          </div>
        </div>
      </template>
    </Card>
    <Card class="mb-4">
      <template #header> {{ $t("userPanel.information.changePassword") }} </template>
      <template #body>
        <FormInput
          v-model="data.oldPassword"
          type="password"
          class="mb-4"
          :label="$t('userPanel.information.extra.oldPassword')"
        />
        <div class="row">
          <div class="col-6">
            <FormInput
              v-model="data.newPassword"
              type="password"
              class="mb-4"
              :label="$t('userPanel.information.extra.newPassword')"
            />
          </div>
          <div class="col-6">
            <FormInput
              v-model="repeatPassword"
              type="password"
              class="mb-4"
              :label="$t('userPanel.information.extra.repeatPassword')"
            />
          </div>
        </div>
        <div class="d-flex justify-content-end">
          <FormButton size="btn-md" @click="changePassword">{{ $t("global.save") }}</FormButton>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
const { $toast } = useNuxtApp();
const { t } = useI18n();
const store = useUserStore();

useSeoMeta({
  title: t("menu.information"),
});

const data = ref({
  oldPassword: "",
  newPassword: "",
});

const repeatPassword = ref("");

const changePassword = async () => {
  if (data.value.newPassword !== repeatPassword.value) {
    return $toast.error(t("userPanel.information.passwordError"));
  }

  const body = clone(data.value);

  const response = await useFetch("/api/panel/information", {
    method: "PUT",
    body,
  });

  if (!response.data.value) {
    return $toast.error(response.error.value?.data.message);
  }

  $toast.success(t("userPanel.information.updateSuccess"));
};
</script>
