<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import useScroll from './useScroll';

export default defineComponent({
  emits: ['scroll'],
  props: {
    click: {
      type: Boolean,
      default: true
    },
    probeType: {
      type: Number,
      default: 0
    }
  },
  setup(props, { emit }) {
    const rootRef = ref(null);
    const scroll = useScroll(rootRef, props, emit);

    return {
      rootRef,
      scroll
    };
  }
});
</script>

<style scoped></style>
