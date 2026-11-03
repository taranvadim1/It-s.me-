"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Edit, LogOut, Plus, Trash } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Profile {
  id: string
  username: string
  name: string
  description: string | null
  avatar: string | null
  links: { title: string; url: string }[]
}

export function ProfileScreen() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [newLink, setNewLink] = useState({ title: "", url: "" })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    setLoading(true)
    setError("")

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) {
      setLoading(false)
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle()

    if (profileError) {
      console.error(profileError)
      setError("Не удалось загрузить профиль")
      setLoading(false)
      return
    }

    if (profile) {
      setUser({
        ...profile,
        description: profile.description || "",
        avatar: profile.avatar || null,
        links: Array.isArray(profile.links) ? profile.links : [],
      })
    } else {
      const username =
        authUser.user_metadata?.username ||
        authUser.email?.split("@")[0] ||
        "user"

      const newProfile = {
        id: authUser.id,
        username,
        name: authUser.user_metadata?.name || username,
        description:
          authUser.user_metadata?.description || "Мой профиль на it's.me",
        avatar: null,
        links: [],
      }

      const { data: createdProfile, error: createError } = await supabase
        .from("profiles")
        .insert(newProfile)
        .select()
        .single()

      if (createError) {
        console.error(createError)
        setError("Не удалось создать профиль")
        setLoading(false)
        return
      }

      setUser(createdProfile)
    }

    setLoading(false)
  }

  const save = async () => {
    if (!user) return

    if (user.description.length > 150) {
      setError("Описание не может быть длиннее 150 символов")
      return
    }

    setSaving(true)
    setError("")

    const { data, error: updateError } = await supabase
      .from("profiles")
      .update({
        name: user.name,
        description: user.description,
        avatar: user.avatar,
        links: user.links,
      })
      .eq("id", user.id)
      .select()
      .single()

    if (updateError) {
      console.error(updateError)
      setError("Не удалось сохранить изменения")
      setSaving(false)
      return
    }

    setUser({
      ...data,
      description: data.description || "",
      avatar: data.avatar || null,
      links: Array.isArray(data.links) ? data.links : [],
    })

    setEditing(false)
    setSaving(false)
  }

  const addLink = () => {
    if (!user) return
    if (!newLink.title || !newLink.url) return
    if (user.links.length >= 5) return

    setUser({
      ...user,
      links: [...user.links, newLink],
    })

    setNewLink({ title: "", url: "" })
  }

  const removeLink = (index: number) => {
    if (!user) return

    setUser({
      ...user,
      links: user.links.filter((_, i) => i !== index),
    })
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-muted-foreground">Загрузка профиля...</p>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>

        <Button onClick={() => router.push("/auth/register")}>
          Создать профиль
        </Button>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-bold mb-3">
          Ваш профиль ещё не создан
        </h1>

        <Button onClick={() => router.push("/auth/register")}>
          Создать профиль
        </Button>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">Мой профиль</h1>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setEditing(!editing)
            setError("")
          }}
        >
          <Edit className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 p-4">
        <div className="flex flex-col items-center mb-6">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center text-4xl font-bold text-white mb-4">
            {user.username.charAt(0).toUpperCase()}
          </div>

          {editing ? (
            <div className="w-full max-w-md space-y-4">
              <div>
                <Label>Имя</Label>

                <Input
                  value={user.name}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label>О себе (до 150 символов)</Label>

                <Textarea
                  maxLength={150}
                  value={user.description}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      description: e.target.value,
                    })
                  }
                />

                <div className="text-xs text-right">
                  {user.description.length}/150
                </div>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-medium">
                {user.name}
              </h2>

              <p className="text-center text-muted-foreground max-w-md">
                @{user.username}
                <br />
                {user.description}
              </p>
            </>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center mb-4">
            {error}
          </p>
        )}

        <div className="w-full max-w-md mx-auto">
          <h3 className="font-medium mb-3">
            Мои ссылки
          </h3>

          <div className="space-y-2">
            {user.links.map((link, index) => (
              <div
                key={index}
                className="flex gap-2 items-center"
              >
                {editing ? (
                  <>
                    <Input
                      value={link.title}
                      onChange={(e) => {
                        const links = [...user.links]

                        links[index] = {
                          ...links[index],
                          title: e.target.value,
                        }

                        setUser({
                          ...user,
                          links,
                        })
                      }}
                    />

                    <Input
                      value={link.url}
                      onChange={(e) => {
                        const links = [...user.links]

                        links[index] = {
                          ...links[index],
                          url: e.target.value,
                        }

                        setUser({
                          ...user,
                          links,
                        })
                      }}
                    />

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLink(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full rounded-xl border p-3 hover:bg-muted"
                  >
                    {link.title}
                  </a>
                )}
              </div>
            ))}

            {editing && user.links.length < 5 && (
              <div className="flex gap-2">
                <Input
                  placeholder="Название"
                  value={newLink.title}
                  onChange={(e) =>
                    setNewLink({
                      ...newLink,
                      title: e.target.value,
                    })
                  }
                />

                <Input
                  placeholder="URL"
                  value={newLink.url}
                  onChange={(e) =>
                    setNewLink({
                      ...newLink,
                      url: e.target.value,
                    })
                  }
                />

                <Button
                  size="icon"
                  onClick={addLink}
                >
                  <Plus />
                </Button>
              </div>
            )}

            {editing && (
              <Button
                className="w-full mt-4"
                onClick={save}
                disabled={saving}
              >
                {saving ? "Сохранение..." : "Сохранить изменения"}
              </Button>
            )}

            <Button
              variant="outline"
              className="w-full mt-8"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Выйти
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}