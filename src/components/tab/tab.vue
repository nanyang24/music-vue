<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link">排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>

<script>
  export default {}
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/scss/variable";

  .tab {
    display: flex;
    height: 44px;
    line-height: 44px;
    font-size: $font-size-medium;
    .tab-item {
      flex: 1;
      text-align: center;
      .tab-link {
        position: relative;
        padding-bottom: 5px;
        color: $color-text-l;
        font-size: $font-size-medium-x;
      }
      &.router-link-active {
        .tab-link {
          color: $color-theme;
          &:after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 4px;
            border-radius: 5px;
            background: linear-gradient(to right, #aa39d8 , #f92f6f);
          }
        }
      }
    }
  }
</style>
