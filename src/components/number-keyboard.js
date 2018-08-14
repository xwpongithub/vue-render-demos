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
    const numberItems = []
    for (let i = 1;i< 10;i++) {
      numberItems.push(h('li', {
        key: i - 1,
        class: 'keyboard-number-item',
        on: {
          click: (e) => this.onNumberKeyClick(e, i - 1)
        }
      }, this.keyNumberList[i-1]))
    }
    let keyboardOperate
    if (this.type === 'professional') {
      keyboardOperate = h('div', {
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
      ])

      numberItems.push(h('li', {
        class: 'keyboard-number-item',
        on: {
          click: e => this.onNumberKeyClick(e, '.')
        }
      }, '.'))
      numberItems.push(h('li', {
        class: 'keyboard-number-item',
        on: {
          click: e => this.onNumberKeyClick(e, this.keyNumberList[9])
        }
      }, this.keyNumberList[9]))
      if (this.isView) {
        numberItems.push(h('li', {
          class: 'keyboard-number-item'
        }))
      } else {
        numberItems.push(h('li', {
          class: ['keyboard-number-item', 'no-bg', 'delete'],
          on: {
            click: e => this.onDeleteClick(e)
          }
        }))
      }
    } else {
      numberItems.push(h('li', {
        class: ['keyboard-number-item','no-bg']
      }))
      numberItems.push(h('li', {
        class: 'keyboard-number-item',
        on: {
          click: e => this.onNumberKeyClick(e, this.keyNumberList[9])
        }
      },this.keyNumberList[9]))
      numberItems.push(h('li', {
        class: ['keyboard-number-item', 'no-bg', 'delete'],
        on: {
          click: e => this.onDeleteClick(e)
        }
      }))
    }
    const keyboardKeys = h('div', {
      class: 'keyboard-number'
    }, [
      h('ul', {
        class: 'keyboard-number-list'
      }, numberItems)
    ])
    keyboardContent.push(keyboardKeys)
    keyboardOperate && keyboardContent.push(keyboardOperate)
    return h('div', {
      class: ['number-keyboard-container', this.type]
    }, keyboardContent)
  },
  methods: {
    onNumberKeyClick(e, val) {
      e.stopImmediatePropagation()
      this.$emit('enter', val)
    },
    onDeleteClick(e) {
      e.stopImmediatePropagation()
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
