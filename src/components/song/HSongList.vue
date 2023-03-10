<template>
  <div class="list">
    <div class="song" v-for="song in songs" :key="song.id" @click="() => addSong(song.id)">
      <div class="left">
        <div class="name">
          {{ song.name }}
          <span class="alias">{{ song.alias.length ? `（${song.alias[0]}）` : null }}</span>
        </div>
        <div class="desc">
          <div>
            <HTag v-if="song.sqMusic">SQ</HTag>
          </div>
          <div>{{ getSingerList(song.artists) }} - {{ song.album.name }}</div>
        </div>
      </div>
      <figure class="play">
        <HIcon icon="icon-play" />
      </figure>
    </div>
  </div>
</template>

<script lang="ts">
import type { Song } from '@/services/interface';
import { defineComponent, type PropType } from 'vue';
import HIcon from '@/components/icons/HIcon.vue';
import HTag from '@/components/tag/HTag.vue';
import { usePlayerStore } from '@/stores/player';
import { queryCheckMusic } from '@/services/api';

export default defineComponent({
  components: { HIcon, HTag },
  props: {
    songs: {
      type: Array as PropType<Song[]>,
      default: () => []
    }
  },
  setup() {
    const store = usePlayerStore();

    const getSingerList = (artists: Song['artists']) => {
      return artists.map((item) => item.name).join(' / ');
    };

    const addSong = async (id: number) => {
      const res = await queryCheckMusic({ id });
      if (res.success) {
        store.addSong(id);
      } else {
        alert(res.message);
      }
    };

    return { addSong, getSingerList };
  }
});
</script>

<style scoped lang="scss">
.song {
  padding: 0.5rem 0 0.5rem 0.5rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;

  .left {
    flex: 1;
    overflow: hidden;
  }

  .name {
    font-size: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: normal;
    margin-bottom: 0.5rem;

    .alias {
      color: var(--color-text-second);
    }
  }

  .desc {
    display: flex;
    align-items: center;
    color: var(--color-text-second);
    font-size: 0.75rem;
  }

  .name,
  .desc {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: normal;
  }

  .play {
    margin: 0;
    padding: 0 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--color-text-3);
    font-size: 1.875rem;
  }
}
</style>
