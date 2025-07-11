<template>
  <div class="flex w-72 h-full">
    <div
      id="toolbar"
      class="pane-container overflow-y-scroll hide-scrollbar bg-background"
      lt-lg="bg-accent rounded-none"
    >
      <template v-for="(tool, i) in availableTools" :key="tool.id">
        <component :is="tool.component" :id="`toolbar-${tool.id}`" />
        <UiSeparator v-if="i < tools.length - 1" class="w-[calc(100%-32px)] mx-auto" />
      </template>
    </div>

    <div flex="center col none gap-1" border="l dashed lg:none" w-10 bg-accent>
      <template v-for="tool in availableTools" :key="tool.id">
        <UiTooltipProvider :delay-duration="0">
          <UiTooltip>
            <UiTooltipTrigger as-child>
              <UiButton
                size="round"
                variant="ghost-secondary"
                @click="scrollTo(tool.id)"
                :aria-label="getTooltip(tool.id)"
              >
                <span :class="[tool.icon, ' size-4']" />
              </UiButton>
            </UiTooltipTrigger>
            <UiTooltipContent side="left">
              {{ getTooltip(tool.id) }}
            </UiTooltipContent>
          </UiTooltip>
        </UiTooltipProvider>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  EditorToolbarFile,
  EditorToolbarThemeColor,
  EditorToolbarFontFamily,
  EditorToolbarFontSize,
  EditorToolbarMargins,
  EditorToolbarParagraphSpace,
  EditorToolbarLineHeight,
  EditorToolbarCorrectCase
} from "#components";

const tools = [
  {
    id: "file",
    icon: "i-carbon:import-export",
    component: EditorToolbarFile,
    adminOnly: false
  },
  {
    id: "theme_color",
    icon: "i-material-symbols:palette-outline",
    component: EditorToolbarThemeColor,
    adminOnly: true
  },
  {
    id: "font_family",
    icon: "i-material-symbols:font-download-outline",
    component: EditorToolbarFontFamily,
    adminOnly: true
  },
  {
    id: "font_size",
    icon: "i-ri:font-size-2",
    component: EditorToolbarFontSize,
    adminOnly: true
  },
  {
    id: "margins",
    icon: "i-radix-icons:margin",
    component: EditorToolbarMargins,
    adminOnly: true
  },
  {
    id: "paragraph_spacing",
    icon: "i-icon-park-outline:paragraph-break-two",
    component: EditorToolbarParagraphSpace,
    adminOnly: true
  },
  {
    id: "line_height",
    icon: "i-ic:round-format-line-spacing",
    component: EditorToolbarLineHeight,
    adminOnly: true
  },
  {
    id: "correct_case",
    icon: "i-icon-park-outline:check-correct",
    component: EditorToolbarCorrectCase,
    adminOnly: false
  }
];

const userStore = useUserStore();
const availableTools = tools.filter((tool) => !tool.adminOnly || userStore.isAdmin);

const scrollTo = (id: string) => {
  const toolbar = document.querySelector<HTMLElement>("#toolbar");
  const section = document.querySelector<HTMLElement>(`#toolbar-${id}`);

  if (!toolbar || !section) return;

  toolbar.scrollTo({
    // offsetTop - header height
    top: section.offsetTop - 48,
    behavior: "smooth"
  });
};

const { t } = useI18n();

const getTooltip = (id: string) => {
  const key = `toolbar.${id}`;
  return ["file", "correct_case", "font_family", "margins"].includes(id)
    ? t(`${key}.title`)
    : t(key);
};
</script>
