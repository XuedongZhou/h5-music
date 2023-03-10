<template>
  <section class="play-list">
    <h3 v-if="showTitle" class="title">{{ title }}</h3>
    <div>
      <div class="song" v-for="song in list" :key="song.id" @click="() => addSong(song.id)">
        <div class="left">
          <div class="name">
            {{ song.name }}
            <span class="alias">{{ song.alia.length ? `（${song.alia[0]}）` : null }}</span>
          </div>
          <div class="desc">
            <div>
              <HTag v-if="song.sq">SQ</HTag>
            </div>
            <div>{{ getSingerList(song.ar) }} - {{ song.al.name }}</div>
          </div>
          <div v-if="song.awardName" class="award">
            {{ song.awardName }}
          </div>
        </div>
        <figure class="play">
          <HIcon icon="icon-play" />
        </figure>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import type { SimpleSong } from '@/services/interface';
import { defineComponent, type PropType } from 'vue';
import HIcon from '@/components/icons/HIcon.vue';
import HTag from '@/components/tag/HTag.vue';
import { usePlayerStore } from '@/stores/player';
import { queryCheckMusic } from '@/services/api';

export default defineComponent({
  components: { HIcon, HTag },
  props: {
    list: {
      type: Array as PropType<SimpleSong[]>
    },
    showTitle: Boolean,
    title: String
  },
  setup() {
    const store = usePlayerStore();

    const getSingerList = (artists: SimpleSong['ar']) => {
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
.play-list {
  .title {
    font-weight: 400;
    height: 1.5rem;
    line-height: 1.5rem;
    padding: 0 0.5rem;
    font-size: 0.75rem;
    color: var(--color-text-second);
    background-color: var(--color-background-second);
  }

  .song {
    padding: 0.5rem 0 0.5rem 0.5rem;
    border-bottom: 1px solid var(--color-border);
    display: flex;

    .left {
      flex: 1;
      overflow: hidden;

      .award {
        display: inline-block;
        line-height: 1.5;
        padding: 0 0.25rem;
        color: var(--color-award);
        background-color: var(--color-background-award);
        font-size: 10px;
        transform-origin: left center;
        border-radius: 0.25rem;
      }
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
}
</style>
