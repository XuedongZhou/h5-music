<template>
  <section class="search-history">
    <ul class="list">
      <li class="item" v-for="(item, index) in list" :key="item.first">
        <HIcon icon="icon-history" class="icon-history" />
        <div class="title" @click="() => selectedHistory(item.first, index)">
          {{ item.first }}
        </div>
        <figure class="close" @click="() => removeHistory(index)">
          <HIcon icon="icon-close" />
        </figure>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import HIcon from '@/components/icons/HIcon.vue';
import { storage } from '@/utils/storage';
import { SEARCH_KEY } from '@/config/constant';

export type SearchHistory = {
  first: string;
};

export default defineComponent({
  components: { HIcon },
  setup(props, ctx) {
    const list = ref<SearchHistory[]>([]);

    onMounted(() => {
      const data = storage.get(SEARCH_KEY) as SearchHistory[];
      const historyList = data ? data : [];
      list.value = historyList;
    });

    const selectedHistory = (history: string, index: number) => {
      ctx.emit('select', history);
      removeHistory(index);
    };

    const removeHistory = (index: number) => {
      list.value.splice(index, 1);
      storage.set(SEARCH_KEY, list.value, null);
    };

    return { list, selectedHistory, removeHistory };
  }
});
</script>

<style scoped lang="scss">
.item {
  display: flex;
  align-items: center;
  height: 2.5rem;
  border-bottom: 1px solid var(--color-border);

  .icon {
    color: var(--color-text-3);
    font-size: 1rem;
  }

  .title {
    line-height: 2.5rem;
    height: 2.5rem;
    flex: 1;
    overflow: hidden;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: normal;
  }

  .icon-history {
    margin: 0 0.5rem;
  }
}

.close {
  line-height: 2.5rem;
  height: 2.5rem;
  padding: 0 0.5rem;
}
</style>
