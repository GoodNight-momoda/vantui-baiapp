import { VantComponent } from '../common/component';

VantComponent({
  field: true,

  relation: {
    name: 'radio-group',
    type: 'ancestor'
  },

  classes: ['icon-class', 'label-class'],

  props: {
    name: null,
    value: null,
    disabled: Boolean,
    labelDisabled: Boolean,
    labelPosition: String,
    checkedColor: String
  },

  methods: {
    emitChange(value) {
      const instance = this.getSlotParent() || this;
      instance.$emit('input', value);
      instance.$emit('change', value);
    },

    onChange(event: Weapp.Event) {
      this.emitChange(event.detail.value);
    },

    onClickLabel() {
      if (!this.data.disabled && !this.data.labelDisabled) {
        this.emitChange(this.data.name);
      }
    }
  }
});
