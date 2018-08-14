const COMPONENT_NAME_POPUP = 'popup'

Vue.component(COMPONENT_NAME_POPUP, {
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
    this.isPopupBoxShow && popupBoxChildren.push(h('div', {class: ['popup-box', this.transition]}, this.$slots.default))
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
