const KeyboardContainer = Vue.extend({
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
          class: ['keyboard-number-item', 'slidedown'],
          on: {
            click: e => this.onSlideDoneClick(e)
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
    onSlideDoneClick() {
      this.$emit('hide')
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

const Popup = Vue.extend({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    hasMask: {
      type: Boolean,
      default: true
    },
    position: {
      type: String,
      default: 'center',
    },
    maskClosable: {
      type: Boolean,
      default: true,
    },
    transition: {
      type: String,
      default() {
        switch (this.position) {
          case 'bottom':
            return 'slide-up'
          case 'top':
            return 'slide-down'
          case 'left':
            return 'slide-right'
          case 'right':
            return 'slide-left'
          default:
            return 'fade'
        }
      }
    },
    preventScroll: {
      type: Boolean,
      default: false,
    },
    preventScrollExclude: {
      type: [String, HTMLElement],
      default() {
        return ''
      },
    }
  },
  data() {
    return {
      // controle popup mask & popup box
      isPopupShow: false,
      // controle popup box
      isPopupBoxShow: false,
      // transtion lock
      isAnimation: false
    }
  },
  mounted() {
    this.$nextTick(() => this.value && this.show())
  },
  render(h) {
    let popupContainerCls = ['popup', this.position]
    this.hasMask && popupContainerCls.push('with-mask')
    let maskChildren = []
    let popupBoxChildren = []
    this.hasMask && this.isPopupBoxShow && maskChildren.push(h('div', {
      class: 'popup-mask',
      on: {
        click: this.popupMaskClick
      }
    }))
    // maskChildren.push(h('div', {
    //   class: 'popup-mask',
    //   on: {
    //     click: this.popupMaskClick
    //   },
    //   style: {
    //     display: this.hasMask && this.isPopupBoxShow ? 'block':'none'
    //   }
    // }))

    if(this.isPopupBoxShow) {
      popupBoxChildren.push(h('div', {
        class: ['popup-box', this.transition]
      }, this.$slots.default))
    }
    // popupBoxChildren.push(h('div', {
    //   class: ['popup-box', this.transition],
    //   style: {
    //     display: this.isPopupBoxShow ? undefined:'none'
    //   }
    // }, this.$slots.default))

    return h('div', {
      style: {
        display: this.isPopupShow ? undefined: 'none'
      },
      class: popupContainerCls
    }, [
      h('transition', {
        props: {
          name: 'fade'
        }
      }, maskChildren),
      h('transition', {
        props: {
          name: this.transition
        },
        on: {
          'before-enter': this.popupTransitionStart,
          'before-leave': this.popupTransitionStart,
          'after-enter':  this.popupTransitionEnd,
          'after-leave': this.popupTransitionEnd
        }
      }, popupBoxChildren)
    ])
  },
  methods: {
    show() {
      this.isPopupShow = true
      this.isAnimation = true
      this.$nextTick(() => this.isPopupBoxShow = true)
      this.preventScroll && this._preventScroll(true)
    },
    hide() {
      this.isAnimation = true
      this.isPopupBoxShow = false
      this.preventScroll && this._preventScroll(false)
      this.$emit('input', false)
    },
    popupMaskClick() {
      if (this.maskClosable) {
        this.hide()
        this.$emit('mask-click')
      }
    },
    _preventScroll(isBind) {
      const handler = isBind ? 'addEventListener' : 'removeEventListener'
      const masker = this.$el.querySelector('.md-popup-mask')
      const boxer = this.$el.querySelector('.md-popup-box')
      masker && masker[handler]('touchmove', this._preventDefault, false)
      boxer && boxer[handler]('touchmove', this._preventDefault, false)
      this._preventScrollExclude(isBind)
    },
    _preventScrollExclude(isBind, preventScrollExclude) {
      const handler = isBind ? 'addEventListener' : 'removeEventListener'
      preventScrollExclude = preventScrollExclude || this.preventScrollExclude
      const excluder =
        preventScrollExclude && typeof preventScrollExclude === 'string'
          ? this.$el.querySelector(preventScrollExclude)
          : preventScrollExclude
      excluder && excluder[handler]('touchmove', this._stopImmediatePropagation, false)
    },
    _stopImmediatePropagation(e) {
      e.stopImmediatePropagation()
    },
    _preventDefault(e) {
      e.preventDefault()
    },
    popupTransitionStart() {
      if (!this.isPopupBoxShow) {
        this.$emit('before-hide')
      } else {
        this.$emit('before-show')
      }
    },
    popupTransitionEnd() {
      if (!this.isAnimation) {
        return
      }
      if (!this.isPopupBoxShow) {
        // popup hide after popup box finish animation
        this.isPopupShow = false
        this.$emit('hide')
      } else {
        this.$emit('show')
      }
      this.isAnimation = false
    }
  },
  watch: {
    value(val) {
      if (val) {
        if (this.isAnimation) {
          setTimeout(() => this.show(), 50)
        } else {
          this.show()
        }
      } else {
        this.hide()
      }
    },
    preventScrollExclude(val, oldVal) {
      // remove old listener before add
      this._preventScrollExclude(false, oldVal)
      this._preventScrollExclude(true, val)
    }
  }
})

const NumberKeyboard = {
  name: 'app-number-keyboard',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    type: {
      // simple, professional
      type: String,
    },
    isView: {
      type: Boolean,
      default: false,
    },
    disorder: {
      type: Boolean,
    },
    okText: {
      type: String,
    },
  },
  data() {
    return {
      isKeyboardShow: false,
    }
  },
  mounted() {
    this.$nextTick(() => this.value && (this.isKeyboardShow = this.value))
  },
  render(h) {
    const keyboardWrapper = []
    if (this.isView) {
      keyboardWrapper.push(h(KeyboardContainer, {
        props: {
          type: this.type,
          disorder: this.disorder,
          'ok-text': this.okText,
          'is-view': this.isView
        },
        on: {
          enter: this.onEnter,
          delete: this.onDelete,
          confirm: this.onConfirm,
          hide: () => this.isKeyboardShow = false,
        }
      }))
    } else {
      keyboardWrapper.push(h(Popup, {
        props: {
          value:  this.isKeyboardShow,
          position: 'bottom',
          'has-mask': false
        },
        on: {
          input: val => this.isKeyboardShow = val,
          show: () => this.$emit('show'),
          hide: () => this.$emit('hide')
        }
      },
        [h(KeyboardContainer, {
          props: {
            type: this.type,
            disorder: this.disorder,
            'ok-text': this.okText,
            'is-view': this.isView
          },
          on: {
            enter: this.onEnter,
            delete: this.onDelete,
            confirm: this.onConfirm,
            hide: () => this.isKeyboardShow = false
          }
        })]
      ))
    }
    return h('div', {
      class: {
        'number-keyboard': true,
        'in-view': this.isView
      }
    }, keyboardWrapper)
  },
  methods: {
    show() {
      this.isKeyboardShow = true
    },
    hide() {
      this.isKeyboardShow = false
    },
    onEnter(val) {
      this.$emit('enter', val)
    },
    onDelete() {
      this.$emit('delete')
    },
    onConfirm() {
      this.$emit('confirm')
      this.hide()
    }
  },
  watch: {
    value(val) {
      this.isKeyboardShow = val
    },
    isKeyboardShow(val) {
      this.$emit('input', val)
    },
  }
}

NumberKeyboard.install = function(Vue) {
  Vue.component(NumberKeyboard.name, NumberKeyboard)
  addNumberKeyboard(Vue, NumberKeyboard)
}

function addNumberKeyboard(Vue, NumberKeyboard) {
  createAPI(Vue, NumberKeyboard, ['show', 'hide'], true)
}

function createAPI(Vue, Component, events, single) {
  // 创建加载组件方法名称
  const createName = processComponentName(Component, {
    prefix: '$create-'
  })
  const api = createAPIComponent.apply(this, arguments)
  Vue.prototype[createName] = api.create
  Component.$create = api.create
  return api
}

// 构造一个API对象
function createAPIComponent(Vue, Component, events = [], single = false) {
  let singleComponent
  let singleInstance
  const beforeFns = []
  const api = {
    before(fn) {
      beforeFns.push(fn)
    },
    open(data, renderFn, options) {
      if (typeof renderFn !== 'function' && options === undefined) {
        options = renderFn
        renderFn = null
      }
      let instanceSingle = options
      if (typeof options === 'object') {
        instanceSingle = options.single
        delete options.single
      }
      beforeFns.forEach(before => before(data, renderFn, instanceSingle))
      if (instanceSingle === undefined) {
        instanceSingle = single
      }
      if (instanceSingle && singleComponent) {
        singleInstance.updateRenderData(data, renderFn)
        // visibility mixin watch visible should not hide
        singleComponent._createAPI_reuse = true
        singleInstance.$forceUpdate()
        const oldVisible = singleComponent.visible
        singleComponent.$nextTick(() => {
          singleComponent._createAPI_reuse = false
          // prop visible true -> to
          if (oldVisible && singleComponent.visible) {
            singleComponent.show()
          }
        })
        // singleComponent.show && singleComponent.show()
        return singleComponent
      }
      const component = instantiateComponent(Vue, Component, data, renderFn, options)
      const instance = component.$parent

      const originRemove = component.remove
      component.remove = function () {
        if (instance.__app__destroyed) {
          return
        }
        originRemove && originRemove.call(this)
        instance.destroy()
        instance.__app__destroyed = true
        if (instanceSingle) {
          singleComponent = null
          singleInstance = null
        }
      }

      const originShow = component.show
      component.show = function () {
        originShow && originShow.call(this)
        return this
      }

      const originHide = component.hide
      component.hide = function () {
        originHide && originHide.call(this)
        return this
      }

      if (instanceSingle) {
        singleComponent = component
        singleInstance = instance
      }
      return component
    },
    create(config, renderFn, single) {
      const ownerInstance = this
      const isInVueInstance = !!ownerInstance.$on
      const renderData = parseRenderData(config, events)

      cancelWatchProps()
      processProps()
      processEvents()
      process$()

      if (typeof renderFn !== 'function' && single === undefined) {
        single = renderFn
        renderFn = null
      }

      const options = {
        single: single
      }

      if (isInVueInstance) {
        options.parent = ownerInstance
      }

      const eventBeforeDestroy = 'hook:beforeDestroy'
      const component = api.open(renderData, renderFn, options)
      let oldOwnerInstance = component.__app__parent
      if (oldOwnerInstance !== ownerInstance) {
        if (oldOwnerInstance) {
          oldOwnerInstance.$off(eventBeforeDestroy, oldOwnerInstance.__app_destroy_handler)
          oldOwnerInstance.__app_destroy_handler = null
        }
        oldOwnerInstance = component.__app__parent = ownerInstance
        const beforeDestroy = function () {
          cancelWatchProps()
          if (oldOwnerInstance === ownerInstance) {
            component.remove()
            oldOwnerInstance = component.__app__parent = null
          }
          ownerInstance.$off(eventBeforeDestroy, beforeDestroy)
        }
        if (isInVueInstance) {
          ownerInstance.__app_destroy_handler = beforeDestroy
          ownerInstance.$on(eventBeforeDestroy, beforeDestroy)
        }
      }
      return component

      function cancelWatchProps() {
        if (ownerInstance.__createAPI_watcher) {
          ownerInstance.__createAPI_watcher()
          ownerInstance.__createAPI_watcher = null
        }
      }
      function processProps() {
        const $props = renderData.props.$props
        if ($props) {
          delete renderData.props.$props
          const watchKeys = []
          const watchPropKeys = []
          Object.keys($props).forEach((key) => {
            const propKey = $props[key]
            if (typeof propKey === 'string' && propKey in ownerInstance) {
              // get instance value
              renderData.props[key] = ownerInstance[propKey]
              watchKeys.push(key)
              watchPropKeys.push(propKey)
            } else {
              renderData.props[key] = propKey
            }
          })
          if (isInVueInstance) {
            ownerInstance.__createAPI_watcher = ownerInstance.$watch(function () {
              const props = {}
              watchKeys.forEach((key, i) => {
                props[key] = ownerInstance[watchPropKeys[i]]
              })
              return props
            }, function (newProps) {
              component && component.$updateProps(newProps)
            })
          }
        }
      }
      function processEvents() {
        const $events = renderData.props.$events
        if ($events) {
          delete renderData.props.$events

          Object.keys($events).forEach((event) => {
            let eventHandler = $events[event]
            if (typeof eventHandler === 'string') {
              eventHandler = ownerInstance[eventHandler]
            }
            renderData.on[event] = eventHandler
          })
        }
      }
      function process$() {
        const props = renderData.props
        Object.keys(props).forEach((prop) => {
          if (prop.charAt(0) === '$') {
            renderData[prop.slice(1)] = props[prop]
            delete props[prop]
          }
        })
      }

    }
  }
  return api
}

function instantiateComponent(Vue, Component, data, renderFn, options) {
  let renderData
  let childrenRenderFn
  if (options === undefined) options = {}
  const instance = new Vue({
    ...options,
    render(h) {
      let children = childrenRenderFn && childrenRenderFn(h)
      if (children && !Array.isArray(children)) {
        children = [children]
      }
      // {...renderData}: fix #128, caused by vue modified the parameter in the version of 2.5.14+, which related to vue issue #7294.
      return h(Component, {...renderData}, children || [])
    },
    methods: {
      init() {
        document.body.appendChild(this.$el)
      },
      destroy() {
        this.$destroy()
        document.body.removeChild(this.$el)
      }
    }
  })
  instance.updateRenderData = function (data, render) {
    renderData = data
    childrenRenderFn = render
  }
  instance.updateRenderData(data, renderFn)
  instance.$mount()
  instance.init()
  const component = instance.$children[0]
  component.$updateProps = function (props) {
    Object.assign(renderData.props, props)
    instance.$forceUpdate()
  }
  return component
}
