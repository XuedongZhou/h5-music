import type { Directive } from 'vue';

const UNIQUE_ID = 'h_click_outside';

const clickEventType = () => {
  return document.ontouchstart !== null ? 'click' : 'touchstart';
};

const onUnmounted = (el: any) => {
  document.removeEventListener(clickEventType(), el[UNIQUE_ID], false);
  delete el[UNIQUE_ID];
};

const onMounted = (el: any, binding: any, vNode: any) => {
  onUnmounted(el);

  const vm = vNode.context;
  const callback = binding.value;

  let nextTick = false;
  setTimeout(function () {
    nextTick = true;
  }, 0);

  el[UNIQUE_ID] = (event: any) => {
    if (
      (!el || !el.contains(event.target)) &&
      callback &&
      nextTick &&
      typeof callback === 'function'
    ) {
      return callback.call(vm, event);
    }
  };

  document.addEventListener(clickEventType(), el[UNIQUE_ID], false);
};

const onUpdated = (el: any, binding: any, vNode: any) => {
  if (binding.value === binding.oldValue) {
    return;
  }
  onMounted(el, binding, vNode);
};

const clickOutsideDirective: Directive = {
  mounted: onMounted,
  updated: onUpdated,
  unmounted: onUnmounted
};

export default clickOutsideDirective;
