<template>
  <div>
    <div class="img-container">
      <img :src="picUrl" alt="" />
    </div>
    <HSimpleSongList :list="hotSongs" :show-title="true" title="热门歌曲" />
  </div>
</template>

<script lang="ts">
import { queryArtistTopSong } from '@/services/api';
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import HSimpleSongList from '@/components/song/HSimpleSongList.vue';
import type { SimpleSong } from '@/services/interface';

export default defineComponent({
  components: { HSimpleSongList },
  setup() {
    const route = useRoute();

    const hotSongs = ref<SimpleSong[]>([]);

    const picUrl = ref<string>();

    const getArtistTopSong = async (id: string) => {
      try {
        const res = await queryArtistTopSong({ id });
        hotSongs.value = res.songs;
      } catch (error) {
        console.error(error);
      }
    };

    onMounted(() => {
      const query = route.query;
      const id = query['id'] as string;
      const avatar = query['avatar'] as string;
      if (id) {
        getArtistTopSong(id);
      }
      if (avatar) {
        picUrl.value = avatar;
      }
    });

    return { picUrl, hotSongs };
  }
});
</script>

<style scoped lang="scss">
.img-container {
  position: relative;
  padding-bottom: 100%;

  img {
    width: 100%;
    float: left;
  }
}
</style>
