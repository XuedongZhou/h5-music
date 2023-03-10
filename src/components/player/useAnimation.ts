import { ref } from 'vue';
import animations from 'create-keyframe-animation';

export default function useAnimation() {
  const cdWrapperRef = ref<HTMLElement>();
  let entering = false;
  let leaving = false;

  function getPosAndScale() {
    const targetWidth = 40;
    const paddingLeft = 40;
    const paddingBottom = 30;
    const paddingTop = 80;
    const width = window.innerWidth * 0.7;
    const x = -(window.innerWidth / 2 - paddingLeft);
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
    const scale = targetWidth / width;

    return {
      x,
      y,
      scale
    };
  }

  function enter(el: Element, done: any) {
    if (leaving) {
      afterLeave();
    }

    entering = true;
    const { x, y, scale } = getPosAndScale();

    const animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      100: {
        transform: 'translate3d(0, 0, 0) scale(1)'
      }
    };

    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 600,
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
      }
    });

    if (cdWrapperRef.value) {
      animations.runAnimation(cdWrapperRef.value, 'move', done);
    }
  }

  function afterEnter() {
    entering = false;
    animations.unregisterAnimation('move');
    if (cdWrapperRef.value) {
      cdWrapperRef.value.style.animation = '';
    }
  }

  function leave(el: Element, done: any) {
    if (entering) {
      afterEnter();
    }
    leaving = true;
    const { x, y, scale } = getPosAndScale();
    const cdWrapperEl = cdWrapperRef.value;

    if (cdWrapperEl) {
      cdWrapperEl.style.transition = 'all .6s cubic-bezier(0.45, 0, 0.55, 1)';
      cdWrapperEl.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      cdWrapperEl.addEventListener('transitionend', next);
    }

    function next() {
      if (cdWrapperEl) {
        cdWrapperEl.removeEventListener('transitionend', next);
        done();
      }
    }
  }

  function afterLeave() {
    leaving = false;
    const cdWrapperEl = cdWrapperRef.value;

    if (cdWrapperEl) {
      cdWrapperEl.style.transition = '';
      cdWrapperEl.style.transform = '';
    }
  }

  return {
    cdWrapperRef,
    enter,
    afterEnter,
    leave,
    afterLeave
  };
}
