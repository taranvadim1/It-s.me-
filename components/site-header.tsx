"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export function SiteHeader() {
  // Имитация счетчика пользователей с случайным начальным значением
  const [userCount, setUserCount] = useState(0)

  useEffect(() => {
    // Генерируем случайное число пользователей между 10,000 и 50,000
    const initialCount = Math.floor(Math.random() * 40000) + 10000
    setUserCount(initialCount)

    // Имитация увеличения счетчика каждые несколько секунд
    const interval = setInterval(() => {
      setUserCount((prev) => prev + Math.floor(Math.random() * 5) + 1)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Форматирование числа с разделителями
  const formattedCount = userCount.toLocaleString("ru-RU")

  return (
    <div className="relative">
      {/* Градиентный фон */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-700 p-4">
        {/* Логотип и текст */}
        <div className="container mx-auto">
          <h1 className="text-center">
            <span className="font-bold text-2xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 font-display tracking-tight">
              Its.me
            </span>
            <span className="hidden md:inline text-gray-300 ml-2">—</span>
            <span className="block md:inline text-gray-300 text-lg md:text-2xl mt-1 md:mt-0 md:ml-2">
              твоя цифровая визитка
            </span>
          </h1>
        </div>
      </div>

      {/* Счетчик пользователей */}
      <div className="bg-gradient-to-b from-yellow-600 to-yellow-500">
        <div className="container mx-auto flex items-center justify-center p-2">
          <div className="flex items-center space-x-3">
            <span className="text-white font-bold text-lg md:text-xl tracking-wide uppercase font-display">
              Нас уже
            </span>
            <motion.div
              className="bg-white rounded-lg px-3 py-1 shadow-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 20,
                duration: 0.3,
              }}
            >
              <span className="text-yellow-600 font-bold text-xl md:text-2xl font-mono">{formattedCount}</span>
            </motion.div>
            <span className="text-white font-bold text-lg md:text-xl tracking-wide uppercase font-display">
              пользователей
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

