const COMPONENT_NAME_APP = 'app'

Vue.component(COMPONENT_NAME_APP, {
  data() {
    return {
      popShow: false
    }
  },
  render(h) {
    return h('div', {
      attrs: {
        id: 'app'
      }
    }, [
      h(COMPONENT_NAME_POPUP, {
          props: {
            value: this.popShow
          },
          on: {
            input: () => this.popShow = false
          }
        }, [h('div', {class: 'popup-content'}, '我是一个弹窗')]),
      h('button', {
        on: {
          click: this.showPopupHandler
        }
      }, '显示'),
      h('button', {
        on: {
          click: this.hidePopupHandler
        }
      }, '隐藏')
    ])
  },
  methods: {
    showPopupHandler() {
      this.popShow = true
    },
    hidePopupHandler() {
      this.popShow = false
    }
  }
})
