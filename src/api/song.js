import {commonParams} from './config'
import axios from 'axios'

export function getLyric(mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    loginUin: 0,
    needNewCode: 0,
    format: 'json',
    g_tk: 999222372,
    pcachetime: +new Date(),
    songmid: mid
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
