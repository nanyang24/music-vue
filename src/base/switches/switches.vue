<template>
  <ul class="switches">
    <li @click="switchItem(index)"
        class="switch-item"
        v-for="(item, index) in switches"
        :class="{'active': currentIndex === index}">
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      switches: {
        type: Array,
        default: []
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      switchItem(index) {
        this.$emit('switch', index)
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/scss/variable";

  .switches {
    display: flex;
    align-items: center;
    width: 240px;
    margin: 0 auto;
    border: 1px solid $color-highlight-background;
    border-radius: 5px;
    .switch-item {
      flex: 1;
      padding: 8px;
      text-align: center;
      font-size: $font-size-medium-x;
      color: $color-text-d;
      &.active {
        background: $color-highlight-background;
        color: $color-text;
      }
    }
  }
</style>
