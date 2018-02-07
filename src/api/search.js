import {commonParams} from './config'
import axios from 'axios'

export function getHotKey() {
  const url = '/api/getHotKey'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1,
    uin: 0,
    format: 'json',
    g_tk: 999222372
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

export function searchQ(query, page, zhida, perpage) {
  // 三个参数：查询的字段、查询第几页、是否需要歌手详情
  const url = '/api/search'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    needNewCode: 1,
    uin: 0,
    format: 'json',
    g_tk: 999222372,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage,
    n: perpage,
    remoteplace: 'txt.mqq.all',
    w: query,
    p: page,
    catZhida: zhida ? 1 : 0
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
