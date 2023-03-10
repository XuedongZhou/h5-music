<template>
  <div class="search-container">
    <form class="form">
      <HSearchInput v-model="keywords" @search="handleSearchInput" />
    </form>

    <div v-if="type === 'search'">
      <HSearchMatch :query="keywords" />
    </div>
    <div v-else-if="keywords">
      <HSearchSuggest :keywords="keywords" @select="handleSelected" />
    </div>

    <div v-else>
      <section class="hot-search" v-loading="hotSearchLoading">
        <h3 class="title">热门搜索</h3>
        <ul class="list">
          <li
            class="item"
            v-for="item in hotSearchList"
            :key="item.first"
            @click="() => handleSelected(item.first)"
          >
            {{ item.first }}
          </li>
        </ul>
      </section>

      <HSearchHistory @select="handleSelected" />
    </div>
  </div>
</template>

<script lang="ts">
import HSearchInput from '@/components/search/HSearchInput.vue';
import HSearchSuggest from '@/components/search/HSearchSuggest.vue';
import HSearchMatch from '@/components/search/HSearchMatch.vue';
import HSearchHistory from '@/components/search/HSearchHistory.vue';
import { querySearchHotDetail } from '@/services/api';
import type { HotSearch } from '@/services/interface';
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  components: {
    HSearchInput,
    HSearchSuggest,
    HSearchMatch,
    HSearchHistory
  },
  setup() {
    const hotSearchList = ref<HotSearch[]>([]);
    const hotSearchLoading = ref(false);

    const getSearchHotDetail = async () => {
      hotSearchLoading.value = true;
      try {
        const res = await querySearchHotDetail();
        hotSearchList.value = res.result.hots;
      } catch (error) {
        console.error(error);
      }
      hotSearchLoading.value = false;
    };

    onMounted(() => {
      getSearchHotDetail();
    });

    const type = ref<'input' | 'search'>('input');
    const keywords = ref('');

    const handleSearchInput = () => {
      type.value = 'input';
    };

    const handleSelected = (value: string) => {
      type.value = 'search';
      keywords.value = value;
    };

    return { hotSearchList, hotSearchLoading, type, keywords, handleSearchInput, handleSelected };
  }
});
</script>

<style lang="scss" scoped>
.form {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.hot-search {
  padding: 0.5rem 0.5rem 0.5rem;

  .title {
    font-size: 0.75rem;
    font-weight: 400;
    color: var(--color-text-second);
  }

  .list {
    margin: 0.5rem 0;

    .item {
      display: inline-block;
      height: 2rem;
      margin: 0 0.5rem 0.5rem 0;
      padding: 0 0.875rem;
      font-size: 0.875rem;
      line-height: 2rem;
      color: var(--color-text-second);
      border: 1px solid var(--color-border);
      border-radius: 2rem;
      color: var(--color-text);
    }
  }
}
</style>
