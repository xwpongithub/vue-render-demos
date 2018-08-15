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

function processComponentName(Component, { prefix = '', firstUpperCase = false } = {}) {
  const name = Component.name
  const pureName = name.replace(/^app-/i, '')
  let camelizeName = `${camelize(`${prefix}${pureName}`)}`
  if (firstUpperCase) {
    camelizeName = camelizeName.charAt(0).toUpperCase() + camelizeName.slice(1)
  }
  return camelizeName
}

function parseRenderData(data = {}, events = {}) {
  events = parseEvents(events)
  const props = { ...data }
  const on = {}
  // 把props中传入的回调函数赋值给on后，再把props中传入的相关回调删除剔除
  for (const name in events) {
    if (events.hasOwnProperty(name)) {
      const handlerName = events[name]
      if (props[handlerName]) {
        on[name] = props[handlerName]
        delete props[handlerName]
      }
    }
  }
  return {
    props,
    on
  }
}

function parseEvents(events) {
  const parsedEvents = {}
  events.forEach(name => {
    parsedEvents[name] = camelize(`on-${name}`)
  })
  return parsedEvents
}
