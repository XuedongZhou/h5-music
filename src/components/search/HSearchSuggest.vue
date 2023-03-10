<template>
  <section class="search-suggest" v-loading="searchSuggestLoading">
    <h3 class="title" @click="() => selectedSuggest(keywords)">搜索 “{{ keywords }}”</h3>
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-for="item in searchSuggest"
        :key="item.keyword"
        @click="() => selectedSuggest(item.keyword)"
      >
        <HIcon class="icon-search" icon="icon-search"></HIcon>
        <span>{{ item.keyword }}</span>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { querySearchSuggest } from '@/services/api';
import type { SearchSuggest } from '@/services/interface';
import { defineComponent, ref, watch } from 'vue';
import HIcon from '@/components/icons/HIcon.vue';

export default defineComponent({
  components: { HIcon },
  props: {
    keywords: { type: String, required: true }
  },
  emits: ['select'],
  setup(props, ctx) {
    const searchSuggest = ref<SearchSuggest[]>([]);
    const searchSuggestLoading = ref(false);

    const getSearchSuggest = async (keywords: string) => {
      searchSuggestLoading.value = true;
      try {
        const res = await querySearchSuggest({ type: 'mobile', keywords });
        searchSuggest.value = res.result.allMatch;
      } catch (error) {
        console.error(error);
      }
      searchSuggestLoading.value = false;
    };

    watch(
      () => props.keywords,
      (val, preVal) => {
        if (val !== preVal) {
          getSearchSuggest(val);
        }
      },
      { immediate: true }
    );

    const selectedSuggest = (suggest: string) => {
      ctx.emit('select', suggest);
    };

    return { searchSuggest, searchSuggestLoading, selectedSuggest };
  }
});
</script>

<style lang="scss" scoped>
.search-suggest {
  .title {
    color: var(--color-link);
    font-weight: 400;
    font-size: 1rem;
    margin-left: 0.5rem;
    height: 3rem;
    line-height: 3rem;
    border-bottom: 1px solid var(--color-border);
  }
}

.suggest-list {
  .suggest-item {
    display: flex;
    align-items: center;
    height: 2.5rem;
    font-size: 0.875rem;
    padding-left: 0.5rem;

    .icon-search {
      margin-right: 0.5rem;
      color: var(--color-text-second);
    }

    span {
      display: block;
      padding-right: 0.5rem;
      flex: 1;
      border-bottom: 1px solid var(--color-border);
      line-height: 2.5rem;
    }
  }
}
</style>
