<template>
  <div class="input-wrapper">
    <HIcon class="icon-search" icon="icon-search"></HIcon>
    <input
      type="text"
      :placeholder="placeholder"
      v-model="query"
      @input="handleInput"
      @focus="handleFocus"
    />
    <figure class="close" @click="clear">
      <HIcon class="icon-reeor-fill" icon="icon-reeor-fill"></HIcon>
    </figure>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { debounce } from 'throttle-debounce';
import HIcon from '@/components/icons/HIcon.vue';

export default defineComponent({
  components: {
    HIcon
  },
  props: {
    modelValue: String,
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手、专辑'
    }
  },
  emits: ['update:modelValue', 'search'],
  setup(props, ctx) {
    const query = ref(props.modelValue);

    watch(
      () => props.modelValue,
      (val) => {
        query.value = val;
      }
    );

    const onModelValueChange = debounce(300, (val?: string) => {
      ctx.emit('update:modelValue', val?.trim());
    });

    watch(query, onModelValueChange);

    const handleSearch = () => {
      ctx.emit('search', query.value);
    };

    const clear = () => {
      query.value = '';
      handleSearch();
    };

    const handleInput = () => {
      handleSearch();
    };

    const handleFocus = () => {
      handleSearch();
    };

    return { query, clear, handleInput, handleFocus };
  }
});
</script>

<style scoped lang="scss">
.input-wrapper {
  padding: 0 1.875rem;
  border-radius: 1.875rem;
  background-color: var(--color-background-second);
  position: relative;

  .icon-search {
    position: absolute;
    left: 0;
    top: 0.5rem;
    margin: 0 0.5rem;
    vertical-align: middle;
  }

  input {
    width: 100%;
    height: 1.875rem;
    line-height: 1.125rem;
    background-color: transparent;
    font-size: 0.875rem;
    border: none;
    border-radius: 0;
    outline: 0;
    padding: 0;
  }

  .close {
    position: absolute;
    right: 0;
    top: 0;
    width: 1.875rem;
    height: 1.875rem;
    line-height: 1.75rem;
    text-align: center;
    margin: 0;
  }

  .icon-reeor-fill {
    opacity: 0.5;
    font-size: 1.2em;
    vertical-align: -0.265em;

    &:hover,
    &:focus {
      opacity: 1;
    }
  }
}
</style>
