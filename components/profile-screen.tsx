"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Edit, LogOut, Plus, Trash } from "lucide-react"
import { getUserProfile, saveUserProfile, type UserProfile, type ProfileLink } from "@/lib/profile-store"
import { useToast } from "@/hooks/use-toast"

export function ProfileScreen() {
  const { toast } = useToast()
  const [userData, setUserData] = useState<UserProfile>(getUserProfile())
  const [isEditing, setIsEditing] = useState(false)
  const [newLink, setNewLink] = useState<ProfileLink>({ title: "", url: "" })

  // Загружаем данные профиля при монтировании компонента
  useEffect(() => {
    setUserData(getUserProfile())

    // Добавляем слушатель события обновления профиля
    const handleProfileUpdate = () => {
      setUserData(getUserProfile())
    }

    window.addEventListener("profileUpdated", handleProfileUpdate)

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate)
    }
  }, [])

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      if (userData.links.length >= 5) {
        toast({
          title: "Ошибка",
          description: "Максимальное количество ссылок - 5",
          variant: "destructive",
        })
        return
      }

      setUserData({
        ...userData,
        links: [...userData.links, newLink],
      })

      setNewLink({ title: "", url: "" })
    }
  }

  const handleRemoveLink = (index: number) => {
    const updatedLinks = [...userData.links]
    updatedLinks.splice(index, 1)

    setUserData({
      ...userData,
      links: updatedLinks,
    })
  }

  const handleSaveProfile = () => {
    // Проверка длины описания
    if (userData.description.length > 150) {
      toast({
        title: "Ошибка",
        description: "Описание не может быть длиннее 150 символов",
        variant: "destructive",
      })
      return
    }

    // Сохраняем профиль в localStorage
    saveUserProfile(userData)

    toast({
      title: "Успешно",
      description: "Профиль успешно обновлен",
    })

    setIsEditing(false)
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 sticky top-0 bg-white z-10 flex items-center justify-between">
        <h1 className="text-xl font-bold">Мой профиль</h1>
        <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
          <Edit className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 p-4">
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <div className="w-[200px] h-[200px] rounded-full overflow-hidden mb-4">
              <img
                src={`/placeholder.svg?height=200&width=200&text=${userData.username.charAt(0).toUpperCase()}`}
                alt={userData.name}
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <Button className="absolute bottom-4 right-0 rounded-full w-10 h-10 p-0" variant="secondary">
                <Edit className="h-5 w-5" />
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="w-full max-w-md space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание (до 150 символов)</Label>
                <Textarea
                  id="description"
                  value={userData.description}
                  onChange={(e) => setUserData({ ...userData, description: e.target.value })}
                  maxLength={150}
                />
                <div
                  className={`text-xs text-right ${userData.description.length > 150 ? "text-red-500" : "text-muted-foreground"}`}
                >
                  {userData.description.length}/150
                </div>
              </div>
            </div>
          ) : (
            <>
              <h2 className="font-roboto text-[24px] text-black font-medium mb-2">{userData.name}</h2>

              <p className="font-roboto text-[16px] text-[#666666] text-center mb-6 max-w-md">{userData.description}</p>
            </>
          )}
        </div>

        <div className="w-full max-w-md mx-auto">
          <h3 className="font-medium mb-3">Ссылки {isEditing && `(${userData.links.length}/5)`}</h3>

          <div className="flex flex-wrap gap-4 justify-center mb-6">
            {userData.links.map((link, index) => (
              <div key={index} className={`flex items-center ${isEditing ? "justify-between w-full" : ""}`}>
                {isEditing ? (
                  <>
                    <div className="flex-1">
                      <Input
                        value={link.title}
                        onChange={(e) => {
                          const updatedLinks = [...userData.links]
                          updatedLinks[index].title = e.target.value
                          setUserData({ ...userData, links: updatedLinks })
                        }}
                        className="mb-1"
                        placeholder="Название"
                      />
                      <Input
                        value={link.url}
                        onChange={(e) => {
                          const updatedLinks = [...userData.links]
                          updatedLinks[index].url = e.target.value
                          setUserData({ ...userData, links: updatedLinks })
                        }}
                        placeholder="URL"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 text-destructive"
                      onClick={() => handleRemoveLink(index)}
                    >
                      <Trash className="h-5 w-5" />
                    </Button>
                  </>
                ) : (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center bg-[#007BFF] text-white rounded-full w-20 h-20 p-2 transition-transform hover:scale-105"
                  >
                    <Plus className="h-5 w-5 rotate-45 mb-1" />
                    <span className="text-xs text-center">{link.title}</span>
                  </a>
                )}
              </div>
            ))}

            {isEditing && userData.links.length < 5 && (
              <div className="space-y-2 w-full">
                <div className="flex items-center space-x-2">
                  <Input
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                    placeholder="Название ссылки"
                  />
                  <Input
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    placeholder="URL"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleAddLink}
                    disabled={!newLink.title || !newLink.url}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {isEditing && (
            <Button className="w-full bg-[#28A745] hover:bg-[#218838] text-white" onClick={handleSaveProfile}>
              Сохранить изменения
            </Button>
          )}

          <Button variant="outline" className="w-full mt-8 text-destructive border-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Выйти из аккаунта
          </Button>
        </div>
      </div>
    </div>
  )
}

