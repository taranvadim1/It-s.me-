// Типы для хранения данных профиля
export interface UserProfile {
  username: string
  name: string
  description: string
  avatar?: string
  links: ProfileLink[]
}

export interface ProfileLink {
  title: string
  url: string
}

// Начальные данные профиля
const initialProfile: UserProfile = {
  username: "current_user",
  name: "Текущий Пользователь",
  description:
    "Фрилансер, специализирующийся на веб-разработке и дизайне. Создаю красивые и функциональные сайты для малого и среднего бизнеса.",
  links: [
    { title: "Портфолио", url: "https://portfolio.example.com" },
    { title: "GitHub", url: "https://github.com/example" },
    { title: "LinkedIn", url: "https://linkedin.com/in/example" },
  ],
}

// Функции для работы с localStorage
export const getUserProfile = (): UserProfile => {
  if (typeof window === "undefined") return initialProfile

  const storedProfile = localStorage.getItem("userProfile")
  return storedProfile ? JSON.parse(storedProfile) : initialProfile
}

export const saveUserProfile = (profile: UserProfile): void => {
  if (typeof window === "undefined") return
  localStorage.setItem("userProfile", JSON.stringify(profile))

  // Вызываем событие для обновления данных в других компонентах
  window.dispatchEvent(new Event("profileUpdated"))
}

