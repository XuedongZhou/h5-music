import BScroll, { type Options } from '@better-scroll/core';
import ObserveDOM from '@better-scroll/observe-dom';
import { onActivated, onDeactivated, onMounted, onUnmounted, ref, type Ref } from 'vue';

BScroll.use(ObserveDOM);

export default function useScroll(
  wrapperRef: Ref,
  options: Options,
  emit: (event: 'scroll', ...args: any[]) => void
) {
  const scroll = ref<BScroll | null>(null);

  onMounted(() => {
    const scrollVal: BScroll = (scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    }));

    if (options.probeType && options.probeType > 0) {
      scrollVal.on('scroll', (pos: any) => {
        emit('scroll', pos);
      });
    }
  });

  onUnmounted(() => {
    scroll.value?.destroy();
  });

  onActivated(() => {
    scroll.value?.enable();
    scroll.value?.refresh();
  });

  onDeactivated(() => {
    scroll.value?.disable();
  });

  return scroll;
}
