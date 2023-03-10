<template>
  <div>
    <header>
      <div class="img-container">
        <img :src="data?.coverImgUrl" alt="" />
      </div>
      <div class="info">
        <h2 class="title">{{ data?.name }}</h2>
        <p class="desc">{{ data?.description }}</p>
      </div>
    </header>
    <main>
      <HSimpleSongList :list="data?.tracks" />
    </main>
  </div>
</template>

<script lang="ts">
import { queryTopListByIdx } from '@/services/api';
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import HSimpleSongList from '@/components/song/HSimpleSongList.vue';
import type { TopListDetail } from '@/services/interface';

export default defineComponent({
  components: {
    HSimpleSongList
  },
  setup() {
    const data = ref<TopListDetail>();

    const route = useRoute();

    const getTopListByIdx = async (id: string) => {
      try {
        const res = await queryTopListByIdx({ id });
        data.value = res.playlist;
      } catch (error) {
        console.error(error);
      }
    };

    onMounted(() => {
      const query = route.query;
      const id = query['id'] as string;
      if (id) {
        getTopListByIdx(id);
      }
    });
    return {
      data
    };
  }
});
</script>

<style scoped lang="scss">
header {
  display: flex;
  margin-bottom: 1rem;

  .img-container {
    flex: 1;

    img {
      width: 100%;
    }
  }

  .info {
    padding: 1rem;
    flex: 1;

    .title {
      margin-bottom: 0.25rem;
      font-weight: 400;
      font-size: 1.25rem;
    }

    .desc {
      font-size: 0.875rem;
    }
  }
}
</style>
