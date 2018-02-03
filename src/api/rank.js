import {commonParams} from './config'
import axios from 'axios'

export function getTopList(mid) {
  const url = '/api/getTopList'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1,
    format: 'json',
    notice: 0,
    g_tk: 999222372
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function getDetailToplist(topid) {
  const url = '/api/getDetailToplist'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    page: 'detail',
    loginUin: 0,
    hostUin: 0,
    song_begin: 0,
    song_num: 30,
    needNewCode: 1,
    type: 'top',
    format: 'json',
    notice: 0,
    g_tk: 999222372,
    topid
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
