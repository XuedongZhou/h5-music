import { addClass, removeClass } from '@/assets/js/dom';
import { createApp, type Directive } from 'vue';
import HLoading from './HLoading.vue';

const relativeCls = 'h-reactive';

function append(el: any) {
  const style = getComputedStyle(el);
  if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
    addClass(el, relativeCls);
  }
  el.appendChild(el.instance.$el);
}

function remove(el: any) {
  removeClass(el, relativeCls);
  el.removeChild(el.instance.$el);
}

const loadingDirective: Directive = {
  mounted(el, binding) {
    const app = createApp(HLoading);
    const instance = app.mount(document.createElement('div'));
    el.instance = instance;

    const title = binding.arg;
    if (typeof title === 'string') {
      el.instance.setTitle(title);
    }

    if (binding.value) {
      append(el);
    }
  },
  updated(el, binding) {
    const title = binding.arg;
    if (typeof title === 'string') {
      el.instance.setTitle(title);
    }
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el);
    }
  }
};

export default loadingDirective;
