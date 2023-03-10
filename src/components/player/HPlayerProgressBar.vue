<template>
  <div ref="progressBarRef" class="progress-bar" @click="onClick">
    <div class="bar-inner">
      <div class="progress" ref="progressRef" :style="progressStyle"></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
const progressBtnWidth = 16;

export default defineComponent({
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  emits: ['progressChanging', 'progressChanged'],
  setup(props, ctx) {
    const offset = ref(0);
    const progressBarRef = ref<HTMLDivElement>();
    const progressRef = ref<HTMLDivElement>();

    const progressStyle = computed(() => `width:${offset.value}px`);
    const btnStyle = computed(() => `transform:translate3d(${offset.value}px,0,0)`);

    function setOffset(progress: number) {
      if (progressBarRef.value) {
        const barWidth = progressBarRef.value.clientWidth - progressBtnWidth;
        offset.value = barWidth * progress;
      }
    }

    watch(
      () => props.progress,
      (val) => setOffset(val)
    );

    const touch = ref({ x1: 0, beginWidth: 0 });

    function onTouchStart(e: TouchEvent) {
      if (progressRef.value) {
        touch.value.x1 = e.touches[0].pageX;
        touch.value.beginWidth = progressRef.value.clientWidth;
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (progressBarRef.value) {
        const delta = e.touches[0].pageX - touch.value.x1;
        const tempWidth = touch.value.beginWidth + delta;
        const barWidth = progressBarRef.value.clientWidth - progressBtnWidth;
        const progress = Math.min(1, Math.max(tempWidth / barWidth, 0));
        offset.value = barWidth * progress;
        ctx.emit('progressChanging', progress);
      }
    }

    function onTouchEnd() {
      if (progressBarRef.value && progressRef.value) {
        const barWidth = progressBarRef.value.clientWidth - progressBtnWidth;
        const progress = progressRef.value.clientWidth / barWidth;
        ctx.emit('progressChanged', progress);
      }
    }

    function onClick(e: MouseEvent) {
      if (progressBarRef.value) {
        const rect = progressBarRef.value.getBoundingClientRect();
        const offsetWidth = e.pageX - rect.left;
        const barWidth = progressBarRef.value.clientWidth - progressBtnWidth;
        const progress = offsetWidth / barWidth;
        ctx.emit('progressChanged', progress);
      }
    }

    return {
      progressBarRef,
      progressRef,
      progressStyle,
      btnStyle,
      setOffset,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onClick
    };
  }
});
</script>

<style scoped lang="scss">
.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 2px;

    .progress {
      position: absolute;
      height: 100%;
      border-radius: 2px;
      background: var(--color-primary);
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid var(--color-text-dark);
        border-radius: 50%;
        background: var(--color-primary);
      }
    }
  }
}
</style>
