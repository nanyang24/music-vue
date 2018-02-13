<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="input" type="text" v-model="query" class="box" :placeholder="placeholder">
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script>
  import {debounce} from 'common/js/util'

  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data() {
      return {
        query: '' // 双向绑定数据
      }
    },
    created() {
      this.$watch('query', debounce((newQuery) => { // 节流
        this.$emit('query', newQuery) // 将 query 暴露给外部
      }, 200))
    },
    methods: {
      clear() {
        this.query = ''
      },
      setQuery(query) { // 方便外部组件调用
        this.query = query
      },
      blur() {
        this.$refs.input.blur()
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import '~common/scss/variable';

  .search-box {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 40px;
    background: $color-input-custom;
    border-radius: 6px;
    .icon-search {
      font-size: 24px;
      color: $color-background;
    }
    .box {
      flex: 1;
      margin: 0 5px;
      line-height: 18px;
      font-size: $font-size-medium;
      color: $color-text;
      border: 0;
      background: $color-input-custom;
      outline: 0;
      &::placeholder {
        color: $color-text-d;
      }
    }
    .icon-dismiss {
      font-size: 16px;
      color: $color-background;
    }
  }

</style>
