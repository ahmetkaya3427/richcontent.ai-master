<template>
  <div class="container-xxl">
    <div class="authentication-wrapper authentication-basic container-p-y">
      <div class="authentication-inner">
        <Card>
          <template #body>
            <h4 class="mb-2">{{ $t("auth.login.title") }}</h4>
            <p class="mb-4">{{ $t("auth.login.description") }}</p>

            <FormInput v-model="form.username" class="mb-4" :label="$t('auth.login.extra.username')" />
            <FormInput
              v-model="form.password"
              class="mb-4"
              :label="$t('auth.login.extra.password')"
              type="password"
              @keyup.enter="login"
            />
            <FormButton class="d-grid w-100 mb-4" @click="login">{{ $t("auth.login.title") }}</FormButton>

            <p class="text-center mb-0">
              <span> {{ $t("auth.accountNotExists") }} </span>
              <NuxtLink to="/auth/register">
                <span> {{ $t("auth.register.title") }} </span>
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
useSeoMeta({ title: "Giriş Yap - Rich Content" });

const { $toast } = useNuxtApp();
const { t } = useI18n();
const router = useRouter();

const form = ref({
  username: "",
  password: "",
});

const login = async () => {
  const emptyFields = Object.values(form.value).some((value) => !value.trim());

  if (emptyFields) {
    return $toast.error(t("auth.fillFields"));
  }

  const body = clone(form.value);

  const response = await useFetch("/api/auth/login", {
    method: "POST",
    body,
  });

  if (!response.data.value) {
    return $toast.error(response.error.value?.data.message);
  }

  $toast.success(t("auth.login.success"));
  router.push("/panel");
};
</script>
