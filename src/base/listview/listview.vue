<template>
  <Scroll class="listview"
          ref="listview"
          :click="click"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="scroll">
    <!--歌手列表-->
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <!--首字母条目-->
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutlist" :data-index="index" class="item"
            :class="{'current': currentIndex === index}">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}} </div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <Loading></Loading>
    </div>
  </Scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'common/js/dom'

  const ANCHOR_HEIGHT = 18      // 锚点高度
  const TITLE_HEIGHT = 30

  export default {
    created() {
      this.touch = {}
      this.listenScroll = true
      this.probeType = 3
      this.listHeight = []
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        click: true,
        currentIndex: 0,
        scrollY: -1,  // 初始值只要不是一个大于 0 的值其实都可以
        diff: -1
      }
    },
    computed: {
      shortcutlist() {
        return this.data.map((group) => {
          return group.title.slice(0, 1)
        })
      },
      fixedTitle() {
        if (this.scrollY > 0) return ''
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      refresh(){
        this.$refs.listview.refresh()
      },
      selectItem(item) {
        this.$emit('select', item)
      },
      onShortcutTouchStart(e) {
        let anchorIndex = getData(e.target, 'index')  // 获取 点击具体锚点的 index 值
        let firstTouch = e.touches[0]   // 第一次触碰的位置
        this.touch.y1 = firstTouch.pageY  // 保存 第一次触碰的位置的Y值
        this.touch.anchorIndex = anchorIndex  // 保存 第一次触碰时的锚点 index 值
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0 // 两次触碰 Y 轴的偏移锚点值
        let anchorIndex = +this.touch.anchorIndex + delta  // 获取 偏移了多少 index 值  ，因为 anchorIndex 是字符串，所以要转成数字再相加
        this._scrollTo(anchorIndex)
      },
      _scrollTo(index) {
        // 如果没有点击到锚点元素
        if (!index && index !== 0) return
        // 如果 touchmove 超出范围
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 1) {
          index = this.listHeight.length - 2
        }
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 200)
        this.scrollY = -this.listHeight[index]
//        this.scrollY = this.$refs.listview.scroll.y
      },
      // BScroll 实时监测并派发的 Y轴滚动距离
      scroll(pos) {
        this.scrollY = pos.y    // 实时获取 BScroll 滚动的 Y轴距离
      },
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    watch: {
      data() {
        // 延时，确保DOM渲染之后执行，通常是nextTick，这里用setTimeout是为了兼容更低
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },

      // 这里的 scrollY 是当前组件上的，和 BScroll 的并不是一个
      // this.scrollY 的 setter
      scrollY(newY) {
        const listHeight = this.listHeight
        // 1. 当滚动至顶部以上
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 2. 当在中间部分滚动，length之所以 -1 是因为 当初高度列表定义必须多一个
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diff = height2 + newY  // height 上限 - newY 的值
            return
          }
        }
        // 3. 当滚动至底部，且 newY 大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) return   // 判断如果两个title区块没有碰到，是不会触发 DOM 操作的
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/scss/variable";

  .listview {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $color-background;
    .list-group {
      padding-bottom: 30px;
      .list-group-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        background: $color-highlight-background;
        box-shadow: 2px 2px 0px #F5387D, 2px 2px 0px #B120FA;
      }
      .list-group-item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .name {
          margin-left: 20px;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }
    .list-shortcut {
      position: absolute;
      z-index: 30;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      text-align: center;
      font-family: Helvetica;
      .item {
        padding: 6px 16px 0;
        line-height: 1;
        color: $color-text-l;
        color: hsla(0, 0%, 100%, .5);
        font-size: $font-size-small;
        &.current {
          color: $color-text;
        }
      }
    }
    .list-fixed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .fixed-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        background: $color-highlight-background;
        box-shadow: 2px 2px 0px #F5387D, 2px 2px 0px #B120FA;
      }
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
