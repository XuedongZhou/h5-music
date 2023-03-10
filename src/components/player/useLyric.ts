import { querySongLyric } from '@/services/api';
import { usePlayerStore } from '@/stores/player';
import Lyric, { type LyricHandlerValue } from '@/utils/lyricParser';
import type BScroll from '@better-scroll/core';
import { computed, ref, watch, type Ref } from 'vue';

export default function useLyric({
  songReady,
  currentTime
}: {
  songReady: Ref<boolean>;
  currentTime: Ref<number>;
}) {
  const store = usePlayerStore();
  const currentLyric = ref<Lyric>();
  const lyricScrollRef = ref<BScroll>();
  const lyricListRef = ref<HTMLDivElement>();
  const playingLyric = ref('');
  const currentLineNum = ref(0);
  const currentSong = computed(() => store.getCurrentSong());

  watch(currentSong, async (newSong) => {
    if (!newSong.id || !newSong.url) {
      return;
    }

    if (newSong.lyric) {
      return;
    }

    stopLyric();
    currentLyric.value = undefined;
    currentLineNum.value = 0;
    playingLyric.value = '';

    try {
      const res = await querySongLyric({ id: newSong.id });
      if (res.code === 200) {
        store.addSongLyric(newSong.id, res.lrc.lyric);
      }

      if (currentSong.value.lyric !== res.lrc.lyric) {
        return;
      }
    } catch (error) {
      console.error(error);
    }

    currentLyric.value = new Lyric(newSong.lyric, handleLyric);

    if (songReady.value) {
      playLyric();
    }
  });

  function handleLyric({ lineNum, txt }: LyricHandlerValue) {
    currentLineNum.value = lineNum;
    playingLyric.value = txt;
    const scrollComp = lyricScrollRef.value;
    const listEl = lyricListRef.value;
    if (!listEl || !scrollComp) {
      return;
    }

    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5];
      scrollComp.scroll.scrollToElement(lineEl, 1000);
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000);
    }
  }

  function playLyric() {
    const currentLyricValue = currentLyric.value;
    if (currentLyricValue) {
      currentLyricValue.seek(currentTime.value * 1000);
    }
  }

  function stopLyric() {
    const currentLyricValue = currentLyric.value;
    if (currentLyricValue) {
      currentLyricValue.stop();
    }
  }

  return {
    currentLyric,
    currentLineNum,
    lyricScrollRef,
    lyricListRef,
    playingLyric,
    playLyric,
    stopLyric
  };
}
