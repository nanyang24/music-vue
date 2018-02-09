<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  const DIRECTION_H = 'horizontal'
  const DIRECTION_V = 'vertical'

  export default {
    props: {
      probeType: {
        type: Number,
        defalut: 1
      },
      click: {
        type: Boolean,
        defalut: true
      },
      data: {
        type: Array,
        default: null
      },
      listenScroll: {
        type: Boolean,
        defalut: false
      },
      pullup: {
        type: Boolean,
        default: false
      },
      beforeScroll: {
        type: Boolean,
        default: false
      },
      refreshDelay: {
        type: Number,
        default: 20
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) return
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
//          eventPassthrough: this.direction === DIRECTION_V ? DIRECTION_H : DIRECTION_V
        })
        if (this.listenScroll) {
          let self = this
          this.scroll.on('scroll', (pos) => { // 实时监测滚动事件，派发事件 Y轴距离
            self.$emit('scroll', pos)
          })
        }
        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd') // 满足这个条件，就是滚动到底部了
            }
          })
        }
        if (this.beforeScroll) {
          this.scroll.on('beforeScrollStart', () => {
            this.$emit('beforeScroll')
          })
        }
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      // 滚动至
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this.refresh()
        }, this.refreshDelay)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">

</style>
