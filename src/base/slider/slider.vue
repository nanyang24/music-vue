<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :class="{active: currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        tyoe: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 3000
      }
    },
    mounted() {
      //setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()
      if (this.autoPlay) {
        this._play()
      }
      //})
      window.addEventListener('resize', () => {
        if (!this.scroll || !this.scroll.enabled) return

        clearTimeout(this.resizeTimer)
        this.resizeTimer = setTimeout(() => {
          if (this.scroll.isInTransition) {
            this._onScrollEnd()
          } else {
            if (this.autoPlay) {
              this._play()
            }
          }
          this.refresh()
        }, 60)
      })
    },
    activated() {
      this.scroll.enable()
      let pageIndex = this.scroll.getCurrentPage().pageX
      this.scroll.goToPage(pageIndex, 0, 0)
      this.currentPageIndex = pageIndex
      if (this.autoPlay) {
        this._play()
      }
    },
    deactivated() {
      this.scroll.disable()
      clearTimeout(this.timer)
    },
    methods: {
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children
        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')
          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        // 如果轮播循环播放，是前后各加一个轮播图保证无缝切换，所以需要再加两个宽度
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      _initSlider() {
        // BScroll 会自动 clone 两个轮播插在前后
        this.scroll = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          },
          click: true
        })
        this.scroll.on('scrollEnd', this._onScrollEnd)
        this.scroll.on('touchend', () => {
          if (this.autoPlay) {
            this._play()
          }
        })
        this.scroll.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer)
          }
        })
      },
      _onScrollEnd() {
        this.currentPageIndex = this.scroll.getCurrentPage().pageX
        if (this.autoPlay) {
          this._play()
        }
      },
      _play() {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.scroll.next()
        }, this.interval)
      },
      refresh() {
        if (this.scroll) {
          this._setSliderWidth(true)
          this.scroll.refresh()
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/scss/variable";

  .slider {
    min-height: 1px;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-item {
        float: left;
        box-sizing: border-box;
        overflow: hidden;
        text-align: center;
        a {
          display: block;
          width: 100%;
          overflow: hidden;
          text-decoration: none;
        }
        img {
          display: block;
          width: 100%;
        }
      }
    }
    .dots {
      position: absolute;
      right: 0;
      left: 0;
      bottom: 12px;
      transform: translateZ(1px);
      text-align: center;
      font-size: 0;
      .dot {
        display: inline-block;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: $color-text-l;
        &.active {
          width: 20px;
          border-radius: 5px;
          background: $color-text-ll;
        }
      }
    }
  }
</style>
