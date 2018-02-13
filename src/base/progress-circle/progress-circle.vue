<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray"
              :stroke-dashoffset="dashOffset"/>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      radius: {
        type: Number,
        default: 32
      },
      percent: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        dashArray: Math.PI * 50 * 2 // 2πr 周长
      }
    },
    computed: {
      dashOffset() {
        return (1 - this.percent) * this.dashArray
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/scss/variable";

  .progress-circle {
    position: relative;
    circle {
      stroke-width: 8px;
      transform-origin: center;
      &.progress-background {
        transform: scale(0.9);
        stroke: $color-theme-custom1;
      }
      &.progress-bar {
        transform: scale(0.9) rotate(-90deg);
        stroke: $color-theme-custom2;
      }
    }
  }
</style>
