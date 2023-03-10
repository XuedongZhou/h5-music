<template>
  <div>
    <header>
      <div class="header-bg" :style="{ 'background-image': `url(${data?.coverImgUrl})` }"></div>
      <div class="content">
        <div class="left">
          <img :src="data?.coverImgUrl" alt="" />
          <span class="quality">{{ data?.highQuality ? '精品歌单' : '歌单' }}</span>
          <div class="count">
            <HIcon icon="icon-listing-content-fill"></HIcon>
            <span>
              {{ numberFormat(data?.playCount) }}
            </span>
          </div>
        </div>
        <div class="right">
          <h2 class="name">{{ data?.name }}</h2>

          <div class="creator">
            <img :src="data?.creator.avatarUrl + '?imageView=1&type=webp&thumbnail=60x0'" alt="" />
            <span>{{ data?.creator.nickname }}</span>
          </div>
        </div>
      </div>
    </header>
    <main>
      <HSimpleSongList :list="data?.tracks" :show-title="true" title="歌曲列表" />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { numberFormat } from '@/utils/utils';
import { queryPlaylistDetail } from '@/services/api';
import { useRoute } from 'vue-router';
import type { PlaylistDetail, SimpleSong } from '@/services/interface';
import HIcon from '@/components/icons/HIcon.vue';
import HSimpleSongList from '@/components/song/HSimpleSongList.vue';

export default defineComponent({
  components: {
    HIcon,
    HSimpleSongList
  },
  setup() {
    const route = useRoute();

    const data = ref<PlaylistDetail>();

    const playlistLoading = ref(false);
    const getPlaylistDetail = async (id: string) => {
      try {
        playlistLoading.value = true;
        const res = await queryPlaylistDetail({ id });
        data.value = res.playlist;
      } catch (error) {
        console.error(error);
      }
      playlistLoading.value = false;
    };

    onMounted(() => {
      const id = route.query['id'] as string;
      if (id) {
        getPlaylistDetail(id);
      }
    });

    const getSingerList = (artists: SimpleSong['ar']) => {
      return artists.map((item) => item.name).join(' / ');
    };

    return { data, numberFormat, getSingerList };
  }
});
</script>

<style scoped lang="scss">
header {
  padding: 2rem 1rem;
  position: relative;
  overflow: hidden;

  .header-bg {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: cover;
    filter: blur(1.25rem);
    z-index: 1;
    transform: scale(1.5);

    &::after {
      content: ' ';
      background-color: rgba(0, 0, 0, 0.25);
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    }
  }

  .content {
    display: flex;
    z-index: 2;
    position: relative;

    .left {
      width: 8rem;
      height: 8rem;
      position: relative;

      img {
        width: 100%;
      }

      .quality {
        position: absolute;
        z-index: 3;
        top: 0.5rem;
        left: 0;
        padding: 0 0.5rem;
        height: 1rem;
        color: #fff;
        font-size: 0.75rem;
        text-align: center;
        line-height: 1rem;
        background-color: rgba(217, 48, 48, 0.8);
        border-top-right-radius: 1rem;
        border-bottom-right-radius: 1rem;
      }

      .count {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        color: #fff;
        font-size: 0.75rem;
        padding: 0 0.25rem;
        text-shadow: 1px 0 0 rgb(0 0 0 / 15%);

        &::after {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          height: 1.25rem;
          content: ' ';
          background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
        }
      }
    }

    .right {
      flex: 1;
      margin-left: 1rem;
      width: 0;

      .name {
        font-weight: 400;
        font-size: 1rem;
        color: var(--color-text-dark);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        word-wrap: break-word;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .creator {
        display: flex;
        align-items: center;
        margin-top: 0.25rem;
        font-size: 0.875rem;
        color: var(--color-text-second-dark);

        img {
          width: 1.875rem;
          height: 1.875rem;
          border-radius: 50%;
          margin-right: 0.5rem;
        }
      }
    }
  }
}
</style>
