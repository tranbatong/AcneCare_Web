const KEY = 'acnecare_register_step1'

export function saveRegisterCredentials(email, password) {
  try {
    sessionStorage.setItem(
      KEY,
      JSON.stringify({ email, password, at: Date.now() }),
    )
  } catch {
    /* ignore quota / private mode */
  }
}

export function loadRegisterCredentials() {
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data?.email || !data?.password) return null
    return { email: data.email, password: data.password }
  } catch {
    return null
  }
}

export function clearRegisterCredentials() {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
