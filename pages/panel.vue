<template>
  <NuxtPage />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "panel",
  middleware: "auth",
});
</script>
