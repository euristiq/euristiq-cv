<template>
  <EditorToolbarBox :text="$t('toolbar.file.title')" icon="i-carbon:import-export">
    <EditorToolbarFileSave v-if="false"></EditorToolbarFileSave>
    <EditorToolbarFileRename v-if="false"></EditorToolbarFileRename>

    <EditorToolbarFileExport />

    <hr border-dashed my-2 />

    <EditorToolbarFileImport />
  </EditorToolbarBox>
</template>
