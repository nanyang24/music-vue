import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
// 解决 移动端 300ms 延时点击的问题
import fastclick from 'fastclick'
// 引入SCSS
import 'common/scss/index.scss'

Vue.config.productionTip = false
fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
