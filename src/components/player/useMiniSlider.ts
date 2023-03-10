import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
  onActivated,
  onDeactivated
} from 'vue';
import BScroll from '@better-scroll/core';
import Slide from '@better-scroll/slide';
import { usePlayerStore } from '@/stores/player';
import type { Page } from '@better-scroll/slide/dist/types/SlidePages';

BScroll.use(Slide);

export default function useMiniSlider() {
  const sliderWrapperRef = ref<HTMLDivElement>();
  const slider = ref<BScroll>();

  const store = usePlayerStore();
  const fullScreen = computed(() => store.state.value.fullScreen);
  const playlist = computed(() => store.state.value.playlist);
  const currentIndex = computed(() => store.state.value.currentIndex);

  const sliderShow = computed(() => {
    return !fullScreen.value && !!playlist.value;
  });

  onMounted(() => {
    let sliderVal: BScroll;
    watch(sliderShow, async (newSliderShow) => {
      if (newSliderShow) {
        await nextTick();
        if (!sliderVal && sliderWrapperRef.value) {
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true
            }
          });

          sliderVal.on('slidePageChanged', ({ pageX }: Page) => {
            store.updateState({ currentIndex: pageX });
          });
        } else {
          sliderVal.refresh();
        }
        sliderVal.goToPage(currentIndex.value, 0, 0);
      }
    });

    watch(currentIndex, (newIndex) => {
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0);
      }
    });

    watch(playlist, async (newList) => {
      if (sliderVal && sliderShow.value && newList.length) {
        await nextTick();
        sliderVal.refresh();
      }
    });
  });

  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy();
    }
  });

  onActivated(() => {
    slider.value?.enable();
    slider.value?.refresh();
  });

  onDeactivated(() => {
    slider.value?.disable();
  });

  return {
    slider,
    sliderWrapperRef
  };
}
