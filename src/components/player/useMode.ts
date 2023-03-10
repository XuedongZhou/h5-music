import { PlayMode, usePlayerStore } from '@/stores/player';
import { computed } from 'vue';

export default function useMode() {
  const store = usePlayerStore();
  const playMode = computed(() => store.state.value.playMode);

  const modeIcon = computed(() => {
    const playModeVal = playMode.value;
    return playModeVal === PlayMode.Sequence
      ? 'icon-sequence'
      : playModeVal === PlayMode.Random
      ? 'icon-random'
      : 'icon-loop';
  });

  const modeText = computed(() => {
    const playModeVal = playMode.value;
    return playModeVal === PlayMode.Sequence
      ? '顺序播放'
      : playModeVal === PlayMode.Random
      ? '随机播放'
      : '单曲循环';
  });

  function changeMode() {
    const mode = (playMode.value + 1) % 3;
    store.changeMode(mode);
  }

  return {
    modeIcon,
    modeText,
    changeMode
  };
}
