export function hasClass(el, className) {
  // className 可以开头/空白字符在前，可以后面/空白字符在后
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  el.classList.add(className)
}
