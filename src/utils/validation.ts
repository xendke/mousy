const isValidEmail = (email: string) => {
  return /\S+@\S+\.\S+/.test(email)
}

export default isValidEmail
