<template>
  <div class="h-loading">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      style="margin: auto; background: rgb(255, 255, 255); display: block; shape-rendering: auto"
      width="36px"
      height="36px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <rect x="20" y="30" width="10" height="40" fill="#ab175c">
        <animate
          attributeName="y"
          repeatCount="indefinite"
          dur="1s"
          calcMode="spline"
          keyTimes="0;0.5;1"
          values="14;30;30"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
          begin="-0.2s"
        ></animate>
        <animate
          attributeName="height"
          repeatCount="indefinite"
          dur="1s"
          calcMode="spline"
          keyTimes="0;0.5;1"
          values="72;40;40"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
          begin="-0.2s"
        ></animate>
      </rect>
      <rect x="45" y="30" width="10" height="40" fill="#e15b64">
        <animate
          attributeName="y"
          repeatCount="indefinite"
          dur="1s"
          calcMode="spline"
          keyTimes="0;0.5;1"
          values="18;30;30"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
          begin="-0.1s"
        ></animate>
        <animate
          attributeName="height"
          repeatCount="indefinite"
          dur="1s"
          calcMode="spline"
          keyTimes="0;0.5;1"
          values="64;40;40"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
          begin="-0.1s"
        ></animate>
      </rect>
      <rect x="70" y="30" width="10" height="40" fill="#e60202">
        <animate
          attributeName="y"
          repeatCount="indefinite"
          dur="1s"
          calcMode="spline"
          keyTimes="0;0.5;1"
          values="18;30;30"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
        ></animate>
        <animate
          attributeName="height"
          repeatCount="indefinite"
          dur="1s"
          calcMode="spline"
          keyTimes="0;0.5;1"
          values="64;40;40"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
        ></animate>
      </rect>
    </svg>

    <p>{{ title }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const title = ref('');

    const setTitle = (value: string) => {
      title.value = value;
    };

    return { title, setTitle };
  }
});
</script>

<style lang="scss" scoped>
.h-loading {
  text-align: center;

  p {
    margin: 0;
  }
}
</style>
