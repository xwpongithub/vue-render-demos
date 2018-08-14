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
      h(COMPONENT_NAME_NUMBER_KEYBOARD_CONTAINER)
    ])
  }
})
