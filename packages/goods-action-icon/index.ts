import { VantComponent } from '../common/component';
import { link } from '../mixins/link';
import { button } from '../mixins/button';
import { openType } from '../mixins/open-type';

VantComponent({
  classes: ['icon-class', 'text-class'],

  mixins: [link, button, openType],

  props: {
    text: String,
    info: String,
    icon: String,
    disabled: Boolean,
    loading: Boolean
  },
  created: function() {
    console.log(this.is);
  },
  methods: {
    onClick(event: Weapp.Event) {
      this.$emit('click', event.detail);
      this.jumpLink();
    }
  }
});
