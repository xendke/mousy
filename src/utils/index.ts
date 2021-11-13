export const logger = (...args) => {
  console.log(...args)
}

export const noop = () => undefined

type GenericFunction<T> = (...a) => T

export const throttle = (callback: GenericFunction<void>, limit: number) => {
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

export const debounce = (callback: GenericFunction<void>, wait: number) => {
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

export const compose =
  (...all: GenericFunction<unknown>[]) =>
  (original) =>
    all.reduceRight((current, f) => f(current), original)
