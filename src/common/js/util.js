function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
  let _arr = arr.slice() // 复制数组
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomIntInclusive(0, i)
    let temp = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = temp
  }
  return _arr
}

export function isIphoneX() {
  return /iphone/gi.test(navigator.userAgent) && (screen.height === 812 && screen.width === 375)
}
