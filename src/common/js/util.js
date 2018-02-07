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

// debounce 的参数是一个函数，返回的也是一个函数，而 $watch 就是 watch 这个返回后的函数，因为 watch 的回调函数是有参数的，这个参数就是这个 ...args，这样 debounce 的参数函数在通过计时器延时执行的时候，也可以访问到这个 args 了。
export function debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
