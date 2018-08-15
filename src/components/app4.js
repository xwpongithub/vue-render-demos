Vue.use(NumberKeyboard)

const keyboard = NumberKeyboard.$create({
  onShow: () => console.log('show'),
  onHide: () => console.log('hide')
}, true)
