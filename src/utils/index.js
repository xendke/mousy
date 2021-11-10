export const logger = (...args) => {
  console.log(...args)
}

export const throttle = (callback, limit) => {
  let waiting = false
  return (...args) => {
    if (!waiting) {
      callback(...args)
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

export const formatInterests = (interests) =>
  interests
    .toLowerCase()
    .split(',')
    .map((s) => s.trim())

export const compose =
  (...all) =>
  (original) =>
    all.reduceRight((current, f) => f(current), original)
