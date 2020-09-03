export const saveState = (state) => {
  try {
    const stateToPersist = JSON.stringify(state)
    localStorage.setItem('SA_STATE', stateToPersist)
  } catch {
    console.error('Could not persist state.')
  }
}

export const loadState = () => {
  try {
    const persistedState = localStorage.getItem('SA_STATE')
    if (persistedState) {
      return JSON.parse(persistedState)
    }
    return undefined
  } catch {
    console.error('Could not load state.')
    return undefined
  }
}
