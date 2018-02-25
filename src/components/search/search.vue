<template>
  <div class="search">
    <div class="search-box-wrapper">
      <SearchBox @query="onQueryChange" ref="searchBox"></SearchBox>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <Scroll class="shortcut" :data="shortcut" ref="shortCut" :click="click">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)"
                  class="item"
                  v-for="(item, index) in hotkey">
                <span class="">{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span @click="showConfrim" class="clear"><i class="icon-clear"></i></span>
            </h1>
            <SearchList @select="addQuery"
                        @delete="deleteSearchHistory"
                        :searches="searchHistory"></SearchList>
          </div>
        </div>
      </Scroll>
    </div>
    <div ref="searchResult" class="search-result" v-show="query">
      <Suggest ref="suggest" @select="saveSearch" @listScroll="blurInput" :query="query"></Suggest>
    </div>
    <Confirm @confirm="clearSearchHistory" ref="confirm" text="是否清空所有搜索历史" confirmBtnText="清空"></Confirm>
    <router-view></router-view>
  </div>
</template>

<script>
  import SearchBox from 'base/search-box/search-box'
  import Suggest from 'components/suggest/suggest'
  import SearchList from 'base/search-list/search-list'
  import Scroll from 'base/scroll/scroll'
  import Confirm from 'base/confirm/confirm'
  import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {mapActions} from 'vuex'
  import {playListMixin, searchMixin} from 'common/js/mixin'

  export default {
    mixins: [
      playListMixin,
      searchMixin
    ],
    data() {
      return {
        click: true,
        hotkey: [],
      }
    },
    created() {
      this._getHotKey()
    },
    computed: {
      shortcut() {
        return this.hotkey.concat(this.searchHistory)
      },

    },
    methods: {
      handlePlayList(playList) {
        const bottom = playList.length ? '60px' : ''
        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortCut.refresh()
        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()
      },
      _getHotKey() {
        getHotKey()
          .then(res => {
            if (res.code === ERR_OK) {
              this.hotkey = res.data.hotkey.slice(0, 10)
            }
          })
      },
      showConfrim() {
        this.$refs.confirm.show()
      },
      ...mapActions([
        'clearSearchHistory'
      ])
    },
    watch: {
      query(newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortCut.refresh()
          }, 20)
        }
      }
    },
    components: {
      SearchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import '~common/scss/variable';
  @import '~common/scss/mixin';

  .search {
    .search-box-wrapper {
      margin: 20px;
    }
    .shortcut-wrapper {
      position: fixed;
      top: 178px;
      bottom: 0;
      width: 100%;
      .shortcut {
        height: 100%;
        overflow: hidden;
        .hot-key {
          margin: 0 20px 20px 20px;
          .title {
            margin-bottom: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
          .item {
            display: inline-block;
            padding: 5px 10px;
            margin: 0 20px 10px 0;
            border-radius: 6px;
            background: $color-input-custom;
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
        .search-history {
          position: relative;
          margin: 0 20px;
          .title {
            display: flex;
            align-items: center;
            height: 40px;
            font-size: $font-size-medium;
            color: $color-text-l;
            .text {
              flex: 1;
            }
            .clear {
              @include extend-click();
              .icon-clear {
                font-size: $font-size-medium;
                color: $color-text-d;
              }
            }
          }
        }
      }
    }
    .search-result {
      position: fixed;
      width: 100%;
      top: 178px;
      bottom: 0;
    }
  }
</style>
