export type Client = {
  id: string
  full_name: string
  phone: string
  email: string | null
  notes: string | null
  created_at: string
  pets?: { count: number }[]
}

export type Pet = {
  id: string
  client_id: string
  name: string
  species: "canino" | "felino" | "otro"
  breed: string | null
  behavior_notes: string | null
  image_url: string | null
  created_at: string
}

export type ClientFormData = {
  full_name: string
  phone: string
  email?: string
  notes?: string
}

export type PetFormData = {
  name: string
  species: "canino" | "felino" | "otro"
  breed?: string
  behavior_notes?: string
}