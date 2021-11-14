import { useCallback, useState } from 'react'

const useToggle = (initialState = false): [boolean, () => void] => {
  const [state, setState] = useState<boolean>(initialState)
  const toggle = useCallback((): void => setState((current) => !current), [])

  return [state, toggle]
}

export default useToggle
