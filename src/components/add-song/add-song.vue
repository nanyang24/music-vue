<template>
  <transition name="slide">
    <div @click.stop class="add-song" v-show="showFlag">
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div @click="hide" class="close">
          <div class="icon-close"></div>
        </div>
      </div>
      <div class="search-box-wrapper">
        <SearchBox @query="onQueryChange" placeholder="搜索歌曲" ref="searchBox"></SearchBox>
      </div>
      <div class="shortcut" v-show="!query">
        <Switches @switch="switchItem"
                  :switches="switches"
                  :currentIndex="currentIndex"></Switches>
        <div class="list-wrapper">
          <Scroll v-if="currentIndex === 0" ref="songList" class="list-scroll">
            <div class="list-inner">
              <SongList @select="selectSong" :songs="playHistory"></SongList>
            </div>
          </Scroll>
          <Scroll v-if="currentIndex === 1" ref="searchList" class="list-scroll">
            <div class="list-inner">
              <SearchList @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></SearchList>
            </div>
          </Scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <Suggest @select="selectSuggest"
                 @listScroll="blurInput"
                 :query="query"
                 :showSinger="showSinger"></Suggest>
      </div>
      <TopTip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放队列</span>
        </div>
      </TopTip>
    </div>
  </transition>
</template>

<script>
  import SearchBox from 'base/search-box/search-box'
  import Suggest from 'components/suggest/suggest'
  import Switches from 'base/switches/switches'
  import {searchMixin} from 'common/js/mixin'
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import {mapGetters, mapActions} from 'vuex'
  import SearchList from 'base/search-list/search-list'
  import {Song} from 'common/js/song'
  import TopTip from 'base/top-tip/top-tip'

  export default {
    mixins: [
      searchMixin
    ],
    data() {
      return {
        showFlag: false,
        showSinger: false,
        currentIndex: 0,
        switches: [
          {name: '最近播放'},
          {name: '搜索历史'}
        ]
      }
    },
    computed: {
      ...mapGetters([
        'playHistory'
      ])
    },
    methods: {
      show() {
        this.showFlag = true
        // 因为每次进入默认不显示，但scroll组件已经计算高度了，所以不正确，导致无法滚动
        setTimeout(() => {
          if (this.currentIndex === 0) {
            this.$refs.songList.refresh()
          } else {
            this.$refs.searchList.refresh()
          }
        }, 20)
      },
      hide() {
        this.showFlag = false
      },
      selectSuggest() {
        this.saveSearch()
        this.showTip()
      },
      switchItem(index) {
        this.currentIndex = index
      },
      selectSong(song, index) {
        if (index !== 0) {
          this.insertSong(new Song(song))
          this.showTip()
        }
      },
      showTip() {
        this.$refs.topTip.show()
      },
      ...mapActions([
        'insertSong'
      ])
    },
    components: {
      SearchBox,
      Suggest,
      Switches,
      Scroll,
      SongList,
      SearchList,
      TopTip
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  @import "~common/scss/variable";
  @import "~common/scss/mixin";

  .add-song {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 200;
    background: $color-background;
    &.slide-enter-active, &.slide-leave-active {
      transition: all 0.3s;
    }
    &.slide-enter, &.slide-leave-to {
      transform: translate3d(100%, 0, 0);
    }
    .header {
      position: relative;
      height: 44px;
      text-align: center;
      .title {
        line-height: 44px;
        font-size: $font-size-large;
        color: $color-text;
      }
      .close {
        position: absolute;
        top: 0;
        right: 8px;
        .icon-close {
          display: block;
          padding: 12px;
          font-size: 20px;
          color: $color-theme;
        }
      }
    }
    .search-box-wrapper {
      margin: 20px;
    }
    .shortcut {
      .list-wrapper {
        position: absolute;
        top: 165px;
        bottom: 0;
        width: 100%;
        .list-scroll {
          height: 100%;
          overflow: hidden;
          .list-inner {
            padding: 20px 30px;
          }
        }
      }
    }
    .search-result {
      position: fixed;
      top: 124px;
      bottom: 0;
      width: 100%;
    }
    .tip-title {
      text-align: center;
      padding: 18px 0;
      font-size: 0;
      .icon-ok {
        font-size: $font-size-medium;
        color: $color-theme;
        margin-right: 4px;
      }
      .text {
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
  }
</style>
