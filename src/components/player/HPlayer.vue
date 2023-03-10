<template>
  <div v-show="playlist.length">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="base-player" v-show="fullScreen">
        <div class="background" :style="{ backgroundImage: `url(${currentSong.picUrl})` }"></div>
        <div class="top">
          <div class="back" @click="goBack">
            <HIcon icon="icon-down" />
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="onMiddleTouchStart"
          @touchmove.prevent="onMiddleTouchMove"
          @touchend.prevent="onMiddleTouchEnd"
        >
          <div class="middle-l" :style="middleLStyle">
            <div ref="cdWrapperRef" class="cd-wrapper">
              <div ref="cdRef" class="cd">
                <img ref="cdImageRef" class="image" :class="cdCls" :src="currentSong.picUrl" />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>

          <HScroll class="middle-r" ref="lyricScrollRef" :style="middleRStyle">
            <div class="lyric-wrapper">
              <div v-if="currentLyric" ref="lyricListRef">
                <p
                  class="text"
                  :class="{ current: currentLineNum === index }"
                  v-for="(line, index) in currentLyric.lines"
                  :key="index"
                >
                  {{ line.txt }}
                </p>
              </div>
            </div>
          </HScroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
            <span class="dot" :class="{ active: currentShow === 'lyric' }"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <HPlayerProgressBar
                ref="barRef"
                :progress="progress"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
              />
            </div>
            <span class="time time-r">{{ formatTime(currentSong.time) }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <HIcon @click="changeMode" :icon="modeIcon" />
            </div>
            <div class="icon i-left" :class="disableCls">
              <HIcon @click="prev" icon="icon-left-button" />
            </div>
            <div class="icon i-center" :class="disableCls">
              <HIcon @click="togglePlay" :icon="playIcon" />
            </div>
            <div class="icon i-right" :class="disableCls">
              <HIcon @click="next" icon="icon-right-button" />
            </div>
            <div class="icon i-right">
              <HIcon
                :class="{ highlight: getFavoriteIcon(currentSong) === 'icon-favorites-fill' }"
                @click="toggleFavorite(currentSong)"
                :icon="getFavoriteIcon(currentSong)"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>
    <HMiniPlayer :progress="progress" :togglePlay="togglePlay" />
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, nextTick } from 'vue';
import { PlayMode, usePlayerStore } from '@/stores/player';
import useAnimation from './useAnimation';
import useMode from './useMode';
import useFavorite from './useFavorite';
import useLyric from './useLyric';
import HIcon from '@/components/icons/HIcon.vue';
import HPlayerProgressBar from './HPlayerProgressBar.vue';
import HScroll from '@/components/scroll/HScroll.vue';
import HMiniPlayer from './HMiniPlayer.vue';
import useCd from './useCd';
import { formatTime } from '@/utils/utils';
import useMiddleInteractive from './useMiddleInteractive';

export default defineComponent({
  components: { HIcon, HPlayerProgressBar, HScroll, HMiniPlayer },
  setup() {
    const store = usePlayerStore();

    const barRef = ref<typeof HPlayerProgressBar>();
    const audioRef = ref<HTMLAudioElement>();
    const currentSong = computed(() => store.getCurrentSong());

    const fullScreen = computed(() => store.state.value.fullScreen);
    const playMode = computed(() => store.state.value.playMode);
    const playing = computed(() => store.state.value.playing);
    const currentIndex = computed(() => store.state.value.currentIndex);
    const playlist = computed(() => store.state.value.playlist);

    const { cdWrapperRef, enter, afterEnter, leave, afterLeave } = useAnimation();
    const { modeIcon, changeMode } = useMode();
    const { getFavoriteIcon, toggleFavorite } = useFavorite();
    const { cdCls, cdRef, cdImageRef } = useCd();
    const songReady = ref(false);
    const currentTime = ref(0);
    const {
      currentLyric,
      currentLineNum,
      lyricScrollRef,
      lyricListRef,
      playingLyric,
      playLyric,
      stopLyric
    } = useLyric({ songReady, currentTime });
    const {
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd
    } = useMiddleInteractive();

    function ready() {
      if (songReady.value) {
        return;
      }
      songReady.value = true;
      playLyric();
    }

    let progressChanging = false;
    function updateTime(e: any) {
      if (!progressChanging) {
        currentTime.value = e.target.currentTime;
      }
    }

    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return;
      }
      currentTime.value = 0;
      songReady.value = false;
      const audioEl = audioRef.value;
      if (audioEl) {
        audioEl.src = newSong.url;
        audioEl.play();
        store.updateState({ playing: true });
      }
    });

    watch(playing, (newPlaying) => {
      if (!songReady.value) {
        return;
      }
      const audioEl = audioRef.value;
      if (newPlaying) {
        audioEl?.play();
        playLyric();
      } else {
        audioEl?.pause();
        stopLyric();
      }
    });

    watch(fullScreen, async (newFullScreen) => {
      if (newFullScreen) {
        await nextTick();
        barRef.value?.setOffset(progress.value);
      }
    });

    function goBack() {
      store.updateState({ fullScreen: false });
    }

    const progress = computed(() => {
      return currentTime.value / currentSong.value.time;
    });

    function onProgressChanging(progress: number) {
      progressChanging = true;
      currentTime.value = currentSong.value.time * progress;
      playLyric();
      stopLyric();
    }

    function onProgressChanged(progress: number) {
      progressChanging = false;
      if (audioRef.value) {
        audioRef.value.currentTime = currentTime.value = currentSong.value.time * progress;
        if (!playing.value) {
          store.updateState({ playing: true });
        }
      }
      playLyric();
    }

    const playIcon = computed(() => {
      return playing.value ? 'icon-suspended' : 'icon-play';
    });

    const disableCls = computed(() => {
      return songReady.value ? '' : 'disable';
    });

    function loop() {
      const audioEl = audioRef.value;
      if (audioEl) {
        audioEl.currentTime = 0;
        audioEl.play();
        store.updateState({ playing: true });
      }
    }

    function prev() {
      const list = playlist.value;
      if (!songReady.value || !list.length) {
        return;
      }
      if (list.length === 1) {
        loop();
      } else {
        let index = currentIndex.value - 1;
        if (index === -1) {
          index = list.length - 1;
        }
        store.updateState({ currentIndex: index });
      }
    }

    function togglePlay() {
      if (!songReady.value) {
        return;
      }
      store.updateState({ playing: !playing.value });
    }

    function next() {
      const list = playlist.value;
      if (!songReady.value || !list.length) {
        return;
      }

      if (list.length === 1) {
        loop();
      } else {
        let index = currentIndex.value + 1;
        if (index === list.length) {
          index = 0;
        }
        store.updateState({ currentIndex: index });
      }
    }

    function pause() {
      store.updateState({ playing: false });
    }

    function end() {
      currentTime.value = 0;
      if (playMode.value === PlayMode.Loop) {
        loop();
      } else {
        next();
      }
    }

    function error() {
      songReady.value = true;
    }

    return {
      cdWrapperRef,
      enter,
      afterEnter,
      leave,
      afterLeave,
      playlist,
      fullScreen,
      barRef,
      audioRef,
      cdCls,
      cdRef,
      cdImageRef,
      currentSong,
      ready,
      pause,
      updateTime,
      end,
      error,
      goBack,
      disableCls,
      modeIcon,
      changeMode,
      prev,
      playIcon,
      togglePlay,
      next,
      toggleFavorite,
      getFavoriteIcon,
      formatTime,
      progress,
      currentTime,
      onProgressChanging,
      onProgressChanged,
      currentLyric,
      currentLineNum,
      playingLyric,
      lyricScrollRef,
      lyricListRef,
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd
    };
  }
});
</script>

<style scoped lang="scss">
.base-player {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  background-color: #222;

  .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    filter: blur(20px);

    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    transform: scale(1.5);

    &::after {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba($color: #000000, $alpha: 0.5);
    }

    img {
      width: 100%;
      height: 100%;
    }
  }

  .top {
    position: relative;
    margin-bottom: 25px;

    .back {
      font-size: 26px;
      position: absolute;
      top: 0.5rem;
      left: 1rem;
      z-index: 50;
      color: var(--color-text-dark);
    }

    .icon-back {
      display: block;
      padding: 9px;
      font-size: 1rem;
      color: var(--color-primary);
      transform: rotate(-90deg);
    }

    .title {
      width: 70%;
      margin: 0 auto;
      line-height: 40px;
      text-align: center;
      @include no-wrap();
      font-size: 1rem;
      color: var(--color-text-dark);
    }

    .subtitle {
      line-height: 20px;
      text-align: center;
      font-size: 0.875rem;
      color: var(--color-text-dark);
    }
  }

  .middle {
    position: fixed;
    width: 100%;
    top: 80px;
    bottom: 170px;
    white-space: nowrap;
    font-size: 0;

    .middle-l {
      display: inline-block;
      vertical-align: top;
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;

      .cd-wrapper {
        position: absolute;
        left: 15%;
        top: 0;
        width: 70%;
        box-sizing: border-box;
        height: 100%;

        .cd {
          width: 100%;
          height: 100%;
          border-radius: 50%;

          img {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border-radius: 50%;
            border: 10px solid rgba(255, 255, 255, 0.1);
          }

          .playing {
            animation: circling 20s linear infinite;
          }
        }
      }

      .playing-lyric-wrapper {
        width: 80%;
        margin: 30px auto 0 auto;
        overflow: hidden;
        text-align: center;

        .playing-lyric {
          height: 20px;
          line-height: 20px;
          font-size: 1rem;
          color: var(--color-text-dark);
        }
      }
    }

    .middle-r {
      display: inline-block;
      vertical-align: top;
      width: 100%;
      height: 100%;
      overflow: hidden;

      .lyric-wrapper {
        width: 80%;
        margin: 0 auto;
        overflow: hidden;
        text-align: center;

        .text {
          line-height: 20px;
          color: var(--color-text-second-dark);
          font-size: 1rem;

          &.current {
            color: var(--color-text-dark);
          }
        }

        .pure-music {
          padding-top: 50%;
          line-height: 20px;
          color: var(--color-text-second-dark);
          font-size: 1rem;
        }
      }
    }
  }

  .bottom {
    position: absolute;
    bottom: 2rem;
    width: 100%;

    .dot-wrapper {
      text-align: center;
      font-size: 0;

      .dot {
        display: inline-block;
        vertical-align: middle;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--color-text-second-dark);
        transition: all 0.3s;

        &.active {
          width: 20px;
          border-radius: 5px;
          background: var(--color-text-dark);
        }
      }
    }

    .progress-wrapper {
      display: flex;
      align-items: center;
      width: 80%;
      margin: 0px auto;
      padding: 10px 0;

      .time {
        color: var(--color-text-dark);
        font-size: 0.875rem;
        flex: 0 0 45px;
        line-height: 30px;
        width: 45px;

        &.time-l {
          text-align: left;
        }

        &.time-r {
          text-align: right;
        }
      }

      .progress-bar-wrapper {
        flex: 1;
      }
    }

    .operators {
      display: flex;
      align-items: center;
      line-height: 30px;
      font-size: 30px;

      .icon {
        flex: 1;
        color: var(--color-text-dark);

        &.disable {
          color: var(--color-text-second-dark);
        }

        &.highlight {
          color: var(--color-primary);
        }
      }

      .i-left {
        text-align: right;
      }

      .i-center {
        padding: 0 20px;
        text-align: center;
        font-size: 60px;
      }

      .i-right {
        text-align: left;
      }
    }
  }

  &.normal-enter-active,
  &.normal-leave-active {
    transition: all 0.6s;

    .top,
    .bottom {
      transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
    }
  }

  &.normal-enter-from,
  &.normal-leave-to {
    opacity: 0;

    .top {
      transform: translate3d(0, -100px, 0);
    }

    .bottom {
      transform: translate3d(0, 100px, 0);
    }
  }
}
</style>
