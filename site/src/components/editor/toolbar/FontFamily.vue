<template>
  <EditorToolbarBox
    :disabled="disabled"
    :text="$t('toolbar.font_family.title')"
    icon="i-material-symbols:font-download-outline"
  >
    <div class="hstack gap-x-2 w-full">
      <SharedUiCombobox
        v-if="loaded"
        id="font-en"
        class="flex-1"
        :disabled="disabled"
        :items="localEn.concat(gfEn)"
        :default-value="styles.fontEN.fontFamily || styles.fontEN.name"
      />
      <UiSkeleton :disabled="disabled" v-else class="flex-1 h-9" />
    </div>
  </EditorToolbarBox>
</template>

<script lang="ts" setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
});
import type { ComboboxItem } from "~/components/shared/ui/Combobox.vue";

const { styles, setStyle } = useStyleStore();
const { FONT } = useConstant();

const localEn = FONT.LOCAL.EN.map<ComboboxItem>((item) => {
  const family =
    FONT.LOCAL.EN.find((font) => font.name === item.name)?.fontFamily || item.name;

  return {
    label: item.name,
    value: family,
    onSelect: () => setStyle("fontEN", { name: item.name, fontFamily: family })
  };
});

// Setup Google Fonts
const loaded = ref(false);

const gfEn = ref<ComboboxItem[]>([]);

onMounted(async () => {
  const { en } = await googleFontsService.get();

  gfEn.value = en.map((font) => ({
    label: font.family,
    value: font.family,
    onSelect: () => setStyle("fontEN", { name: font.family })
  }));

  loaded.value = true;
});
</script>
