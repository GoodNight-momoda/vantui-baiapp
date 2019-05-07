import { VantComponent } from '../common/component';

VantComponent({
  relation: {
    type: 'ancestor',
    name: 'badge-group',
    linked(target: Weapp.Component) {
      this.parent = target;
    }
  },

  props: {
    info: null,
    title: String
  },

  methods: {
    onClick() {
      const parent = this.getSlotParent();

      if (!parent) {
        return;
      }

      const index = parent.badges.indexOf(this);

      parent.setActive(index).then(() => {
        this.$emit('click', index);
        parent.$emit('change', index);
      });
    },

    setActive(active: boolean) {
      return this.set({ active });
    }
  }
});
