<template>
  <div v-loading="loading">
    <div class="top-list">
      <router-link
        v-for="item in list"
        :key="item.id"
        :to="{ path: '/top-list', query: { id: item.id } }"
      >
        <div class="item">
          <img width="100" height="100" :src="item.coverImgUrl" alt="" />
        </div>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { queryTopList } from '@/services/api';
import type { TopList } from '@/services/interface';
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  setup() {
    const list = ref<TopList[]>();
    const loading = ref(false);
    const getTopList = async () => {
      try {
        loading.value = true;
        const res = await queryTopList();
        list.value = res.list.filter((item) => !!item.ToplistType);
      } catch (error) {
        console.error(error);
      }
      loading.value = false;
    };
    onMounted(() => {
      getTopList();
    });
    return {
      list,
      loading
    };
  }
});
</script>

<style scoped lang="scss">
.top-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 1rem;
  grid-row-gap: 0.5rem;
  place-items: center;
  padding-top: 1rem;

  .item {
    line-height: 0;
  }
}
</style>
