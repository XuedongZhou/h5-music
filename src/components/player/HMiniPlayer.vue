<template>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="showNormalPlayer">
      <div class="cd-wrapper">
        <div ref="cdRef" class="cd">
          <img ref="cdImageRef" width="40" height="40" :src="currentSong.picUrl" :class="cdCls" />
        </div>
      </div>
      <div ref="sliderWrapperRef" class="slider-wrapper">
        <div class="slider-group">
          <div class="slider-page" v-for="song in playlist" :key="song.id">
            <h2 class="name">{{ song.name }}</h2>
            <p class="desc">{{ song.singer }}</p>
          </div>
        </div>
      </div>
      <div class="control">
        <HProgressCircle :radius="32" :progress="progress" @click.stop="togglePlay">
          <HIcon class="icon-mini" :icon="miniPlayIcon" />
        </HProgressCircle>
      </div>
      <div class="control" @click.stop="showPlaylist">
        <HIcon icon="icon-list" class="icon-list" />
      </div>
      <HPlayList ref="playlistRef" />
    </div>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent, ref, type PropType } from 'vue';
import { usePlayerStore } from '@/stores/player';
import useCd from './useCd';
import HProgressCircle from './HProgressCircle.vue';
import HIcon from '@/components/icons/HIcon.vue';
import HPlayList from './HPlayList.vue';
import useMiniSlider from './useMiniSlider';
import type HPlayListVue from './HPlayList.vue';

export default defineComponent({
  components: { HProgressCircle, HIcon, HPlayList },
  props: {
    progress: {
      type: Number,
      default: 0
    },
    togglePlay: { type: Function as PropType<(...arg: any) => void>, default: () => {} }
  },
  setup() {
    const store = usePlayerStore();
    const { cdCls, cdRef, cdImageRef } = useCd();

    const fullScreen = computed(() => store.state.value.fullScreen);
    const playing = computed(() => store.state.value.playing);
    const playlist = computed(() => store.state.value.playlist);
    const miniPlayIcon = computed(() => (playing.value ? 'icon-pause-mini' : 'icon-play-mini'));
    const currentSong = computed(() => store.getCurrentSong());

    const { slider, sliderWrapperRef } = useMiniSlider();

    function showNormalPlayer() {
      store.updateState({ fullScreen: true });
    }

    const playlistRef = ref<typeof HPlayListVue>();
    function showPlaylist() {
      playlistRef.value?.show();
    }

    return {
      fullScreen,
      playlist,
      currentSong,
      showNormalPlayer,
      showPlaylist,
      cdCls,
      cdRef,
      cdImageRef,
      miniPlayIcon,
      slider,
      sliderWrapperRef,
      playlistRef
    };
  }
});
</script>

<style scoped lang="scss">
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  right: 0;
  height: 60px;
  background: var(--color-background);
  box-shadow: 0 -1px 2px 0 rgb(0 0 0 / 3%), 0 -1px 6px -1px rgb(0 0 0 / 2%),
    0 -2px 4px 0 rgb(0 0 0 / 2%);

  &.mini-enter-active,
  &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }

  &.mini-enter-from,
  &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }

  .cd-wrapper {
    flex: 0 0 60px;
    padding-left: 20px;

    .cd {
      width: 40px;
      height: 40px;

      img {
        border-radius: 50%;

        &.playing {
          animation: circling 10s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }

  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    padding-left: 10px;
    overflow: hidden;

    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;

      .slider-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;

        .name {
          margin-bottom: 4px;
          @include no-wrap();
          font-size: 1rem;
          font-weight: 400;
          color: var(--color-text);
        }

        .desc {
          @include no-wrap();
          font-size: 0.875rem;
          color: --color-text-second;
          margin: 0;
        }
      }
    }
  }

  .control {
    flex: 0 0 30px;
    padding: 0 10px;

    .icon-mini {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-45%, -60%);
    }

    .icon-list {
      position: relative;
      top: -2px;
      font-size: 32px;
      color: var(--color-text-second);
    }
  }
}
</style>
