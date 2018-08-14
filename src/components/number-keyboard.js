const COMPONENT_NAME_NUMBER_KEYBOARD_CONTAINER = 'number-keyboard-container'

Vue.component(COMPONENT_NAME_NUMBER_KEYBOARD_CONTAINER, {
  props: {
    type: {
      // simple, professional
      type: String,
      default: 'professional',
    },
    disorder: {
      type: Boolean,
      default: false,
    },
    okText: {
      type: String,
      default: '确定',
    },
    isView: {
      type: Boolean,
    }
  },
  data() {
    return {
      keyNumberList: [],
    }
  },
  created() {
    this._generateKeyNumber()
  },
  render(h) {
    const keyboardContent = []
    if (this.type === 'professional') {
      keyboardContent.push(h('div', {
        class: 'keyboard-operate'
      }, [
        h('ul', {
          class: 'keyboard-operate-list'
        }, [
          h('li', {
            class: ['keyboard-operate-item', 'delete'],
            on: {
              click: e => this.onDeleteClick(e)
            }
          }),
          h('li', {
            class: ['keyboard-operate-item', 'confirm'],
            on: {
              click: this.onConfirmClick
            }
          }, this.okText)
        ])
      ]))
    }
    return h('div', {
      class: ['number-keyboard-container', this.type]
    }, keyboardContent)
  },
  methods: {
    onDeleteClick() {
      event.stopImmediatePropagation()
      this.$emit('delete')
    },
    onConfirmClick() {
      this.$emit('confirm')
    },
    _generateKeyNumber() {
      const baseStack = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
      if (this.disorder) {
        let count = 0
        while (baseStack.length) {
          this.$set(this.keyNumberList, count, baseStack.splice(parseInt(Math.random() * baseStack.length), 1)[0] || 0)
          count++
        }
      } else {
        this.keyNumberList = baseStack
      }
    }
  }
})
