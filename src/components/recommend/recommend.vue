<template>
  <div class="recommend" ref="recommend">
    <Scroll ref="scroll" class="recommend-content" :data="discList" :click="click">
      <div>
        <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper"> <!-- v-if 确保获取到数据再渲染Slider -->
          <Slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img :src="item.picUrl">
              </a>
            </div>
          </Slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click="selectItem(item)" v-for="(item, index) in discList" class="item">
              <div class="icon">
                <img v-lazy="item.imgurl" width="80" height="80" alt="">
              </div>
              <div class="text">
                <h2 class="name">{{item.creator.name}}</h2>
                <p class="desc">{{item.dissname}}</p>
              </div>
            </li>
            <!-- 占位元素，因为margin撑不开高度 -->
            <li class="plaveholder"></li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <Loading></Loading>
      </div>
    </Scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll'
  import Slider from 'base/slider/slider'
  import Loading from 'base/loading/loading'
  import {getRecommend, getDiscList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import {playListMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'

  export default {
    mixins: [
      playListMixin
    ],
    data() {
      return {
        recommends: [],
        discList: [],
        click: true
      }
    },
    created() {
      // 获取数据
      this._getRecommend()
      this._getDiscList()
    },
    methods: {
      handlePlayList(playList) {
        const bottom = playList.length ? `60px` : ``
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      _getRecommend() {
        getRecommend().then(res => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
          }
        })
      },
      _getDiscList() {
        getDiscList().then(res => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.dissid}`
        })
        this.setDisc(item)
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      })
//      loadImage() {
//        if (!this.checkloaded) {
//          this.checkloaded = true
//          this.$refs.scroll.refresh()
//        }
//      },
    },
    components: {
      Slider,
      Scroll,
      Loading
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "~common/scss/variable";

  .recommend {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    .recommend-content {
      height: 100%;
      overflow: hidden;
      .slider-wrapper {
        position: relative;
        width: 100%;
        overflow: hidden;
      }
      .recommend-list {
        .list-title {
          height: 60px;
          line-height: 60px;
          text-align: center;
          font-size: $font-size-medium-x;
          color: $color-theme;
        }
        .item {
          display: flex;
          box-sizing: border-box;
          align-items: center;
          padding: 15px 20px 15px 20px;
          margin: 20px 35px 20px 55px;
          box-shadow: 2px 2px 0px #F5387D, 2px 2px 0px #B120FA;
          border-radius: 12px;
          &:first-child {
            margin-top: 0;
          }
          .icon {
            flex: 0 0 60px;
            width: 60px;
            position: relative;
            top: -4px;
            left: -40px;
            img {
              border-radius: 16px;
            }
          }
          .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            font-size: $font-size-medium;
            .name {
              margin-bottom: 10px;
              color: $color-text;
            }
            .desc {
              color: $color-text-d;
            }
          }
        }
        .plaveholder{
          padding: 6px 0
        }
      }
      .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
</style>
