<template>
  <EditorToolbarBox
    :text="$t('toolbar.line_height')"
    icon="i-ic:round-format-line-spacing"
  >
    <SharedUiSlider
      :disabled="disabled"
      :model-value="modelValue"
      :min="1"
      :max="2"
      :step="0.05"
      @update:model-value="
        (value) => {
          modelValue = value!;
          setStyle('lineHeight', value!.at(0)!);
        }
      "
    />
  </EditorToolbarBox>
</template>

<script lang="ts" setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
});
const { styles, setStyle } = useStyleStore();

const modelValue = ref([styles.lineHeight]);
</script>
