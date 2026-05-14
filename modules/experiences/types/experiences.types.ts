// modules/experiences/types/experiences.types.ts
export interface Experience {
  id: string
  image: string
  title: string
  hostType: string
  price: number
  rating: number
  badge?: string
  location: string
}

export interface ExperienceCategory {
  id: string
  name: string
}