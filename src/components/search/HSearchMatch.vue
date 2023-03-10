<template>
  <div>
    <HSongList :songs="matchSongs" />
  </div>
</template>

<script lang="ts">
import { querySearchMatch } from '@/services/api';
import type { Song } from '@/services/interface';
import { defineComponent, ref, watch } from 'vue';
import HSongList from '@/components/song/HSongList.vue';
import { storage } from '@/utils/storage';
import { SEARCH_KEY } from '@/config/constant';
import type { SearchHistory } from './HSearchHistory.vue';

export default defineComponent({
  components: { HSongList },
  props: {
    query: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const matchSongs = ref<Song[]>([]);
    const searchMatchLoading = ref(false);

    const getSearchMatch = async (keywords: string) => {
      searchMatchLoading.value = true;
      try {
        const res = await querySearchMatch({ keywords });
        matchSongs.value = res.result.songs;
      } catch (error) {
        console.error(error);
      }
      searchMatchLoading.value = false;
    };

    const saveSearchHistory = (keywords: string) => {
      const data = storage.get(SEARCH_KEY) as SearchHistory[];
      const list = data ? data : [];
      const searchItem = { first: keywords };
      list.unshift(searchItem);
      storage.set(SEARCH_KEY, list, null);
    };

    watch(
      () => props.query,
      (val: string) => {
        getSearchMatch(val);
        saveSearchHistory(val);
      },
      { immediate: true }
    );

    return { matchSongs };
  }
});
</script>

<style scoped></style>
