// Типы для хранения данных о друзьях
export interface Friend {
  username: string
  name: string
  status: "online" | "offline"
  addedAt: number
}

export interface FriendRequest {
  username: string
  name: string
  requestedAt: number
}

// Начальные данные
const initialFriends: Friend[] = [
  { username: "john_doe", name: "Джон Доу", status: "online", addedAt: Date.now() - 86400000 * 7 },
  { username: "jane_smith", name: "Джейн Смит", status: "offline", addedAt: Date.now() - 86400000 * 3 },
  { username: "alex_dev", name: "Алекс Разработчик", status: "online", addedAt: Date.now() - 86400000 },
]

const initialRequests: FriendRequest[] = [
  { username: "maria_design", name: "Мария Дизайнер", requestedAt: Date.now() - 3600000 },
  { username: "tech_guru", name: "Технический Гуру", requestedAt: Date.now() - 7200000 },
]

// Функции для работы с localStorage
const getFriends = (): Friend[] => {
  if (typeof window === "undefined") return initialFriends

  const storedFriends = localStorage.getItem("friends")
  return storedFriends ? JSON.parse(storedFriends) : initialFriends
}

const getFriendRequests = (): FriendRequest[] => {
  if (typeof window === "undefined") return initialRequests

  const storedRequests = localStorage.getItem("friendRequests")
  return storedRequests ? JSON.parse(storedRequests) : initialRequests
}

const saveFriends = (friends: Friend[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("friends", JSON.stringify(friends))
}

const saveFriendRequests = (requests: FriendRequest[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("friendRequests", JSON.stringify(requests))
}

// Функции для управления друзьями
export const addFriend = (username: string, name: string) => {
  const friends = getFriends()
  const requests = getFriendRequests()

  // Проверяем, есть ли пользователь уже в друзьях
  if (friends.some((friend) => friend.username === username)) {
    return
  }

  // Проверяем, есть ли запрос от этого пользователя
  const requestIndex = requests.findIndex((req) => req.username === username)
  if (requestIndex !== -1) {
    // Если есть запрос, удаляем его и добавляем пользователя в друзья
    const request = requests[requestIndex]
    requests.splice(requestIndex, 1)
    saveFriendRequests(requests)

    friends.push({
      username,
      name: request.name,
      status: Math.random() > 0.5 ? "online" : "offline", // Случайный статус для демонстрации
      addedAt: Date.now(),
    })
  } else {
    // Если запроса нет, просто добавляем пользователя в друзья
    friends.push({
      username,
      name,
      status: Math.random() > 0.5 ? "online" : "offline", // Случайный статус для демонстрации
      addedAt: Date.now(),
    })
  }

  saveFriends(friends)
}

export const removeFriend = (username: string) => {
  const friends = getFriends()
  const updatedFriends = friends.filter((friend) => friend.username !== username)
  saveFriends(updatedFriends)
}

export const acceptFriendRequest = (username: string) => {
  const friends = getFriends()
  const requests = getFriendRequests()

  const requestIndex = requests.findIndex((req) => req.username === username)
  if (requestIndex !== -1) {
    const request = requests[requestIndex]
    requests.splice(requestIndex, 1)
    saveFriendRequests(requests)

    friends.push({
      username,
      name: request.name,
      status: Math.random() > 0.5 ? "online" : "offline", // Случайный статус для демонстрации
      addedAt: Date.now(),
    })

    saveFriends(friends)
  }
}

export const rejectFriendRequest = (username: string) => {
  const requests = getFriendRequests()
  const updatedRequests = requests.filter((req) => req.username !== username)
  saveFriendRequests(updatedRequests)
}

export const isFriend = (username: string): boolean => {
  const friends = getFriends()
  return friends.some((friend) => friend.username === username)
}

export const getAllFriends = (): Friend[] => {
  return getFriends()
}

export const getAllFriendRequests = (): FriendRequest[] => {
  return getFriendRequests()
}

