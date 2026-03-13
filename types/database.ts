export type User = {
  id: string
  username: string
  email: string
  avatar: string | null
  created_at: string
}

export type Card = {
  id: string
  user_id: string
  card_name: string
  front_image_url: string
  back_image_url: string | null
  created_at: string
}

export type Grade = {
  id: string
  card_id: string
  overall: number
  centering: number
  corners: number
  edges: number
  surface: number
  summary: string
  recommendation: string
  created_at: string
}

export type CardWithGrade = Card & {
  grades: Grade | null
  users: Pick<User, 'username' | 'avatar'> | null
}

export type NewsletterPost = {
  id: string
  title: string
  body: string
  before_image_url: string | null
  after_image_url: string | null
  published_at: string
}

export type Subscriber = {
  id: string
  email: string
  subscribed_at: string
}

export type GradeResult = {
  grade: number
  centering: number
  corners: number
  edges: number
  surface: number
  summary: string
  recommendation: string
}
