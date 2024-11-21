<template>
  <Transition>
    <div
      v-if="isVisible"
      class="modal fade show d-block"
      style="display: block; background: rgba(0, 0, 0, 0.5)"
      @click.self="closeModal"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface ModalOptions {
  visible: boolean;
  title: String;
}

const props = defineProps<ModalOptions>();
const emit = defineEmits(["update:visible"]);
const isVisible = ref(props.visible);

const closeModal = () => {
  emit("update:visible", false);
};

watch(
  () => props.visible,
  (newValue) => {
    isVisible.value = newValue;
  },
);
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
