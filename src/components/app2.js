const COMPONENT_NAME_APP = 'app'

const _data = []

for (let i = 0;i<10;i++) {
  _data.push(`我是第${i}条数据`)
}

Vue.component(COMPONENT_NAME_APP, {
  data() {
    return {
      items: _data,
      pullDownRefresh: true,
      pullDownRefreshThreshold: 60,
      pullDownRefreshStop: 40,
      pullDownRefreshTxt: '刷新成功',
      pullUpLoad: true,
      pullUpLoadThreshold: 0,
      pullUpLoadMoreTxt: '加载更多',
      pullUpLoadNoMoreTxt: '到底了',
      customPullDown: false
    }
  },
  computed: {
    options() {
      return {
        pullDownRefresh: this.pullDownRefreshObj,
        pullUpLoad: this.pullUpLoadObj,
        scrollbar: true
      }
    },
    pullDownRefreshObj() {
      return this.pullDownRefresh ? {
        threshold: parseInt(this.pullDownRefreshThreshold),
        txt: this.pullDownRefreshTxt
      } : false
    },
    pullUpLoadObj() {
      return this.pullUpLoad ? {
        threshold: parseInt(this.pullUpLoadThreshold),
        txt: {
          more: this.pullUpLoadMoreTxt,
          noMore: this.pullUpLoadNoMoreTxt
        }
      } : false
    }
  },
  render(h) {
    return h('div', {
      attrs: {
        id: 'app'
      }
    }, [
      h(COMPONENT_NAME_SCROLL, {
        ref: 'scroll',
        props: {
          options: this.options,
          data: this.items
        },
        on: {
          'pulling-down': this.onPullingDown,
          'pulling-up': this.onPullingUp
        },
        scopedSlots: {
          pullDown: props => {
              const beforeTrigger = h('div', {
                class: 'before-trigger',
                style: {
                  display: props.beforePullDown ? undefined : 'none'
                }
              }, [h('span', {
                class: {
                  rotate: props.bubbleY > 40
                }
              }, '↓')])
              const afterTrigger = h('div', {
                class: 'after-trigger',
                style: {
                  display: !props.beforePullDown ? undefined : 'none'
                }
              }, [
                h('div', {
                  class: 'loading',
                  style: {
                    display:props.isPullingDown ? undefined : 'none'
                  }
                }, [h(COMPONENT_NAME_LOADING)]),
                h('div', {
                  class: 'c-pull-down-loaded',
                  style: {
                    display:!props.isPullingDown ? undefined : 'none'
                  }
                }, [
                  h('span', props.refreshTxt)
                ])
              ])
              return h('div', {
                class: 'c-pull-down-wrapper',
                style: props.pullDownStyle
              }, [
                beforeTrigger,
                afterTrigger
              ])
          }
        }
      }, [
        h('div', {
          slot: 'pullDown'
        })
      ])
    ])
  },
  methods: {
    onPullingDown() {
      // 模拟更新数据
      setTimeout(() => {
        if (Math.random() > 0.5) {
          // 如果有新数据
          this.items.unshift(_data[1])
        } else {
          // 如果没有新数据
          this.$refs.scroll.forceUpdate()
        }
      }, 1000)
    },
    onPullingUp() {
      // 更新数据
      setTimeout(() => {
        if (Math.random() > 0.5) {
          // 如果有新数据
          this.items = this.items.concat(_data)
        } else {
          // 如果没有新数据
          this.$refs.scroll.forceUpdate()
        }
      }, 1000)
    }
  }
})
