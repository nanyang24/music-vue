<template>
  <!-- 进度条 总体长度 -->
  <div @click="progressClick" class="progress-bar" ref="progressBar">
    <div class="bar-inner">
      <!-- 进度条 已播放长度 -->
      <div class="progress" ref="progress"></div>
      <!-- 进度条 按钮 -->
      <div class="progress-btn-wrapper"
           v-if="showBtn"
           ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend.prevent="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import {prefixStyle} from 'common/js/dom'

  const progressBtnWidth = 16
  const transform = prefixStyle('transform')

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      },
      canClick: {
        type: Boolean,
        default: true
      },
      showBtn: {
        type: Boolean,
        default: true
      }
    },
    created() {
      this.touch = {} // 作用是为 Btn 的三个 touch 事件传递共享数据
    },
    methods: {
      progressTouchStart(e) {
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX  // 第一次点击 横向坐标
        this.touch.left = this.$refs.progress.clientWidth // 已播放的进度长度
      },
      progressTouchMove(e) {
        if (!this.canClick) return
        if (!this.touch.initiated) return
        const deltaX = e.touches[0].pageX - this.touch.startX // 手指移动的偏移量，目前的位置 - 初始的位置
        // 偏移量(已播放的进度长度 + 手指移动的偏移量)，要大于0，但是总和不能大于整体宽度
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWidth)
        this.$emit('percentChanging', this._getPercent())
      },
      progressTouchEnd() {
        this.touch.initiated = false
        this._triggerPercent()  // 通知 改变了percent
      },
      progressClick(e) {
        if (!this.canClick) return
        // 当我们点击 btn 的时候，offsetX 获取就不正确了
        // this._offset(e.offsetX - progressBtnWidth / 2)
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth - 6)
        this._triggerPercent()
      },
      _triggerPercent() {
        this.$emit('percentChange', this._getPercent())
      },
      _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        if (this.showBtn) {
          this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0,0)`
        }
      },
      _getPercent() {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        return this.$refs.progress.clientWidth / barWidth
      },
      setProgressOffset(percent) {
        if (percent >= 0 && !this.touch.initiated) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = percent * barWidth
          this._offset(offsetWidth)
        }
      }
    },
    watch: {
      percent(newPercent) {
        this.setProgressOffset(newPercent)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/scss/variable";

  .progress-bar {
    height: 30px;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      .progress {
        position: absolute;
        height: 100%;
        background: $color-bg-custom;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid $color-text;
          border-radius: 50%;
          background: $color-theme;
        }
      }
    }
  }
</style>
