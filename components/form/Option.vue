<template>
  <div class="v-option" :class="{ selected }" @click="clickOption">
    <slot />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  value: {
    type: [String, Boolean, Number],
    default: "",
  },
  selected: {
    type: Boolean,
    default: false,
  },
});

const instance = getCurrentInstance();
const pushOption = inject<Function>("pushOption");
const selectOption = inject<Function>("selectOption");

const key = ref(0);
const label = ref("");
const selected = ref(props.selected);

onBeforeMount(() => {
  if (instance && instance.slots.default) label.value = instance.slots.default()[0].children as string;
  if (pushOption) key.value = pushOption({ ...props, key, selected, label });
});

const clickOption = () => {
  if (selectOption) selectOption(key.value, true);
};
</script>
