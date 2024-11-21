<template>
  <CKEditor v-model="value" :editor="ClassicEditor" :config="editorConfig" @ready="onEditorReady"></CKEditor>
</template>

<script setup lang="ts">
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Heading,
  Undo,
  FontColor,
  FontSize,
  Autoformat,
  Autosave,
  type EditorConfig,
  type Editor,
} from "ckeditor5";

import editor from "@ckeditor/ckeditor5-vue";
import "ckeditor5/ckeditor5.css";

const CKEditor = editor.component;

const editorConfig: EditorConfig = {
  plugins: [Essentials, Bold, Italic, Heading, Undo, FontColor, FontSize, Autoformat, Autosave],
  toolbar: ["heading", "|", "bold", "italic", "|", "undo", "redo", "|", "fontColor", "fontSize"],
  autosave: {
    waitingTime: 2000,
    save(editor: Editor) {
      return new Promise<void>((resolve, reject) => {
        try {
          const data = editor.getData();
          saveCallback(data)
            .then(() => resolve())
            .catch((error) => reject(error));
        } catch (error) {
          reject(error);
        }
      });
    },
  },
};

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  autosaveCallback: {
    type: Function as PropType<(data: string) => Promise<void>>,
    default: () => Promise.resolve(),
  },
  title: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(["update:modelValue"]);

const value = computed({
  get: () => props.modelValue,
  set: (value) => emits("update:modelValue", value),
});

const saveCallback = props.autosaveCallback;

const onEditorReady = (editorInstance: Editor) => {
  // @ts-ignore
  const toolbar = editorInstance.ui.view.toolbar.element as HTMLElement;
  if (!toolbar) return;

  if (props.title) {
    const title = document.createElement("div");
    title.className = "ck-toolbar__title";
    title.innerText = props.title;
    toolbar.appendChild(title);
  }

  const otherItemsContainer = document.createElement("div");
  otherItemsContainer.className = "ck-toolbar__other";

  Array.from(toolbar.children).forEach((child) => {
    if (!props.title || child.className !== "ck-toolbar__title") {
      otherItemsContainer.appendChild(child);
    }
  });

  if (props.title) {
    toolbar.appendChild(otherItemsContainer);
  } else {
    toolbar.appendChild(otherItemsContainer);
  }
};
</script>

<style lang="scss">
.ck-editor__editable {
  min-height: 10px;
}

.ck-toolbar__items {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ck-toolbar__title {
  margin-right: auto;
}

.ck-toolbar__other {
  display: flex;
  gap: 10px;
}

.ck-toolbar_grouping {
  display: flex;
  justify-content: space-between;
  padding: 0 8px !important;
}
</style>
