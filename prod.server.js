const express = require('express')
const axios = require('axios')
const config = require('./config/index')

const port = process.env.PORT || config.build.port

const app = express()

const apiRoutes = express.Router()

// 这些是项目所需要请求的数据源
apiRoutes.get('/getRecommend', function (req, res) {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://m.y.qq.com',
      origin: 'm.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data) // axios 返回的数据在 response.data，要把数据透传到我们自定义的接口里面 res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
});

apiRoutes.get('/getDiscList', function (req, res) {
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

apiRoutes.get('/getDiscSongList', function (req, res) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
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

apiRoutes.get('/getSingerList', function (req, res) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/portal/singer_list.html',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data) // axios 返回的数据在 response.data，要把数据透传到我们自定义的接口里面 res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
});

apiRoutes.get('/getSingerDetail', function (req, res) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/n/yqq/singer/003Nz2So3XXYek.html',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data) // axios 返回的数据在 response.data，要把数据透传到我们自定义的接口里面 res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
});

apiRoutes.get('/getCdInfo', function (req, res) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
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
  }).catch((e) => {
    console.log(e)
  })
});

apiRoutes.get('/lyric', function (req, res) {
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

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
  }).catch((e) => {
    console.log(e)
  })
});

apiRoutes.get('/getTopList', function (req, res) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://m.y.qq.com',
      origin: 'https://m.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data) // axios 返回的数据在 response.data，要把数据透传到我们自定义的接口里面 res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
});

apiRoutes.get('/getDetailToplist', function (req, res) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'c.y.qq.com',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data) // axios 返回的数据在 response.data，要把数据透传到我们自定义的接口里面 res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
});

apiRoutes.get('/getHotKey', function (req, res) {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://m.y.qq.com/',
      origin: 'https://m.y.qq.com/'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data) // axios 返回的数据在 response.data，要把数据透传到我们自定义的接口里面 res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
});

apiRoutes.get('/search', function (req, res) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  axios.get(url, {
    headers: {
      referer: 'https://m.y.qq.com/',
      origin: 'https://m.y.qq.com/'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data) // axios 返回的数据在 response.data，要把数据透传到我们自定义的接口里面 res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
});

app.use('/api', apiRoutes)

// 将 dist 作为静态资源目录
app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
