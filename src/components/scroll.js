const COMPONENT_NAME_SCROLL = 'c-scroll'

const DEFAULT_OPTIONS = {
  observeDOM: true,
  click: true,
  probeType: 1,
  scrollbar: false,
  pullDownRefresh: false,
  pullUpLoad: false
}

const DIRECTION_H = 'horizontal'
const DIRECTION_V = 'vertical'
const DEFAULT_REFRESH_TXT = '刷新成功'
const DEFAULT_STOP_TIME = 600

const EVENT_CLICK = 'click'
const EVENT_PULLING_DOWN = 'pulling-down'
const EVENT_PULLING_UP = 'pulling-up'

const EVENT_SCROLL = 'scroll'
const EVENT_BEFORE_SCROLL_START = 'before-scroll-start'
const EVENT_SCROLL_END = 'scroll-end'

const SCROLL_EVENTS = [EVENT_SCROLL, EVENT_BEFORE_SCROLL_START, EVENT_SCROLL_END]


Vue.component(COMPONENT_NAME_SCROLL, {
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    scrollEvents: {
      type: Array,
      default() {
        return []
      },
      validator(arr) {
        return arr.every(item => {
          return SCROLL_EVENTS.indexOf(item) > -1
        })
      }
    },
    direction: {
      type: String,
      default: DIRECTION_V
    },
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  data() {
    return {
      // 上拉加载相关data
      isPullUpLoad: false,
      pullUpDirty: true,
      // 下拉刷新相关data
      beforePullDown: true,
      isPullingDown: false,
      bubbleY: 0,
      pullDownStyle: '',
      pullDownStop: 40,
      pullDownHeight: 60
    }
  },
  computed: {
    pullUpLoad() {
      return this.options.pullUpLoad
    },
    pullUpTxt() {
      const pullUpLoad = this.pullUpLoad
      const txt = pullUpLoad && pullUpLoad.txt
      const moreTxt = (txt && txt.more) || ''
      const noMoreTxt = (txt && txt.noMore) || ''
      return this.pullUpDirty ? moreTxt : noMoreTxt
    },
    pullDownRefresh() {
      let pullDownRefresh = this.options.pullDownRefresh
      if (!pullDownRefresh) {
        return pullDownRefresh
      }
      if (pullDownRefresh === true) {
        pullDownRefresh = {}
      }
      return Object.assign({stop: this.pullDownStop}, pullDownRefresh)
    },
    refreshTxt() {
      const pullDownRefresh = this.pullDownRefresh
      return (pullDownRefresh && pullDownRefresh.txt) || DEFAULT_REFRESH_TXT
    }
  },
  mounted() {
    this.$nextTick(this.initScroll)
  },
  activated() {
    this.enable()
  },
  deactivated() {
    this.disable()
  },
  beforeDestroy() {
    this.destroy()
  },
  render(h) {
    /*=======渲染默认List start========*/
    let ListWrapperContent = []
    if (this.$slots.default) {
      ListWrapperContent.push(this.$slots.default)
    } else {
      ListWrapperContent.push(h('ul', {
        class: 'c-scroll-list'
      }, this.data.map((item,index) => {
        return h('li', {
          class: ['c-scroll-item', 'border-bottom-1px'],
          key: index,
          on: {
            click: e => this._clickHandler(item, e)
          }
        }, [item])
      })))
    }
    /*=======渲染默认List end========*/
    let ListWrapper = h('div', {
      ref: 'listWrapper',
      class: 'c-scroll-list-wrapper'
    }, ListWrapperContent)
    const wrapperContent = []
    const scrollContent = [
      ListWrapper
    ]

    /*=======渲染上拉加载 start=======*/
    if (this.pullUpLoad) {
      if (this.$slots.pullUp) {
        if (this.$scopedSlots.pullUp) {
          scrollContent.push(this.$scopedSlots.pullUp({
            pullUpLoad: this.pullUpLoad,
            isPullUpLoad: this.isPullUpLoad
          }))
        } else {
          scrollContent.push(this.$slots.pullUp)
        }
      } else {
        let trigger = h('div', {
          class: 'before-trigger'
        }, [
          h('span', this.pullUpTxt)
        ])
        if (this.isPullUpLoad) {
          trigger = h('div', {
            class: 'after-trigger'
          }, [
            h(COMPONENT_NAME_LOADING)
          ])
        }
        scrollContent.push(h('div', {class: 'c-pull-up-wrapper'}, [trigger]))
      }
    }
    /*=======渲染上拉加载 end=======*/
    wrapperContent.push(h('div', {
      class: 'c-scroll-content'
    }, scrollContent))

    /*=======下拉刷新加载 start=======*/
    if (this.pullDownRefresh) {
      if (this.$slots.pullDown) {
        if (this.$scopedSlots.pullDown) {
          wrapperContent.push(h('div', {
            ref: 'pulldown',
            class: 'c-pull-down',
          }, [this.$scopedSlots.pullDown({
            pullDownRefresh: this.pullDownRefresh,
            pullDownStyle: this.pullDownStyle,
            beforePullDown: this.beforePullDown,
            isPullingDown: this.isPullingDown,
            bubbleY: this.bubbleY,
            refreshTxt: this.refreshTxt
          })]))
        } else {
          wrapperContent.push(h('div', {
            ref: 'pulldown',
            class: 'c-pull-down',
          }, [this.$slots.pullDown]))
        }
      } else {
        const beforeTrigger = h('div', {
          class: 'before-trigger',
          style: {
            display: this.beforePullDown ? undefined : 'none'
          }
        }, [
          h(COMPONENT_NAME_BUBBLE, {
            class: 'bubble',
            props: {
              y: this.bubbleY
            }
        })])
        const afterTrigger = h('div', {
          class: 'after-trigger',
          style: {
            display: !this.beforePullDown ? undefined : 'none'
          }
        }, [
          h('div', {
            class: 'loading',
            style: {
              display:this.isPullingDown ? undefined : 'none'
            }
          }, [h(COMPONENT_NAME_LOADING)]),
          h('div', {
            class: 'c-pull-down-loaded',
            style: {
              display:!this.isPullingDown ? undefined : 'none'
            }
          }, [
            h('span', this.refreshTxt)
          ])
        ])
        wrapperContent.push(h('div', {
          ref: 'pulldown',
          class: 'c-pull-down'
        },[
          h('div', {
            style: this.pullDownStyle,
            class: 'c-pull-down-wrapper'
          }, [
            beforeTrigger,
            afterTrigger
          ])
        ]))
      }
    }
    /*=======下拉刷新加载 end=======*/
    return h('div', {
      ref: 'wrapper',
      class: 'c-scroll-wrapper'
    }, wrapperContent)
  },
  methods: {
    initScroll() {
      if (!this.$refs.wrapper) return
      this._calculateMinHeight()
      const options = Object.assign({}, DEFAULT_OPTIONS, {
        scrollY: this.direction === DIRECTION_V,
        scrollX: this.direction === DIRECTION_H,
        probeType: this.scrollEvents.indexOf(EVENT_SCROLL) !== -1 ? 3 : 1
      }, this.options)
      // 初始化better-scroll
      !this.scroll && (this.scroll = new BScroll(this.$refs.wrapper, options))
      // 开启事件监听
      this._listenScrollEvents()
      // 判断是否开启下拉刷新
      if (this.pullDownRefresh) {
        this._getPullDownEleHeight()
        this._onPullDownRefresh()
      }
      // 判断是否开启上拉加载
      if (this.pullUpLoad) this._onPullUpLoad()
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    refresh() {
      this._calculateMinHeight()
      this.scroll && this.scroll.refresh()
    },
    destroy() {
      this.scroll && this.scroll.destroy()
      this.scroll = null
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    },
    forceUpdate(dirty = false) {
      if (this.pullDownRefresh && this.isPullingDown) {
        this.isPullingDown = false
        this._reboundPullDown(() => {
          this._afterPullDown(dirty)
        })
      } else if (this.pullUpLoad && this.isPullUpLoad) {
        this.isPullUpLoad = false
        this.scroll.finishPullUp()
        this.pullUpDirty = dirty
        dirty && this.refresh()
      } else {
        dirty && this.refresh()
      }
    },
    resetPullUpTxt() {
      this.pullUpDirty = true
    },
    // 判断列表是否初始化后就具有弹动效果，如果开启上拉加载和下拉刷新的话就开启
    _calculateMinHeight() {
      if (this.$refs.listWrapper) {
        this.$refs.listWrapper.style.minHeight = this.pullDownRefresh || this.pullUpLoad ? `${getRect(this.$refs.wrapper).height + 1}px` : 0
      }
    },
    _listenScrollEvents() {
      this.scrollEvents.forEach(event => {
        this.scroll.on(camelize(event), ...args => {
          this.$emit(event, ...args)
        })
      })
    },
    _onPullUpLoad() {
      this.scroll.on('pullingUp', this._pullUpHandle)
    },
    _offPullUpLoad() {
      this.scroll.off('pullingUp', this._pullUpHandle)
    },
    _pullUpHandle() {
      this.isPullUpLoad = true
      this.$emit(EVENT_PULLING_UP)
    },
    _getPullDownEleHeight() {
      const pulldown = this.$refs.pulldown.firstChild
      this.pullDownHeight = getRect(pulldown).height
      this.beforePullDown = false
      this.isPullingDown = true
      this.$nextTick(() => {
        this.pullDownStop = getRect(pulldown).height
        this.beforePullDown = true
        this.isPullingDown = false
      })
    },
    _onPullDownRefresh() {
      this.scroll.on('pullingDown', this._pullDownHandle)
      this.scroll.on('scroll', this._pullDownScrollHandle)
    },
    _offPullDownRefresh() {
      this.scroll.off('pullingDown', this._pullDownHandle)
      this.scroll.off('scroll', this._pullDownScrollHandle)
    },
    _pullDownHandle() {
      if (this.resetPullDownTimer) clearTimeout(this.resetPullDownTimer)
      this.beforePullDown = false
      this.isPullingDown = true
      this.$emit(EVENT_PULLING_DOWN)
    },
    _pullDownScrollHandle(pos) {
      if (this.beforePullDown) {
        this.bubbleY = Math.max(0, pos.y - this.pullDownHeight)
        this.pullDownStyle = `top:${Math.min(pos.y - this.pullDownHeight, 0)}px`
      } else {
        this.bubbleY = 0
        this.pullDownStyle = `top:${Math.min(pos.y - this.pullDownStop, 0)}px`
      }
    },
    _reboundPullDown(next) {
      const {stopTime = DEFAULT_STOP_TIME} = this.pullDownRefresh
      setTimeout(() => {
        this.scroll.finishPullDown()
        next()
      }, stopTime)
    },
    _afterPullDown(dirty) {
      this.resetPullDownTimer = setTimeout(() => {
        this.pullDownStyle = `top: -${this.pullDownHeight}px`
        this.beforePullDown = true
        dirty && this.refresh()
      }, this.scroll.options.bounceTime)
    },
    _clickHandler(item,e) {
      this.$emit(EVENT_CLICK, item, e)
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.forceUpdate(true)
      }, this.refreshDelay)
    },
    pullDownRefresh: {
      handler(newVal, oldVal) {
        if (!this.scroll) return
        if (newVal) {
          this.scroll.openPullDown(newVal)
          if (!oldVal) {
            this._onPullDownRefresh()
            this._calculateMinHeight()
          }
        }
        if (!newVal && oldVal) {
          this.scroll.closePullDown()
          this._offPullDownRefresh()
          this._calculateMinHeight()
        }
      },
      deep: true
    },
    pullUpLoad: {
      handler(newVal, oldVal) {
        if (!this.scroll) return
        if (newVal) {
          this.scroll.openPullUp(newVal)
          if (!oldVal) {
            this._onPullUpLoad()
            this._calculateMinHeight()
          }
        }
        if (!newVal && oldVal) {
          this.scroll.closePullUp()
          this._offPullUpLoad()
          this._calculateMinHeight()
        }
      },
      deep: true
    }
  }
})
