export const throttle = (callback, limit) => {
  let waiting = false
  return () => {
    if (!waiting) {
      callback()
      waiting = true
      setTimeout(() => {
        waiting = false
      }, limit)
    }
  }
}

export const debounce = (callback, wait) => {
  let timeout
  return (...args) => {
    const later = () => {
      clearTimeout(timeout)
      callback(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
