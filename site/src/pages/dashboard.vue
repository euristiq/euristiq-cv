<template>
  <div id="dashboard-page">
    <SharedHeader />
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();
const localePath = useLocalePath();

const newAndSwitch = async () => {
  const existing = await storageService.getResumes();
  for (const item of existing) {
    await storageService.deleteResume(item.id);
  }
  const data = await storageService.createResume();

  if (!data) return;
  else await router.push(localePath(`/editor/${data.id}`));
};

onMounted(() => {
  newAndSwitch();
});
</script>
