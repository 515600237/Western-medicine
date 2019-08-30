
// 判断有对应className
export function hasClass(el, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
  }
  // 添加className
  export function addClass(el, className) {
    if (hasClass(el, className)) {
      return
    }
  
    let newClass = el.className.split(' ')
    newClass.push(className)
    el.className = newClass.join(' ')
  }
//   获取属性名称
  export function getData(el, name, val) {
    const prefix = 'data-'
    if (val) {
      return el.setAttribute(prefix + name, val)
    }
    return el.getAttribute(prefix + name)
  }

  // watch延迟执行
  export function debounce(func, delay) {
    let timer
    return function (...args) {
      console.log(args);
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        func.apply(this, args)
      }, delay)
    }
  }