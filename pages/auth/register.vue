<template>
  <div class="container-xxl">
    <div class="authentication-wrapper authentication-basic container-p-y">
      <div class="authentication-inner">
        <Card>
          <template #body>
            <h4 class="mb-2">{{ $t("auth.register.title") }}</h4>
            <p class="mb-4">{{ $t("auth.register.description") }}</p>

            <div class="row">
              <div class="col-6">
                <FormInput v-model="form.name" class="mb-4" :label="$t('auth.register.fields.name')" />
              </div>
              <div class="col-6">
                <FormInput v-model="form.surname" class="mb-4" :label="$t('auth.register.fields.surname')" />
              </div>
              <div class="col-12">
                <FormInput v-model="form.username" class="mb-4" :label="$t('auth.register.fields.username')" />
              </div>
              <div class="col-12">
                <FormInput v-model="form.email" class="mb-4" :label="$t('auth.register.fields.email')" />
              </div>
              <div class="col-12">
                <FormInput v-model="form.phone" class="mb-4" :label="$t('auth.register.fields.phone')" />
              </div>
              <div class="col-6">
                <FormInput
                  v-model="form.password"
                  class="mb-4"
                  type="password"
                  :label="$t('auth.register.fields.password')"
                />
              </div>
              <div class="col-6">
                <FormInput
                  v-model="repeatPassword"
                  class="mb-4"
                  type="password"
                  :label="$t('auth.register.fields.repeatPassword')"
                />
              </div>
            </div>

            <FormButton class="d-grid w-100 mb-4" @click="register">{{ $t("auth.register.title") }}</FormButton>

            <p class="text-center mb-0">
              <span> {{ $t("auth.accountExists") }} </span>
              <NuxtLink to="/auth/login">
                <span> {{ $t("auth.login.title") }} </span>
              </NuxtLink>
            </p>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import "~/assets/sneat/vendor/css/pages/page-auth.css";

const { $toast } = useNuxtApp();
const { t } = useI18n();
const router = useRouter();

useSeoMeta({ title: "Kayıt Ol - Rich Content" });

const form = ref({
  name: "",
  surname: "",
  email: "",
  phone: "",
  username: "",
  password: "",
});

const repeatPassword = ref("");

const register = async () => {
  const emptyFields = Object.values(form.value).some((value) => !value.trim());

  if (emptyFields) {
    return $toast.error(t("auth.fillFields"));
  }

  if (form.value.password !== repeatPassword.value) {
    return $toast.error(t("auth.register.matchPasswordError"));
  }

  const body = clone(form.value);

  const response = await useFetch("/api/auth/register", {
    method: "POST",
    body,
  });

  if (!response.data.value) {
    return $toast.error(response.error.value?.data.message);
  }

  $toast.success(t("auth.register.success"));
  router.push("/panel");
};
</script>
