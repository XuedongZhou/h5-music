import {
  h,
  mergeProps,
  renderSlot,
  withCtx,
  ref,
  computed,
  watch,
  nextTick,
  defineComponent
} from 'vue';
import type { BScroll } from '@better-scroll/core/dist/types/BScroll';
import { usePlayerStore } from '@/stores/player';
import HScroll from '../scroll/HScroll.vue';

export default defineComponent({
  props: HScroll.props,
  emits: HScroll.emits,
  render(ctx: any) {
    return h(
      HScroll,
      mergeProps(
        {
          ref: 'scrollRef'
        },
        ctx.$props,
        {
          onScroll: (e: any) => {
            ctx.$emit('scroll', e);
          }
        }
      ),
      {
        default: withCtx(() => {
          return [renderSlot(ctx.$slots, 'default')];
        })
      }
    );
  },

  setup() {
    const scrollRef = ref<BScroll>();

    const scroll = computed(() => {
      return scrollRef.value?.scroll;
    });

    const store = usePlayerStore();
    const playlist = computed(() => store.state.value.playlist);

    watch(playlist, async () => {
      await nextTick();
      scroll.value.refresh();
    });

    return { scrollRef, scroll };
  }
});
