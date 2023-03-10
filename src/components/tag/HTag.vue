<template>
  <span class="tag">
    <slot></slot>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return {};
  }
});
</script>

<style scoped lang="scss">
.tag {
  display: inline-block;
  align-items: center;
  font-weight: 600;
  border: 1px solid var(--color-primary);
  border-radius: 0.125rem;
  color: var(--color-primary);
  height: 0.75rem;
  line-height: 0.75rem;
  font-size: 0.65rem;
  margin-right: 0.25rem;
}
</style>
