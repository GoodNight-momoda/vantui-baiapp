import { VantComponent } from '../common/component';
import { pickerProps } from './shared';

interface Column {
  values: object[];
  defaultIndex?: number;
}

VantComponent({
  props: {
    ...pickerProps,
    activeClass:{
      type: String,
      value: ''
    },
    toolbarClass:{
      type: String,
      value: ''
    },
    columnClass:{
      type: String,
      value: ''
    },
    valueKey: {
      type: String,
      value: 'text'
    },
    defaultIndex: {
      type: Number,
      value: 0
    },
    columns: {
      type: Array,
      value: [],
      observer(columns = []) {
        this.simple = columns.length && !columns[0].values;
        this.children = this.selectAllComponents('.column');

        if (Array.isArray(this.children) && this.children.length) {
          this.setColumns().catch(() => {});
        }
      }
    }
  },

  beforeCreate() {
    this.children = [];
  },
  mounted() {
    this.children = this.selectAllComponents('.column');
    let columns = this.data.columns;
    this.setData({
      simple: columns.length && !columns[0].values
    });

    if (Array.isArray(this.children) && this.children.length) {
          this.setColumns().catch(() => {});
    }
  },
  methods: {
    noop() {},

    setColumns() {
      const { data } = this;
      const columns = this.simple ? [{ values: data.columns }] : data.columns;
      const stack = columns.map((column: Column, index: number) =>
        this.setColumnValues(index, column.values)
      );
      return Promise.all(stack);
    },

    emit(event: Weapp.Event) {
      const { type } = event.currentTarget.dataset;
      if (this.simple) {
        this.$emit(type, {
          value: this.getColumnValue(0),
          index: this.getColumnIndex(0)
        });
      } else {
        this.$emit(type, {
          value: this.getValues(),
          index: this.getIndexes()
        });
      }
    },

    onChange(event: Weapp.Event) {
      console.log('getColumnValue', this.getColumnValue(0))
      console.log('simple', this.simple)
      if (this.simple) {
        this.$emit('change', {
          pickerId: this.nodeId,
          value: this.getColumnValue(0),
          index: this.getColumnIndex(0)
        });
      } else {
        this.$emit('change', {
          pickerId: this.nodeId,
          value: this.getValues(),
          index: event.currentTarget.dataset.index
        });
      }
    },

    // get column instance by index
    getColumn(index: number) {
      this.children = this.selectAllComponents('.column');
      return this.children[index];
    },

    // get column value by index
    getColumnValue(index: number) {
      const column = this.getColumn(index);
      return column && column.getValue();
    },

    // set column value by index
    setColumnValue(index: number, value: any) {
      const column = this.getColumn(index);
      
      if (column == null) {
        // 百度小程序watcher 先与 created
        return false;
        // return Promise.reject('setColumnValue: 对应列不存在');
      }

      return column.setValue(value);
    },

    // get column option index by column index
    getColumnIndex(columnIndex: number) {
      return (this.getColumn(columnIndex) || {}).data.currentIndex;
    },

    // set column option index by column index
    setColumnIndex(columnIndex: number, optionIndex: number) {
      const column = this.getColumn(columnIndex);

      if (column == null) {
        return false;
        // return Promise.reject('setColumnIndex: 对应列不存在');
      }

      return column.setIndex(optionIndex);
    },

    // get options of column by index
    getColumnValues(index: number) {
      return (this.getColumn(index) || {}).data.options;
    },

    // set options of column by index
    setColumnValues(index: number, options: any[], needReset = true) {
      const column = this.getColumn(index);

      if (column == null) {
        return false;
        // return Promise.reject('setColumnValues: 对应列不存在');
      }

      const isSame =
        JSON.stringify(column.data.options) === JSON.stringify(options);

      if (isSame) {
        return Promise.resolve();
      }

      return column.set({ options }).then(() => {
        if (needReset) {
          column.setIndex(0);
        }
      });
    },

    // get values of all columns
    getValues() {
      return this.children.map((child: Weapp.Component) => child.getValue());
    },

    // set values of all columns
    setValues(values: []) {
      const stack = values.map((value, index) =>
        this.setColumnValue(index, value)
      );
      return Promise.all(stack);
    },

    // get indexes of all columns
    getIndexes() {
      return this.children.map(
        (child: Weapp.Component) => child.data.currentIndex
      );
    },

    // set indexes of all columns
    setIndexes(indexes: number[]) {
      const stack = indexes.map((optionIndex, columnIndex) =>
        this.setColumnIndex(columnIndex, optionIndex)
      );
      return Promise.all(stack);
    }
  }
});
