"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { UsernameGrid } from "@/components/username-grid"

interface MainScreenProps {
  onSelectUser: (username: string) => void
}

export function MainScreen({ onSelectUser }: MainScreenProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Расширенный список пользователей
  const allUsers = [
    // Оригинальные пользователи
    "john_doe",
    "jane_smith",
    "alex_dev",
    "maria_design",
    "tech_guru",
    "art_master",
    "web_wizard",
    "photo_pro",
    "music_lover",
    "travel_addict",
    "food_blogger",
    "fitness_coach",
    "game_master",
    "code_ninja",
    "design_star",
    "writer_pro",
    "video_maker",
    "crypto_expert",
    "science_geek",
    "math_wizard",
    "history_buff",
    "language_pro",
    "fashion_icon",
    "sports_fan",
    "nature_lover",
    "pet_friend",
    "book_worm",
    "movie_critic",
    "coffee_lover",
    "yoga_master",

    // Дополнительные пользователи
    "data_scientist",
    "ui_designer",
    "ux_expert",
    "mobile_dev",
    "cloud_engineer",
    "security_pro",
    "network_admin",
    "digital_nomad",
    "startup_founder",
    "marketing_guru",
    "seo_expert",
    "content_creator",
    "social_media",
    "influencer",
    "podcast_host",
    "video_editor",
    "3d_artist",
    "animator",
    "illustrator",
    "photographer",
    "filmmaker",
    "sound_engineer",
    "music_producer",
    "dj_master",
    "guitar_hero",
    "piano_player",
    "singer_star",
    "dancer_pro",
    "yoga_instructor",
    "fitness_model",

    // Еще больше пользователей
    "chef_cook",
    "food_stylist",
    "nutrition_coach",
    "travel_guide",
    "adventure_seeker",
    "backpacker",
    "digital_artist",
    "sketch_master",
    "paint_pro",
    "craft_lover",
    "diy_expert",
    "home_designer",
    "interior_pro",
    "architect_star",
    "urban_planner",
    "landscape_designer",
    "garden_guru",
    "plant_lover",
    "eco_warrior",
    "sustainability_pro",
    "climate_activist",
    "science_teacher",
    "math_tutor",
    "history_professor",
    "language_teacher",
    "literature_fan",
    "book_author",
    "poet_soul",
    "story_teller",
    "script_writer",

    // И еще больше
    "game_developer",
    "unity_coder",
    "vr_designer",
    "ar_expert",
    "blockchain_dev",
    "crypto_trader",
    "nft_creator",
    "web3_builder",
    "ai_researcher",
    "ml_engineer",
    "robotics_pro",
    "hardware_hacker",
    "electronics_guru",
    "maker_space",
    "product_manager",
    "agile_coach",
    "scrum_master",
    "devops_engineer",
    "qa_tester",
    "ux_researcher",
    "growth_hacker",
    "brand_strategist",
    "copywriter",
    "pr_specialist",
    "community_manager",
    "event_planner",
    "project_coordinator",
    "hr_specialist",
    "career_coach",
    "life_mentor",
  ]

  // Фильтрация пользователей по поисковому запросу
  const users = searchQuery
    ? allUsers.filter((user) => user.toLowerCase().includes(searchQuery.toLowerCase()))
    : allUsers

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 sticky top-0 bg-white z-10">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9 h-10"
            placeholder="Поиск пользователей..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {users.length > 0 ? (
        <UsernameGrid users={users} onSelectUser={onSelectUser} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">Пользователи не найдены</div>
      )}
    </div>
  )
}

