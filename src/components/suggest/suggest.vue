<template>
  <Scroll @scrollToEnd="searchMore"
          @beforeScroll="listScroll"
          ref="suggest"
          class="suggest"
          :data="result"
          :click="click"
          :pullup="pullup"
          :beforeScroll="beforeScroll">
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="(item, index) in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text">{{getName(item)}}</p>
        </div>
      </li>
      <Loading v-show="hasMore" title=""></Loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <NoResult title="抱歉，暂无搜索结果"></NoResult>
    </div>
  </Scroll>
</template>

<script>
  import {searchQ} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong, isValidMusic} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import SingerFormat from 'common/js/SingerFormat'
  import {mapMutations, mapActions} from 'vuex'
  import NoResult from 'base/no-result/no-result'

  const TYPE_SINGER = 'singer'
  const perpage = 20

  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        click: true,
        page: 1,
        result: [],
        pullup: true,
        hasMore: true,
        beforeScroll: true
      }
    },
    methods: {
      search() {
        this.page = 1
        this.hasMore = true
        this.$refs.suggest.scrollTo(0, 0) // 每次重新设置关键词后滚回顶部
        searchQ(this.query, this.page, this.showSinger, perpage)
          .then(res => {
            if (res.code === ERR_OK) {
              this.result = this._genResult(res.data)
              this._checkMore(res.data)
            }
          })
      },
      _checkMore(data) {
        const song = data.song
        if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum) {
          this.hasMore = false
        }
      },
      _genResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid && this.page === 1) { // suggest only add singer once
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})  // 将两个对象扩展到一个对象上
        }
        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach(musicData => {
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      searchMore() {
        if (!this.hasMore) return
        this.page++
        searchQ(this.query, this.page, this.showSinger, perpage)
          .then(res => {
            if (res.code === ERR_OK) {
              this.result = this.result.concat(this._genResult(res.data))
              this._checkMore(res.data)
            }
          })
      },
      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          const singer = new SingerFormat({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
        this.$emit('select')
      },
      listScroll() {
        this.$emit('listScroll')
      },
      refresh() {
        this.$refs.suggest.refresh()
      },
      ...mapMutations({ // 语法糖，'...'将多个对象注入当前对象
        setSinger: 'SET_SINGER' // 将 this.setSinger() 映射为 this.$store.commit('SET_SINGER')
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query() {
        this.search()
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import '~common/scss/variable';
  @import '~common/scss/mixin';

  .suggest {
    height: 100%;
    overflow: hidden;
    .suggest-list {
      padding: 0 30px;
      .suggest-item {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
      }
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^='icon-'] {
          font-style: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap()
        }
      }
    }
    .no-result-wrapper {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
