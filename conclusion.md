# 项目总结
这是我第二个用 Vue 实现的项目，下面内容包括了在实现过程中所记录的知识点以及一些小技巧

项目演示地址：https://music-vue.n-y.io
源代码地址：https://github.com/nanyang24/music-vue

项目的页面包括：播放器内核页、推荐页、歌单详情页、歌手页、歌手详情页、排行页、搜索页、添加歌曲页、个人中心页等。

### 推荐页

上部分是一个轮播图组件，使用第三方库 better-scroll 辅助实现，抓取 QQ音乐(移动端)数据

下部分是一个歌单推荐列表，使用 axios + Node.js 代理后端请求，绕过主机限制 (伪造 headers)，抓取 QQ音乐(PC端)数据

歌单推荐列表图片，使用图片懒加载技术 vue-lazyload，优化页面加载速度

为了更好的用户体验，当数据未请求到时，显示 loading 组件


### 推荐 recommend 页 -> 歌单详情页

由于歌手的状态多且杂，这里使用 vuex 集中管理歌手状态

这个组件更加注重 UX，做了很多类原生 APP 动画，如下拉图片放大、跟随推动、ios 渐进增强的高斯模糊效果 backdrop-filter 等

### 歌手 singer 页

左右联动是这个组件的难点

左侧是一个歌手列表，抓取 QQ音乐(PC端)歌手数据 并 重组 JSON 数据结构

右侧是一个字母列表，与左侧歌手列表联动，滚动固定标题实现

列表图片使用懒加载技术 vue-lazyload，优化页面加载速度

### 排行 rank 页

普通组件，很简单

### 排行页 -> 歌单详情页

复用歌单详情页

### 搜索 search 页

抓数据，写组件，另外，根据抓取的数据特征，做了上拉刷新的功能

考虑到数据量大且频繁的问题，对请求做了节流处理

考虑到移动端键盘占屏的问题，对滚动前的 input 做了 `blur()` 操作

对搜索历史进行了 `localstorage` 缓存，清空搜索历史时使用了改装过的 confirm 组件

支持将搜索的歌曲添加到播放列表

### 个人中心 user-center

将 `localstorage` 中 “我的收藏” 和 “最近播放” 反映到界面上



### 播放器内核页 player

核心组件。用 vuex 管理各种播放时状态，播放、暂停等功能调用 audio API

播放器可以最大化和最小化

中部唱片动画使用第三方 JS 动画库 `create-keyframe-animation` 实现

底部操作区图标使用 `iconfonts`。

抽象了一个`横向进度条组`件和一个`圆形进度条组件`，横向进度条可以拖动小球和点击进度条来改变播放进度，圆形进度条组件使用` SVG <circle>` 元素

播放模式有：顺序播放、单曲循环、随机播放，原理是调整歌单列表数组

歌词的爬取利用 axios 代理后端请求，伪造 headers 来实现，先将歌词 jsonp 格式转换为 json 格式，再使用第三方库 `js-base64` 进行 `Base64` 解码操作，最后再使用第三方库 `lyric-parser` 对歌词进行格式化

实现了侧滑显示歌词、歌词跟随进度条高亮等交互效果

增加了当前播放列表组件，可在其中加入/删除歌曲

### 其他

此应用的全部数据来自 QQ音乐，利用 axios 结合 node.js 代理后端请求抓取

全局通用的应用级状态使用 vuex 集中管理

全局引入 fastclick 库，消除 click 移动浏览器 300ms 延迟

页面是响应式的，适配常见的移动端屏幕，采用 flex 布局

# 疑难总结 & 小技巧

## 关于 Vue 知识 & 使用技巧

### v-html 可以转义字符

### watch 对象可以观测属性的变化

### 像这种父组件传达子组件的参数通常都是在data()里面定义的呀  为什么这里要放到created()定义  两者有什么区别呢？
因为这个变量不需要观测它的变化，因此不用定义在 data 里，这样也会对性能有所优化

### 不明白什么时候要把变量放在data()里,什么时候又不需要放 ？
需要监测这个数据变化的时候，放在 data 里，会给数据添加 getter 和 setter

### 生命周期 钩子函数
生命周期钩子函数，比如 mounted 是先触发子组件的 mounted，再会触发父组件的 mounted，但是对于 created 钩子，又会先触发父组件，再触发子组件。

### 如果组件有计数器，在组件销毁时期要记得清理，好习惯

### 对于 Vue 组件，this.$refs.xxx 拿到的是 Vue 实例，所以需要再通过 $el 拿到真实的 dom



## 关于 JS 知识 & 技巧

### 一般来说 JS 线程执行完毕后一个 Tick 的时间约17ms内 DOM 就可以渲染完毕所以课程中 setTimeout(fn, 20) 是非常稳妥的写法

## 关于 webpack 知识 & 技巧

### " ~ " 使 SCSS 可以使用 webpack 的相对路径
```js
@import "~common/scss/mixin";
@import "~common/scss/variable";
```

### babel-runtime 会在编译阶段把 es6 语法编译的代码打包到业务代码中，所以要放在 dependencies
里。

## Fast Click 是一个简单、易用的库，专为消除移动端浏览器从物理触摸到触发点击事件之间的300ms延时
### 为什么会存在延迟呢？

从触摸按钮到触发点击事件，移动端浏览器会等待接近300ms，原因是浏览器会等待以确定你是否执行双击事件

#### 何时不需要使用

1. FastClick 不会伴随监听任何桌面浏览器
2. Android 系统中，在头部 meta 中设置 width=device-width 的Chrome32+ 浏览器不存在300ms 延时，所以，也不需要
`<meta name="viewport" content="width=device-width, initial-scale=1">`
3. 同样的情况也适用于 Android设备（任何版本），在viewport 中设置 user-scalable=no，但这样就禁止缩放网页了
4. IE11+ 浏览器中，你可以使用 touch-action: manipulation;  禁止通过双击来放大一些元素（比如：链接和按钮）。IE10可以使用 -ms-touch-action: manipulation








## 请求接口
jsonp:



XHR:


## 手写轮播图
利用 BScroll

BScroll 设置 loop 会自动 clone 两个轮播插在前后位置

如果轮播循环播放，是前后各加一个轮播图保证无缝切换，所以需要再加两个宽度
```js
if (this.loop) {
  width += 2 * sliderWidth
}
```

初始化 dots 要在 BScroll 克隆插入两个轮播图之前

dots active状态 是通过判断 currentIndex 与 index 是否相等

currentIndex 更新是通过获取 scroll 当前 page，BScroll 提供了 api 方便调用
```js
this.currentPageIndex = this.scroll.getCurrentPage().pageX
```

为了保证改变窗口大小依然正常轮播，监听窗口 resize 事件，重新渲染轮播图
```js
window.addEventListener('resize', () => {
  if (!this.scroll || !this.scroll.enabled) return

  clearTimeout(this.resizeTimer)
  this.resizeTimer = setTimeout(() => {
    if (this.scroll.isInTransition) {
      this._onScrollEnd()
    } else {
      if (this.autoPlay) {
        this._play()
      }
    }
    this.refresh()
  }, 60)
})
```

在切换 tab 相当于 切换了 keep-alive 的组件
轮播会出问题，需要手动帮助执行，利用了 activated , deactivated 钩子函数
```js
activated() {
  this.scroll.enable()
  let pageIndex = this.scroll.getCurrentPage().pageX
  this.scroll.goToPage(pageIndex, 0, 0)
  this.currentPageIndex = pageIndex
  if (this.autoPlay) {
    this._play()
  }
},
deactivated() {
  this.scroll.disable()
  clearTimeout(this.timer)
}
```
**实测**，首次打开网页并不会执行 activated，只有在之后切换 tab ，切回来才会执行


在组件销毁之前  beforeDestroy 销毁定时器是好习惯，keep-alive 因为是将组件缓存了，所以不会触发
```js
beforeDestroy() {
  this.scroll.disable()
  clearTimeout(this.timer)
}
```

## 后端接口代理
简单设置一下 Referer, Host，让别人直接通过浏览器抓到你的接口
但是这种方式防不了后端代理的方式

前端 XHR 会有跨域限制，后端发送 http 请求则没有限制，因此可以伪造请求

axios 可以在浏览器端发送 `XMLHttpRequest` 请求，在服务器端发送 `http` 请求

（在项目编写阶段，可以将后端代理请求写在 webpack 的 dev 文件的 before 函数内）
```js
before(app) {
  app.get('/api/getDiscList', function (req, res) {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
    axios.get(url, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params: req.query
    }).then((response) => {
      res.json(response.data) // axios 返回的数据在 response.data，要把数据透传到我们自定义的接口里面 res.json(response.data)
    }).catch((e) => {
      console.log(e)
    })
  });
}
```
定义一个路由，get 到一个 `/api/getDiscList` 接口，通过 axios 伪造 headers，发送给QQ音乐服务器一个 http 请求，还有 param 参数。
得到服务端正确的响应，通过 `res.json(response.data)` 返回到浏览器端

> 另外 因为是 http 请求数据，是ajax，所以 format 参数要将原本接口的 jsonp 改为 json

大公司怎么防止被恶意代理呢？当你的访问量大的时候，出口ip会被查到获取封禁，还有一种就是参数验签，也就是请求人家的数据必须带一个签名参数，然后这个签名参数是很难拿到的这个正确的签名，从而达到保护数据的目的


当然，获取的数据并不能直接拿来用，需要做进一步的规格化，达到我们使用的要求，所以在这方面单独封装了一个 class 来处理这方面的数据，具体请看src/common/js/song.js

## flex 布局，热门歌单推荐

左侧 icon 固定大小，`flex: 0 0 60px`

flex 属性是 `flex-grow` , `flex-shrink` 和 `flex-basis` 的简写，默认值为 0 1 auto。后两个属性可选。
1. `flex-grow` 属性定义项目的放大比例，默认为 0，即如果存在剩余空间，也不放大。
2. `flex-shrink` 属性定义了项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小。
3. `flex-basis` 属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。

右侧 text 区块 自适应占据剩下的空间，并且内部也采用 flex，使用 `flex-direction: column; justify-content: center;` 来达到纵向居中排列

## recommend 页面 利用 BScroll 滚动
Scroll 初始化但却没有滚动，是因为初始化时机不对，必须保证数据到来，DOM 成功渲染之后 再去进行初始化
可以使用父组件 给 Scrol组件传 `:data` 数据，Scroll 组件自己 `watch` 这个 data，有变化就立刻 refesh 滚动

**新版本 BScroll 已经自己实现检测 DOM 变化，自动刷新，大部分场景下无需传 data 了**

所以也就 无需监听 img 的 onload 事件 然后执行 滚动刷新 了
```js
<img @load="loadImage" class="needsclick" :src="item.picUrl">
```
```js
loadImage() {
  if (!this.checkloaded) {
    this.checkloaded = true
    this.$refs.scroll.refresh()
  }
}
```

## 歌手页面 数据重构

歌手页面的结构是 `热门、 A-Z` 的顺序排列，但抓取的接口数据只是 100条常见的歌手，并且是乱序的，但我们可以利用接口的 Findex 进行数据的重构

首先可以定义一个 map 结构
```js
let map = {
  hot: {
    title: HOT_NAME,
    item: []
  }
}
```

接着遍历得到的数据，将前10条添加到热门 hot 里
然后查看每条的 Findex ，如果 map[Findex] 没有，创建 map[Findex] push 进新条目，如果 map[Findex] 有，则向其 push 进新条目
```js
list.forEach((item, index) => {
  if (index < HOT_SINGER_LEN) {
    map.hot.item.push(new SingerFormat({
      id: item.Fsinger_mid,
      name: item.Fsinger_name,
    }))
  }
  const key = item.Findex
  if (!map[key]) {
    map[key] = {
      title: key,
      items: []
    }
  }
  map[key].items.push(new SingerFormat({
    id: item.Fsinger_mid,
    name: item.Fsinger_name
  }))
})
```
这样就得到了一个 符合我们基本预期的 map 结构，但是因为 map 是一个对象，数据是乱序的，Chrome 控制台在展示的时候会对 key 做排序，但实际上我们代码并没有做。

所以还要将其进行排序，这里会用到 数组的 sort 方法，所以我们要先把 map对象 转为 数组
```js
let hot = []
let ret = []
let un = []
for (let key in map) {
  let val = map[key]
  if (val.title.match(/[a-zA-z]/)) {
    ret.push(val)
  } else if (val.title === HOT_NAME) {
    hot.push(val)
  } else {
    un.push(val)
  }
}
ret.sort((a, b) => {
  return a.title.charCodeAt(0) - b.title.charCodeAt(0)
})
return hot.concat(ret, un)
```

根据 title 字母的 Unicode 编码大小排序的（比如：'A'.charCodeAt(0)=65；'B'.charCodeAt(0)=66）然后就a,b,c,d...的顺序了

## 歌手页面
### shortcut 定位

因为 shortcut 整体的高度是不确定的，所以采用的是 `top:50%` 之后，`transform: translateY(-50%);` 这样就能动态的根据内容高度而垂直居中


### 歌手页面 区块与锚点 的联动

### 点击或滑动 shortcut 不同的锚点 ，自动滚动至相应的标题列表

利用了 BScroll 的 api ，scrollToElement
- scrollToElement 可以滚动至相应的 index 值的区块


第一次点击触碰 shortcut ，获取点击具体锚点的 index 值，记录触碰位置的 index ，利用 scrollToElement ，滚动至相应 index 的区块
而之后，滑动锚点实现滚动是利用 touchmove 事件，将两次触碰的的位置计算值变成 delta 差值：变成改变后的锚点区块 index 值，再将首次触碰的 index 值 + 改变的 delta 值，再利用 scrollToElement ，滚动至相应的区块

```js
onShortcutTouchStart(e) {
  let anchorIndex = getData(e.target, 'index')  // 获取 点击具体锚点的 index 值
  let firstTouch = e.touches[0]   // 第一次触碰的位置
  this.touch.y1 = firstTouch.pageY  // 保存 第一次触碰的位置的Y值
  this.touch.anchorIndex = anchorIndex  // 保存 第一次触碰时的锚点 index 值
  this._scrollTo(anchorIndex)
},
onShortcutTouchMove(e) {
  let firstTouch = e.touches[0]
  this.touch.y2 = firstTouch.pageY
  let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0 // 两次触碰 Y 轴的偏移锚点值
  let anchorIndex = +this.touch.anchorIndex + delta  // 获取 偏移了多少 index 值  ，因为 anchorIndex 是字符串，所以要转成数字再相加
  this._scrollTo(anchorIndex)
},
_scrollTo(index) {
  this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 200)
}
```

```html
<Scroll class="listview" ref="listview">
    <!--歌手列表-->
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <!--首字母条目-->
        <ul>
          <li v-for="item in group.items" class="list-group-item">
            <img :src="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutlist" :data-index="index" class="item">
          {{item}}
        </li>
      </ul>
    </div>
</Scroll>
```


### 滑动主列表，侧边 shortcut 自动高亮不同锚点

1. 首先 BScroll 组件 监听滚动事件，并派发事件以供父组件监听，将 pos 值传出去
```js
if (this.listenScroll) {
  let self = this
  this.scroll.on('scroll', (pos) => { // 实时监测滚动事件，派发事件：Y轴距离
    self.$emit('scroll', pos)
  })
}
```
2. 父组件监听到滚动派发的事件
```js
 @scroll="scroll"
```
将 pos.y 存在 this.scrollY
```js
scroll(pos) {
  this.scrollY = pos.y    // 实时获取 BScroll 滚动的 Y轴距离
}
```
3. 再用 watch 检测数据的变化，一旦变化，重新计算每个区块的高度列表。再判断当前滚动的 Y轴值 是否落在相应的 group 高度区间，然后更新 currentIndex ，使 shortcut 的锚点高亮

```js
watch: {
  data() {
    // 延时，确保DOM渲染之后执行，通常是nextTick，这里用setTimeout是为了兼容更低
    setTimeout(() => {
      this._calculateHeight()
    }, 20)
  },

  // 这里的 scrollY 是当前组件上的，和 BScroll 的并不是一个
  scrollY(newY) {
  const listHeight = this.listHeight
  // 1. 当滚动至顶部以上
  if (newY > 0) {
    this.currentIndex = 0
    return
  }
  // 2. 当在中间部分滚动，length之所以 -1 是因为 当初高度列表定义必须多一个
  for (let i = 0; i < listHeight.length - 1; i++) {
    let height1 = listHeight[i]
    let height2 = listHeight[i + 1]
    if (-newY >= height1 && -newY < height2) {
      this.currentIndex = i
      this.diff = height2 + newY  // height 上限 - newY 的值
      return
    }
  }
  // 3. 当滚动至底部，且 newY 大于最后一个元素的上限
  this.currentIndex = listHeight.length - 2
  }
}
```

#### 每个区块的高度列表是 通过 `_calculateHeight` 函数实现的

```js
_calculateHeight() {
  this.listHeight = []
  const list = this.$refs.listGroup
  let height = 0
  this.listHeight.push(height)
  for (let i = 0; i < list.length; i++) {
    let item = list[i]
    height += item.clientHeight
    this.listHeight.push(height)
  }
}
```

4. 最后只要在 li 上绑定class就可以实现不同位置的锚点高亮了
```js
:class="{'current': currentIndex === index}"
```


**这里的 Vue 用法提示**：
`watch` 的 `scrollY(newY){}`
1. 当我们在 Vue 里修改了在 data 里定义的变量，就会出发这个变量的 setter，经过一系列的处理，会触发 watch 的回调函数，也就是 scrollY(newY) {} 这里的函数会执行，同时，newY 就是我们修改后的值。
2. scrollY 是定义在 data 里的，列表滚动的时候，scroll 事件的回调函数里有修改 this.scrollY，所以能 watch 到它的变化。
3. watch 的回调函数的第一个参数表示变化的新值



### 滚动固定标题 效果实现
在中间部分滚动时，会不断设置 diff 值，每个区块的高度上限（也就是底部）减去 Y轴偏移的值
```js
 this.diff = height2 + newY  // 就是 height 上限 - newY 的值
```

watch 检测 diff 变化，判断如果 diff>0 且 小于 title 块的高度，设为差值，否则为0
再将 fixed 的 title 块 translate 偏移
```js
diff(newVal) {
  let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
  if (this.fixedTop === fixedTop) return   // 判断如果两个title区块没有碰到，是不会触发 DOM 操作的
  this.fixedTop = fixedTop
  this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
}
```

##  歌手详情页
singer page 页面 引入 singer-detail 二级路由

index.js 路由里配置
```js
{
  path: '/singer',
  component: Singer,
  children: [
    {
      path: ':id', // 表示 id 为变量
      component: SingerDetail
    }
  ]
}
```
singer.vue 里设定跳转路由 `this.$router.push({})`
html:
```html
<router-view></router-view>
```
js:
```js
selectSinger(singer){
  this.$router.push({
    path: `/singer/${singer.id}`
  })
}
```

## Vuex
Vuex 教程见：[Vuex](https://github.com/nanyang24/blog/issues/60)

通常的流程为：
1. 定义 state，考虑项目需要的原始数据（最好为底层数据）
2. getters，就是对原始数据的一层映射，可以只为底层数据做一个访问代理，也可以根据底层数据映射为新的计算数据（相当于 vuex 的计算属性）
3. 修改数据：mutations，定义如何修改数据的逻辑（本质是函数）。
在定义 mutations 之前 要先定义 mutation-types （通常为动词+名词）



`actions.js` 通常是两种操作
1. 异步操作
2. 是对mutation的封装，比如一个动作需要触发多个mutation的时候，就可以把多个mutation封装到一个action中，达到调用一个action去修改多个mutation的目的。

### 歌手页面，数据利用 vuex 传递
#### 1. 首先 listview.vue 检测点击事件，将具体点击的歌手派发出去，以供父组件 singer 监听
```js
selectItem(item) {
  this.$emit('select', item)
},
```

#### 2. 父组件监听事件执行 selectSinger(singer)
1. 指向子路由，向地址栏加上 `singer.id`
2. 向 mutation 提 `SET_SINGER` 的 commit

```js
selectSinger(singer) {
  this.$router.push({
    path: `/singer/${singer.id}`
  })
  this.setSinger(singer)
},

...mapMutations({ // 语法糖，'...'将多个对象注入当前对象
  setSinger: 'SET_SINGER' // 将 this.setSinger() 映射为 this.$store.commit('SET_SINGER')
})
```



mapMutations (语法糖) 映射 mutations ，`this.setSinger(singer)` 相当于执行 `this.$store.commit('SET_SINGER')` （singer 为 mutation 的第二个参数）
而 mutations 内 `SET_SINGER` 的逻辑为
```js
[types.SET_SINGER](state, singer) {
  state.singer = singer
}
```


#### 3. singer-detail 取 vuex 中存好的数据

```js
computed: {
  ...mapGetters([
    'singer'
  ])
}
```
getters 内 `singer` 的逻辑为
```js
singer = state => state.singer
```


## musiclist 与 songlist
### 滑动 songlist 与背景图的联动

主要是 监听滚动距离，根据不同的距离条件发生不同的效果
```js
mounted() {
  this.imageHeight = this.$refs.bgImage.clientHeight
  this.$refs.list.$el.style.top = `${this.imageHeight}px` // 对于 Vue 组件，this.$refs.xxx 拿到的是 Vue 实例，所以需要再通过 $el 拿到真实的 dom
  this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT
},

watch: {
  scrollY(newY) {
    let translateY = Math.max(this.minTransalteY, newY)   // 最远滚动改变的距离就是 minTransalteY
    let zIndex = 0
    let scale = 1
    const percent = Math.abs(newY / this.imageHeight)

    this.$refs.layer.style.transform = `translate3d(0,${translateY}px,0)`
    this.$refs.layer.style.webkitTransform = `translate3d(0,${translateY}px,0)`
    if (newY < this.minTransalteY) {
      zIndex = 10
      this.$refs.bgImage.style.paddingTop = 0
      this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
    } else {
      this.$refs.bgImage.style.paddingTop = '70%'
      this.$refs.bgImage.style.height = 0
    }
    if (newY > 0) {
      scale = 1 + percent
      zIndex = 10
    }
    this.$refs.bgImage.style.zIndex = zIndex
    this.$refs.bgImage.style.transform = `scale(${scale})`
    this.$refs.bgImage.style.webkitTransform = `scale(${scale})`
  }
}
```
## 自动判断浏览器加CSS兼容前缀 prefixStyle
```js
let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) return key
  }
  return false
})()

export function prefixStyle(style) {
  if (vendor === false) return false

  if (vendor === 'standard') return style

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
```
1. 首先生成基于用户浏览器的div样式
2. 根据 vendor 供应商定义的不同浏览器前缀，去测试用户浏览器。
方法就是判断创建的 div 样式是否有相应的前缀样式，如果有，则返回前缀样式的key，也就是需要的 前缀
3. 通过 prefixStyle 函数，参数为我们需要兼容的样式。如果需要加签注，返回的格式是 前缀 + 首字母大写的样式（应为通常前缀样式为 `-webkit-transform-origin`，JS操作时，不能写 `-`，可以采用驼峰写法，也就是样式首字母大写）

## 播放器 player

把播放器组件放在 App.vue 下，因为它是一个跟任何路由都不相关的东西。在任何路由下，它都可以去播放。切换路由并不会影响播放器的播放。

### 播放器 vuex 设计
点击 歌手/歌单 都会进入详情页，详情页 created() 会根据点击的歌手请求相应的数据，然后利用 _normalizeSongs 将数据整理，其中很重要的函数是 createSong ，生成自定义 song 类，方便以后读取
### 播放器 图片旋转
`animation-play-state`
animation-play-state CSS 属性定义一个动画是否运行或者暂停。可以通过查询它来确定动画是否正在运行。另外，它的值可以被设置为暂停和恢复的动画的重放。
恢复一个已暂停的动画，将从它开始暂停的时候，而不是从动画序列的起点开始在动画。

修复BUG：ios下safari与chrome浏览器,animation-play-state样式失效 #60
点击暂停播放的时候，歌曲的图片会继续转动，导致的原因是因为animation-play-state:paused这个样式失效了
[修复具体代码](https://github.com/ustbhuangyi/vue-music/commit/9de934081be8353d872d23c4d72bfb77752ab5a1)
核心代码：
```js
/**
 * 计算内层Image的transform，并同步到外层容器
 * @param wrapper
 * @param inner
 */
syncWrapperTransform(wrapper, inner) {
  if (!this.$refs[wrapper]) return

  let imageCdWrapper = this.$refs[wrapper]
  let image = this.$refs[inner]
  let wTransform = getComputedStyle(imageCdWrapper)[transform]
  let iTransform = getComputedStyle(image)[transform]
  imageCdWrapper.style[transform] = wTransform === 'none' ? iTransform : iTransform.concat(' ', wTransform)
}
```

### 解决快速切换歌曲引发的错误
这个错误是由于切换的太快，歌曲并未获取到播放地址，而提前播放

利用了H5新api： `canplay`
当终端可以播放媒体文件时触发该canplay事件，估计加载足够的数据来播放媒体直到其结束，而不必停止以进一步缓冲内容。
利用这个api，在audio上监听 canplay 派发的事件，做成标志位

> 后来 api 改至 `playing`

### 播放器 进度条 功能
#### normal 的长形进度条
在 progress 上监听 `touchstart`, `touchmove`, `touchend` 三个事件
- touchstart: 获取第一次点击的横坐标和已播放的进度条长度
- touchmove: 获取移动后的横坐标，并定义 delta 为 移动后坐标 - 第一次点击的横坐标
设置 偏移量 offsetWidth 为 已播放的进度条长度 + delta
在去设置 progress 和 progressBtn 的宽度和transform 量都为 offsetWidth
- touchend: 一些组件特有的逻辑，和进度条不太相关暂不赘述

而点击任意位置，移动进度按钮，则是通过为 progress 进度条添加点击事件
```js
progressClick(e) {
  this._offset(e.offsetX - progressBtnWidth / 2)
  this._triggerPercent()
}
```
#### mini 的圆形进度条
利用了 SVG 实现，其中有两个圆，一个是背景圆形，另一个为已播放的圆形进度

```js
<div class="progress-circle">
  <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
    <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent"    :stroke-dasharray="dashArray"
    :stroke-dashoffset="dashOffset"/>
  </svg>
  <slot></slot>
</div>
```

#### 修复进度条的 BUG

迷你播放器暂停状态，进入全屏，按钮在进度条最左边

- 原因：当播放器最小化的时候，progress-bar 仍然在监听 percent 的变化，所以在不断计算进度条的位置，然而这个时候由于播放器隐藏，进度条的宽度 this.$refs.progressBar.clientWidth 计算为0，因此计算出来的 offset 也是不对的，导致再次最大化播放器的时候，由于播放器是暂停状态， percent 并不会变化，也不会重新计算这个 offset ，导致 Bug。
- 解决方案：当播放器最大化的时候，手动去计算一次 offset，确保进度条的位置正确。
progress-bar 组件要 watch 下 fullScreen，在进入全屏的时候调用一下 移动按钮函数

### 歌词 lyric

获取歌词，虽然我们约定返回数据是 json，但QQ音乐 返回的是依然是 jsonp，所以我们需要做一层数据的处理

`const reg = /^\w+\(({.+})\)$/`
就是将返回的jsonp格式摘取出我们需要的json字段

`ret = JSON.parse(matches[1])`
将正则分组（就是正则括号内的内容）捕获的json字符串数据 转成 json 格式

然后我们在 player 组件中监听 currentSong 的变化，获取 this.currentSong.getLyric()

```js
axios.get(url, {
  headers: {
    referer: 'https://c.y.qq.com/',
    host: 'c.y.qq.com'
  },
  params: req.query
}).then((response) => {
  let ret = response.data
  if (typeof ret === 'string') {
    const reg = /^\w+\(({.+})\)$/
    const matches = ret.match(reg)
    if (matches) {
      ret = JSON.parse(matches[1])
    }
  }
  res.json(ret)
})
```

然后我们得到的返回数据的是 base64 的字符串，需要解码，这里用到了第三方库: `js-base64`
（我们这次用的是QQ音乐pc版的歌词，需要解码base64，而移动版的QQ音乐是不需要的）

```js
this.lyric = Base64.decode(res.lyric)
```

之后利用第三方库: `js-lyric` ，解析我们的歌词，生成方便操作的对象

```js
getLyric() {
  this.currentSong.getLyric()
    .then(lyric => {
      this.currentLyric = new Lyric(lyric)
    })
}
```

#### 歌词滚动
当前歌曲的歌词高亮是利用 `js-lyric` 会派发的 handle 事件
```js
 this.currentLyric = new Lyric(lyric, this.handleLyric)
```
`js-lyric` 会在每次改变当前歌词时触发这个函数，函数的参数为 当前的 lineNum 和 txt

#### 而 使当前高亮歌词保持最中间 是利用了 BScroll 滚动至高亮的歌词
```js
let middleLine = isIphoneX() ? 7 : 5  // 鉴于iphonex太长了，做个小优化
if (lineNum > middleLine) {
  let lineEl = this.$refs.lyricLine[lineNum - middleLine]
  this.$refs.lyricList.scrollToElement(lineEl, 1000)
} else {
  this.$refs.lyricList.scrollTo(0, 0, 1000)
}
```

### cd 与 歌词 之间滑动

通过监听 middle 的 三个 touch 事件

`offsetWidth` 是为了计算歌词列表的一个偏移量的，首先它的偏移量不能大于0，也不能小于 `-window.innerWidth`。
left 是根据当前显示的是 cd 还是歌词列表初始化的位置，如果是 cd，那么 left 为 0 ，歌词是从右往左拖的，deltaX 是小于 0 的，所以最终它的偏移量就是 `0+deltaX`；如果已经显示歌词了，那么 left 为 `-window.innerWidth`，歌词是从左往右拖，deltaX 是大于 0 的，所以最终它的偏移量就是 `-window.innerWidth + deltaX`。

```js
middleTouchStart(e) {
  this.touch.initiated = true
  this.touch.startX = e.touches[0].pageX
  this.touch.startY = e.touches[0].pageY
},
middleTouchMove(e) {
  if (!this.touch.initiated) return
  const deltaX = e.touches[0].pageX - this.touch.startX
  const deltaY = e.touches[0].pageY - this.touch.startY
  if (Math.abs(deltaY) > Math.abs(deltaX)) {
    return
  }
  const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
  const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
  this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
  console.log(this.touch.percent)
  this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
  this.$refs.lyricList.$el.style[transitionDuration] = 0
  this.$refs.middleL.style.opacity = 1 - this.touch.percent
  this.$refs.middleL.style[transitionDuration] = 0
},
middleTouchEnd() {
  let offsetWidth, opacity
  // 从右向左滑 的情况
  if (this.currentShow === 'cd') {
    if (this.touch.percent > 0.1) {
      offsetWidth = -window.innerWidth
      opacity = 0
      this.currentShow = 'lyric'
    } else {
      offsetWidth = 0
      opacity = 1
    }
  } else {
    //  从左向右滑 的情况
    if (this.touch.percent < 0.9) {
      offsetWidth = 0
      opacity = 1
      this.currentShow = 'cd'
    } else {
      offsetWidth = -window.innerWidth
      opacity = 0
    }
  }
  const durationTime = 300
  this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
  this.$refs.lyricList.$el.style[transitionDuration] = `${durationTime}ms`
  this.$refs.middleL.style.opacity = opacity
  this.$refs.middleL.style[transitionDuration] = `${durationTime}ms`
}
```


## 优化
Vue 按需加载路由：

当打包构建应用时，Javascript 包会变得非常大，影响页面加载。如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了。

结合 **Vue 的异步组件**和 **Webpack 的代码分割功能**，轻松实现路由组件的懒加载。

- 首先，可以将异步组件定义为返回一个 Promise 的工厂函数 (该函数返回的 Promise 应该 resolve 组件本身)：
`const Foo = () => Promise.resolve({ /* 组件定义对象 */ })`

- 第二，在 Webpack 2 中，我们可以使用动态 import语法来定义代码分块点 (split point)：
`import('./Foo.vue') // 返回 Promise`

在我们的项目中的 router/index.js 是这样定义的：
```js
// Vue 异步加载路由
// 引入5个 一级路由组件
const Recommend = () => import('components/recommend/recommend')
const Singer = () => import('components/singer/singer')
const Rank = () => import('components/rank/rank')
const Search = () => import('components/search/search')
const UserCenter = () => import('components/user-center/user-center')
// 二级路由组件
const SingerDetail = () => import('components/singer-detail/singer-detail')
const Disc = () => import('components/disc/disc')
const TopList = () => import('components/top-list/top-list')
```
无需改动其他的代码

## 手机联调
电脑，手机 同一WIFI下

配置 config 的 index.js 里的 host 为 '0.0.0.0'，手机可以打开电脑的IP地址+端口查看

mac下 ifconfig 查看ip



## 移动端调试工具
移动端console：vConsole
移动端抓包工具：charles


# 结语
以上是在实现这个音乐 Vue 项目中遇到的难点以及一些使用技巧。在这里记录下来方便以后自己查阅，还能够给同样在前端这个小领域奋斗的大家提供一小些学习资料~

