<template>
  <div class="tab">
    <router-link class="tab-item" v-for="tab in tabs" :key="tab.path" :to="tab.path">
      <span class="tab-link">{{ tab.name }}</span>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'HTab',
  data() {
    return {
      tabs: [
        {
          name: '推荐音乐',
          path: '/recommend'
        },
        {
          name: '排行榜',
          path: '/hot'
        },
        {
          name: '歌手',
          path: '/singer'
        },
        {
          name: '搜索',
          path: '/search'
        }
      ]
    };
  }
});
</script>

<style lang="scss" scoped>
.tab {
  display: flex;
  height: 2.5rem;
  line-height: 2.5rem;
  font-size: 1rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 2.35rem;
    left: 0;
    right: 0;
    height: 0.075rem;
    background-color: rgba($color: #000000, $alpha: 0.05);
  }

  .tab-item {
    flex: 1;
    text-align: center;

    .tab-link {
      padding-bottom: 0.5rem;
      color: var(--color-text);
    }

    &.router-link-active {
      .tab-link {
        color: var(--color-primary);
        border-bottom: 0.125rem solid var(--color-primary);
      }
    }
  }
}
</style>
