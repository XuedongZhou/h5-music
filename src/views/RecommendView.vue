<template>
  <div class="container">
    <div class="slider-wrapper">
      <div class="slider-content">
        <HSlider v-if="banners.length" :sliders="banners"></HSlider>
      </div>
    </div>

    <div v-loading:[recommendLoadingText]="recommendLoading">
      <h2 class="title">歌单推荐</h2>
      <div class="recommend-songs">
        <router-link
          class="song-list"
          v-for="item in recommendSongs"
          :key="item.id"
          :to="'/playlist?id=' + item.id"
        >
          <div class="list-img">
            <img class="img" v-lazy="item.coverImgUrl" />
            <div class="count">
              <HIcon icon="icon-listing-content-fill"></HIcon>
              <span>
                {{ numberFormat(item.playCount) }}
              </span>
            </div>
          </div>
          <span class="desc">{{ item.name }}</span>
        </router-link>
      </div>
    </div>

    <div v-loading:[newSongsLoadingText]="newSongsLoading">
      <h2 class="title">最新音乐</h2>
      <div class="new-songs">
        <HSongList :songs="newSongs" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { queryBanners, queryRecommendSongs, queryNewSongs } from '@/services/api';
import type { PlayList, Banner, Song } from '@/services/interface';
import { defineComponent, ref, onMounted, computed } from 'vue';
import HIcon from '@/components/icons/HIcon.vue';
import HSlider from '@/components/slider/HSlider.vue';
import HSongList from '@/components/song/HSongList.vue';
import { numberFormat } from '@/utils/utils';

export default defineComponent({
  components: {
    HIcon,
    HSlider,
    HSongList
  },
  setup() {
    const banners = ref<Banner[]>([]);

    const getBanners = async () => {
      try {
        const res = await queryBanners();
        if (res.code === 200) {
          banners.value = res.banners;
        }
      } catch (error) {
        console.error(error);
      }
    };

    const recommendSongs = ref<PlayList[]>([]);
    const recommendLoadingText = '歌单加载中...';
    const recommendLoading = ref(false);

    const getRecommendSongs = async () => {
      try {
        recommendLoading.value = true;
        const res = await queryRecommendSongs({ limit: 9 });
        if (res.code === 200) {
          recommendSongs.value = res.playlists;
        }
      } catch (error) {
        console.error(error);
      }
      recommendLoading.value = false;
    };

    const newSongs = ref<Song[]>([]);
    const newSongsLoadingText = '最新音乐加载中...';
    const newSongsLoading = computed(() => !newSongs.value || newSongs.value.length === 0);

    const getNewSongs = async () => {
      try {
        const res = await queryNewSongs();
        if (res.code === 200) {
          newSongs.value = res.result.map((item) => item.song);
        }
      } catch (error) {
        console.error(error);
      }
    };

    onMounted(() => {
      getBanners();
      getRecommendSongs();
      getNewSongs();
    });

    return {
      banners,
      recommendLoading,
      recommendLoadingText,
      recommendSongs,
      numberFormat,
      newSongsLoading,
      newSongsLoadingText,
      newSongs
    };
  }
});
</script>

<style scoped lang="scss">
.container {
  .slider-wrapper {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 40%;
    overflow: hidden;
    margin-bottom: 0.25rem;

    .slider-content {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }

  .title {
    border-left: 0.125rem solid var(--color-primary);
    font-size: 1rem;
    font-weight: 400;
    margin-bottom: 1rem;
    padding-left: 0.5rem;
    line-height: 1;
  }

  .recommend-songs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-column-gap: 0.25rem;
    padding-bottom: 1.25rem;
  }

  .song-list {
    overflow: hidden;
    position: relative;
    margin-bottom: 1rem;

    .list-img {
      position: relative;
      padding-bottom: 100%;

      .img {
        width: 100%;
        float: left;
      }
    }

    .desc {
      padding: 0.2rem 0 0 0.2rem;
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      font-size: 0.875rem;
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
}
</style>
