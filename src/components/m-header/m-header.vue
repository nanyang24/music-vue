<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 @click="showConfirm" class="text">NY-Music</h1>
    <router-link to="/user" class="mine" tag="div">
      <i class="icon-mine"></i>
    </router-link>
    <Confirm ref="confirm"
             :text="text"
             :textb="textb"
             :textc="textc"
             :textd="textd"
             cancelmBtnText="关闭"
             confirmBtnText="了解"></Confirm>
  </div>
</template>

<script>
  import Confirm from 'base/confirm/confirm'

  export default {
    data() {
      return {
        text: `前端&UI：南洋`,
        textb: `nanyang1412@gmail.com`,
        textc: `技术栈：Vue2.0全家桶`,
        textd: `数据接口：QQ-music-API`
      }
    },
    methods: {
      showConfirm() {
        this.$refs.confirm.show()
      }
    },
    components: {
      Confirm
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">

  // " ~ " 使 SCSS 可以使用 webpack 的相对路径
  @import "~common/scss/mixin";
  @import "~common/scss/variable";

  .m-header {
    position: relative;
    height: 44px;
    text-align: center;
    color: $color-theme;
    font-size: 0;
    .icon {
      display: inline-block;
      vertical-align: top;
      margin-top: 6px;
      margin-right: 9px;
      width: 32px;
      height: 32px;
      @include bg-img('logo');
      background-size: 32px 32px;
    }
    .text {
      display: inline-block;
      vertical-align: top;
      line-height: 44px;
      font-size: $font-size-large;
    }
    .mine {
      position: absolute;
      top: 0;
      right: 0;
      .icon-mine {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }
</style>
