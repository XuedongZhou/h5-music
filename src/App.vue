<template>
  <RouterView :style="viewStyle" />
  <HPlayer />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { RouterView } from 'vue-router';
import HPlayer from '@/components/player/HPlayer.vue';
import { usePlayerStore } from '@/stores/player';

export default defineComponent({
  components: { HPlayer, RouterView },
  setup() {
    const store = usePlayerStore();
    const playlist = computed(() => store.state.value.playlist);

    const viewStyle = computed(() => {
      const bottom = playlist.value.length ? '60px' : 0;

      return { bottom, paddingBottom: bottom };
    });

    return { viewStyle };
  }
});
</script>

<style scoped></style>
