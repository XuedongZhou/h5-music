<template>
  <teleport to="body">
    <transition name="list-fade">
      <div class="playlist" v-show="visible && playlist.length" @click="hide" @touchmove.prevent>
        <div class="list-wrapper" v-clickOutside="hide" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <HIcon :icon="modeIcon" @click="changeMode" />
              <span class="text">{{ modeText }}</span>
              <span class="clear" @click="showConfirm">
                <HIcon icon="icon-delete" />
              </span>
            </h1>
          </div>
          <HScroll ref="scrollRef" class="list-content">
            <transition-group ref="listRef" name="list" tag="ul">
              <li
                class="item"
                v-for="song in sequenceList"
                :key="song.id"
                @click="selectItem(song)"
              >
                <HIcon class="current" :icon="getCurrentIcon(song)" />
                <span class="text">{{ song.name }}</span>
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <HIcon
                    :class="{ highlight: getFavoriteIcon(song) === 'icon-favorites-fill' }"
                    :icon="getFavoriteIcon(song)"
                  />
                </span>
                <span class="delete" @click.stop="removeSong(song)" :class="{ disable: removing }">
                  <HIcon icon="icon-close" />
                </span>
              </li>
            </transition-group>
          </HScroll>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { usePlayerStore } from '@/stores/player';
import { computed, defineComponent, nextTick, ref, watch } from 'vue';
import HScroll from '@/components/scroll/HScroll.vue';
import HIcon from '@/components/icons/HIcon.vue';
import useMode from './useMode';
import useFavorite from './useFavorite';
import type { PlaySong } from '@/services/interface';
import clickOutsideDirective from './clickOutside';
import type { BScroll } from '@better-scroll/core/dist/types/BScroll';

export default defineComponent({
  components: { HScroll, HIcon },
  directives: { clickOutside: clickOutsideDirective },
  setup() {
    const store = usePlayerStore();
    const { modeIcon, modeText, changeMode } = useMode();
    const { getFavoriteIcon, toggleFavorite } = useFavorite();

    const visible = ref(false);

    const scrollRef = ref<BScroll>();
    const listRef = ref();

    const playlist = computed(() => store.state.value.playlist);
    const sequenceList = computed(() => store.state.value.sequenceList);
    const currentSong = computed(() => store.getCurrentSong());

    watch(currentSong, async (newSong) => {
      if (!visible.value || !newSong.id) {
        return;
      }
      await nextTick();
      scrollToCurrent();
    });

    function scrollToCurrent() {
      const index = sequenceList.value.findIndex((song) => {
        return currentSong.value.id === song.id;
      });
      if (index === -1) {
        return;
      }
      const target = listRef.value?.$el.children[index];

      scrollRef.value?.scroll.scrollToElement(target, 300);
    }

    function getCurrentIcon(song: PlaySong) {
      if (song.id === currentSong.value.id) {
        return 'icon-play';
      }
    }

    const removing = ref(false);
    function removeSong(song: PlaySong) {
      if (removing.value) {
        return;
      }
      removing.value = true;
      store.removeSong(song);
      if (!playlist.value.length) {
        hide();
      }
      setTimeout(() => {
        removing.value = false;
      }, 300);
    }

    function selectItem(song: PlaySong) {
      const index = playlist.value.findIndex((item) => {
        return song.id === item.id;
      });

      store.updateState({ currentIndex: index, playing: true });
    }

    async function show() {
      visible.value = true;
      document.body.style.overflow = 'hidden';

      await nextTick();
      refreshScroll();
      scrollToCurrent();
    }

    function refreshScroll() {
      scrollRef.value?.scroll.refresh();
    }

    function hide() {
      visible.value = false;
      document.body.style.overflow = 'auto';
    }

    function showConfirm() {
      if (window.confirm('是否清空播放列表？')) {
        store.clearSongList();
        hide();
      }
    }

    function confirmClear() {}

    return {
      visible,
      playlist,
      sequenceList,
      modeIcon,
      modeText,
      scrollRef,
      listRef,
      getFavoriteIcon,
      toggleFavorite,
      getCurrentIcon,
      removing,
      removeSong,
      selectItem,
      show,
      hide,
      changeMode,
      showConfirm,
      confirmClear
    };
  }
});
</script>

<style scoped lang="scss">
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: rgba($color: #000, $alpha: 0.1);

  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;

    .list-wrapper {
      transition: all 0.3s;
    }
  }

  &.list-fade-enter-from,
  &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: var(--color-background);

    .list-header {
      position: relative;
      padding: 10px 20px 10px 20px;

      .title {
        display: flex;
        align-items: center;

        .icon {
          font-size: 24px;
          color: var(--color-primary);
        }

        .text {
          margin-left: 10px;
          font-weight: 400;
          flex: 1;
          font-size: 1rem;
          color: var(--color-text);
        }

        .clear {
          .icon-clear {
            font-size: 1rem;
            color: var(--color-text);
          }
        }
      }
    }

    .list-content {
      max-height: 240px;
      overflow: hidden;

      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;

        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: 1rem;
          color: var(--color-primary);
        }

        .text {
          flex: 1;
          @include no-wrap();
          font-size: 1rem;
          line-height: 1rem;
          color: var(--color-text-second);
        }

        .icon {
          font-size: 1rem;

          &.highlight {
            color: var(--color-primary);
          }
        }

        .favorite {
          @include extend-click();
          margin-right: 15px;
          font-size: 0.875rem;
          color: var(--color-text-second);

          .icon-favorite {
            color: var(--color-text-second);
          }
        }

        .delete {
          @include extend-click();
          font-size: 0.875rem;
          color: var(--color-primary);

          &.disable {
            color: var(--color-text-second);
          }
        }
      }
    }
  }
}
</style>
