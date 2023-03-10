<template>
  <div>
    <header>
      <HTab></HTab>
    </header>
    <section>
      <RouterView v-slot="{ Component }">
        <keep-alive>
          <component :is="Component"></component>
        </keep-alive>
      </RouterView>
    </section>
  </div>
</template>

<script lang="ts">
import HTab from '@/components/tab/HTab.vue';

export default {
  components: {
    HTab
  }
};
</script>

<style scoped lang="scss">
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  background-color: var(--color-background);
}

section {
  margin-top: 2.5rem;
}
</style>
