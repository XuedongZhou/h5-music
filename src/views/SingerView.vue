<template>
  <div v-loading="loading">
    <ul>
      <li class="item" v-for="item in list" :key="item.id">
        <router-link class="artist" :to="{ name: 'hot-song', query: { id: item.id, avatar: item.img1v1Url } }">
          <img class="avatar" v-lazy="item.img1v1Url + '?imageView&thumbnail=80y80&quality=100&tostatic=0'" alt="" />
          <div class="name">
            {{ item.name }} <span>{{ item.alias?.length ? `（${item.alias[0]}）` : null }}</span>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { queryArtists } from '@/services/api';
import type { Artist } from '@/services/interface';
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  setup() {
    const list = ref<Artist[]>([]);
    const loading = ref(false);

    const getArtists = async () => {
      try {
        loading.value = true;
        const res = await queryArtists();
        list.value = list.value.concat(res.artists);
      } catch (error) {
        console.error(error);
      }
      loading.value = false;
    };

    onMounted(() => {
      getArtists();
    });

    return { list, loading };
  }
});
</script>

<style scoped lang="scss">
.item {
  padding: 0.75rem 1rem;

  .avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
  }

  .name {
    margin-left: 1rem;
    font-size: 1rem;
  }
}

.artist {
  display: flex;
  align-items: center;
}
</style>
