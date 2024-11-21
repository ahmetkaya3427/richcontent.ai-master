<template>
  <div class="row">
    <div class="col-6">
      <FormInput v-model="data.name" class="mb-4" :label="$t('adminPanel.users.extra.name')" />
    </div>
    <div class="col-6">
      <FormInput v-model="data.surname" class="mb-4" :label="$t('adminPanel.users.extra.surname')" />
    </div>
    <div class="col-6">
      <FormInput v-model="data.email" class="mb-4" :label="$t('adminPanel.users.extra.email')" />
    </div>
    <div class="col-6">
      <FormInput v-model="data.phone" class="mb-4" :label="$t('adminPanel.users.extra.phone')" />
    </div>
    <div class="col-6">
      <FormInput v-model="data.username" class="mb-4" :label="$t('adminPanel.users.extra.username')" />
    </div>
    <div class="col-6">
      <FormInput v-model="data.password" class="mb-4" type="password" :label="$t('adminPanel.users.extra.password')" />
    </div>
    <div class="col-6">
      <FormInput v-model="data.credit" class="mb-4" type="number" :label="$t('adminPanel.users.extra.credit')" />
    </div>
    <div class="col-6">
      <FormSelect v-model="data.role" :label="$t('adminPanel.users.extra.role')" class="mb-4" :multiple="false">
        <FormOption value="user">{{ $t("role.user") }}</FormOption>
        <FormOption value="admin">{{ $t("role.admin") }}</FormOption>
      </FormSelect>
    </div>
  </div>
  <div class="d-flex justify-content-end">
    <FormButton size="btn-md" @click="createUser">{{ $t("global.create") }}</FormButton>
  </div>
</template>

<script setup lang="ts">
const { $toast } = useNuxtApp();
const { t } = useI18n();

const emit = defineEmits(["close"]);

const data = ref({
  name: "",
  surname: "",
  email: "",
  phone: "",
  username: "",
  password: "",
  credit: 0,
  role: "",
});

const createUser = async () => {
  const body = clone(data.value);

  const response = await useFetch("/api/admin/users", {
    method: "POST",
    body,
  });

  if (!response.data.value) {
    return $toast.error(t("adminPanel.users.createError"));
  }

  $toast.success(t("adminPanel.users.createSuccess"));
  emit("close");
};
</script>
