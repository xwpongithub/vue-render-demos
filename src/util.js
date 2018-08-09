function getRect(el) {
  if (typeof el.getBoundingClientRect !== 'undefined') {
    const rect = el.getBoundingClientRect()
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    }
  } else {
    return {
      top: el.offsetTop,
      left:  el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight
    }
  }
}

function camelize (str) {
  str = String(str)
  return str.replace(/-(\w)/g, function (m, c) {
    return c ? c.toUpperCase() : ''
  })
}
