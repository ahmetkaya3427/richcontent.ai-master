<template>
  <div class="card">
    <h5 v-if="$slots.header" class="card-header" :class="headerClass" :style="headerStyle">
      <slot name="header" />
    </h5>
    <div v-if="inBody" class="card-body" :class="bodyClass" :style="bodyStyle">
      <slot name="body" />
    </div>
    <div v-else>
      <slot name="body" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  headerClass: { type: String, default: "" },
  headerStyle: { type: String, default: "" },
  bodyClass: { type: String, default: "" },
  bodyStyle: { type: String, default: "" },
  inBody: { type: Boolean, default: true },
});
</script>
