<template>
  <teleport to="body">
    <transition name="confirm-fade">
      <div class="confirm" v-show="visible">
        <div class="confirm-wrapper">
          <div class="confirm-content">
            <p class="text">{{ text }}</p>
            <div class="operate">
              <div class="operate-btn left" @click="confirm">{{ confirmBtnText }}</div>
              <div class="operate-btn" @click="cancel">{{ cancelBtnText }}</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    text: {
      type: String,
      default: ''
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    }
  },
  emits: ['confirm', 'cancel'],
  setup(props, { emit }) {
    const visible = ref();

    function hide() {
      visible.value = false;
    }
    function show() {
      visible.value = true;
    }

    function confirm() {
      hide();
      emit('confirm');
    }
    function cancel() {
      hide();
      emit('cancel');
    }

    return { visible, show, hide, confirm, cancel };
  }
});
</script>

<style scoped lang="scss">
.confirm {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 998;
  background-color: rgba($color: #000000, $alpha: 0.01);

  &.confirm-fade-enter-active {
    animation: confirm-fade-in 0.3s;

    .confirm-content {
      animation: confirm-zoom-in 0.3s;
    }
  }

  &.confirm-fade-leave-active {
    animation: confirm-fadeout 0.3s;

    .confirm-content {
      animation: confirm-zoom-out 0.3s;
    }
  }

  .confirm-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;

    .confirm-content {
      width: 270px;
      border-radius: 13px;
      background: var(--color-background);

      .text {
        padding: 19px 15px;
        line-height: 22px;
        text-align: center;
        font-size: 1rem;
        color: var(--color-text);
      }

      .operate {
        display: flex;
        align-items: center;
        text-align: center;
        font-size: 1rem;

        .operate-btn {
          flex: 1;
          line-height: 22px;
          padding: 10px 0;
          border-top: 1px solid var(--color-background);
          color: var(--color-text);

          &.left {
            border-right: 1px solid var(--color-background);
            color: var(--color-text);
          }
        }
      }
    }
  }
}

@keyframes confirm-fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes confirm-fadeout {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@keyframes confirm-zoom-in {
  0% {
    transform: scale(0);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes confirm-zoom-out {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0);
  }
}
</style>
