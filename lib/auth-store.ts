export interface AppUser {
  email: string
  username: string
  name: string
  description: string
  avatar?: string
  links: { title: string; url: string }[]
  createdAt: string
}

const USERS_KEY = "itsme_users"
const CREDENTIALS_KEY = "itsme_credentials"
const SESSION_KEY = "itsme_session"

export function getUsers(): AppUser[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]") } catch { return [] }
}

export function saveUsers(users: AppUser[]) { localStorage.setItem(USERS_KEY, JSON.stringify(users)) }

export function registerUser(user: AppUser, password: string) {
  const users = getUsers()
  if (users.some(u => u.username.toLowerCase() === user.username.toLowerCase())) return { ok:false, error:"Этот никнейм уже занят" }
  if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) return { ok:false, error:"Этот email уже зарегистрирован" }
  const credentials = JSON.parse(localStorage.getItem(CREDENTIALS_KEY) || "{}")
  credentials[user.email.toLowerCase()] = password
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials))
  saveUsers([...users, user])
  localStorage.setItem(SESSION_KEY, user.username)
  return { ok:true }
}

export function loginUser(email: string, password: string) {
  const credentials = JSON.parse(localStorage.getItem(CREDENTIALS_KEY) || "{}")
  if (credentials[email.toLowerCase()] !== password) return { ok:false, error:"Неверный email или пароль" }
  const user = getUsers().find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!user) return { ok:false, error:"Профиль не найден" }
  localStorage.setItem(SESSION_KEY, user.username)
  return { ok:true }
}

export function getCurrentUser(): AppUser | null {
  if (typeof window === "undefined") return null
  const username = localStorage.getItem(SESSION_KEY)
  return username ? getUsers().find(u => u.username === username) || null : null
}

export function updateCurrentUser(patch: Partial<AppUser>) {
  const current = getCurrentUser()
  if (!current) return null
  const updated = { ...current, ...patch }
  saveUsers(getUsers().map(u => u.username === current.username ? updated : u))
  return updated
}

export function logoutUser() { localStorage.removeItem(SESSION_KEY) }
export function getUserByUsername(username: string) { return getUsers().find(u => u.username.toLowerCase() === username.toLowerCase()) || null }
