import { usePlayerStore } from '@/stores/player';
import { computed, ref, watch } from 'vue';

export default function useCd() {
  const cdRef = ref<HTMLDivElement>();
  const cdImageRef = ref<HTMLImageElement>();

  const store = usePlayerStore();
  const playing = computed(() => store.state.value.playing);

  const cdCls = computed(() => {
    return playing.value ? 'playing' : '';
  });

  function syncTransform(wrapper: HTMLElement, inner: HTMLElement) {
    const wrapperTransform = getComputedStyle(wrapper).transform;
    const innerTransform = getComputedStyle(inner).transform;
    wrapper.style.transform =
      wrapperTransform === 'none' ? innerTransform : innerTransform.concat(' ', wrapperTransform);
  }

  watch(playing, (newPlaying) => {
    if (!newPlaying && cdRef.value && cdImageRef.value) {
      syncTransform(cdRef.value, cdImageRef.value);
    }
  });

  return {
    cdCls,
    cdRef,
    cdImageRef
  };
}
