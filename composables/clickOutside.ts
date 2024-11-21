export default function useClickOutside(
  component: Ref<HTMLElement | null>,
  callback: () => void,
  excludeComponent?: Ref<HTMLElement | null>,
) {
  if (!component) {
    throw new Error("A target component has to be provided.");
  }

  if (!callback) {
    throw new Error("A callback has to be provided.");
  }

  const listener = (event: MouseEvent) => {
    if (
      (component.value && (event.target === component.value || event.composedPath().includes(component.value))) ||
      (excludeComponent?.value &&
        (event.target === excludeComponent.value || event.composedPath().includes(excludeComponent.value)))
    ) {
      return;
    }

    if (typeof callback === "function") {
      callback();
    }
  };

  onMounted(() => {
    window.addEventListener("click", listener);
  });

  onUnmounted(() => {
    window.removeEventListener("click", listener);
  });
}
