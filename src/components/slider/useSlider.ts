import BScroll from '@better-scroll/core';
import Slide from '@better-scroll/slide';
import type { Page } from '@better-scroll/slide/dist/types/SlidePages';

import { onActivated, onDeactivated, onMounted, onUnmounted, ref, type Ref } from 'vue';

BScroll.use(Slide);

export default function useSlider(wrapperRef: Ref) {
  const slider = ref<BScroll | null>(null);
  const currentPageIndex = ref(0);

  onMounted(() => {
    const sliderVal = (slider.value = new BScroll(wrapperRef.value, {
      click: true,
      scrollX: true,
      scrollY: false,
      momentum: false,
      bounce: false,
      probeType: 2,
      slide: true
    }));

    sliderVal.on('slideWillChange', (page: Page) => {
      currentPageIndex.value = page.pageX;
    });
  });

  onUnmounted(() => {
    slider.value?.destroy();
  });

  onActivated(() => {
    slider.value?.enable();
    slider.value?.refresh();
  });

  onDeactivated(() => {
    slider.value?.disable();
  });

  return { slider, currentPageIndex };
}
