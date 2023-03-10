<template>
  <div class="progress-circle">
    <svg
      :width="radius"
      :height="radius"
      viewBox="0 0 100 100"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent" />
      <circle
        class="progress-bar"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { computed, ref, defineComponent } from 'vue';

export default defineComponent({
  props: {
    radius: {
      type: Number,
      default: 100
    },
    progress: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const dashArray = ref(Math.PI * 100);
    const dashOffset = computed(() => (1 - props.progress) * dashArray.value);

    return { dashArray, dashOffset };
  }
});
</script>

<style scoped lang="scss">
.progress-circle {
  position: relative;

  circle {
    stroke-width: 8px;
    transform-origin: center;

    &.progress-background {
      transform: scale(0.9);
      stroke: var(--color-background-second);
    }

    &.progress-bar {
      transform: scale(0.9) rotate(-90deg);
      stroke: var(--color-primary);
    }
  }
}
</style>
