// import jsonp from 'common/js/jsonp'
import {commonParams} from './config'
import axios from 'axios'

// const debug = process.env.NODE_ENV !== 'production'

// jsonp 请求 QQ音乐 Recommend 的数据 ，由于官方已经改为 XHR 实现，虽然官方jsonp接口暂未关闭，但这里我将改为 http 伪造请求
// 但是 这种将 jsonp Promise封装 的方法 值得学习

// export function getRecommend() {
//   const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
//
//   const data = Object.assign({}, commonParams, {
//     platform: 'h5',
//     uin: 0,
//     needNewCode: 1
//   })
//
//   return jsonp(url, data, options)
// }

export function getRecommend() {
  const url = '/api/getRecommend'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getDiscList() {
  const url = '/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getDiscSongList(disstid) {
  const url = '/api/getDiscSongList'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    type: 1,
    json: 1,
    onlysong: 0,
    hostUin: 0,
    loginUin: 0,
    notice: 0,
    needNewCode: 0,
    format: 'json',
    g_tk: 999222372,
    disstid
  })

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
