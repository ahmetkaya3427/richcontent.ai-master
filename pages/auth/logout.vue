<template>
  <div></div>
</template>

<script setup lang="ts">
const store = useUserStore();
store.reset();

const token = useCookie("token");
token.value = null;
window.location.href = "/auth/login";
</script>
