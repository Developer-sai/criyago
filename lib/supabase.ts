import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Activity {
  id: string
  user_id: string
  type: 'cycling' | 'walking' | 'exercise' | 'water' | 'sleep'
  value: number
  unit: string
  date: string
  created_at: string
}

export interface Goal {
  id: string
  user_id: string
  activity_type: 'cycling' | 'walking' | 'exercise' | 'water' | 'sleep'
  target_value: number
  unit: string
  frequency: 'daily' | 'weekly' | 'monthly'
  created_at: string
  updated_at: string
}

export interface Reminder {
  id: string
  user_id: string
  type: 'walking_break' | 'health_checkup' | 'social_media_limit' | 'custom'
  title: string
  description?: string
  time: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'custom'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface WellnessScore {
  id: string
  user_id: string
  date: string
  score: number
  activities_completed: number
  goals_met: number
  created_at: string
}

// Database functions
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export const createActivity = async (activity: Omit<Activity, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('activities')
    .insert([activity])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getUserActivities = async (userId: string, date?: string) => {
  let query = supabase
    .from('activities')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (date) {
    query = query.eq('date', date)
  }
  
  const { data, error } = await query
  if (error) throw error
  return data
}

export const createGoal = async (goal: Omit<Goal, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('goals')
    .insert([goal])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getUserGoals = async (userId: string) => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
  
  if (error) throw error
  return data
}

export const createReminder = async (reminder: Omit<Reminder, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('reminders')
    .insert([reminder])
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getUserReminders = async (userId: string) => {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
  
  if (error) throw error
  return data
}

export const updateWellnessScore = async (userId: string, date: string, score: number, activitiesCompleted: number, goalsMet: number) => {
  const { data, error } = await supabase
    .from('wellness_scores')
    .upsert({
      user_id: userId,
      date,
      score,
      activities_completed: activitiesCompleted,
      goals_met: goalsMet
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}