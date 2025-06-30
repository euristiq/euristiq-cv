<template>
  <EditorToolbarBox
    :disabled="disabled"
    :text="$t('toolbar.paper_size')"
    icon="i-majesticons:paper-fold-line"
  >
    <SharedUiCombobox
      id="paper-size"
      class="capitalize"
      :items="items"
      :disabled="disabled"
      :default-value="styles.paper"
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
import type { ValidPaperSize } from "~/composables/constant";

const { styles, setStyle } = useStyleStore();
const { PAPER } = useConstant();

const items = Object.keys(PAPER.SIZES).map((paper) => ({
  label: paper,
  value: paper,
  onSelect: () => setStyle("paper", paper as ValidPaperSize)
}));
</script>
