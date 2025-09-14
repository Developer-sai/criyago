-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- walking, cycling, exercise, water, sleep, nutrition
  value DECIMAL(10,2) NOT NULL, -- steps, minutes, glasses, hours, etc.
  duration INTEGER, -- duration in minutes (optional)
  notes TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- walking, cycling, exercise, water, sleep, nutrition
  target_value DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2) DEFAULT 0,
  unit VARCHAR(20) NOT NULL, -- steps, minutes, glasses, hours, etc.
  deadline DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_email, type, is_active) -- Only one active goal per type per user
);

-- Reminders table
CREATE TABLE IF NOT EXISTS reminders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type VARCHAR(50) NOT NULL, -- water, exercise, walk, health_checkup, social_media_limit
  frequency VARCHAR(20) NOT NULL, -- daily, weekly, custom
  time TIME, -- time of day for reminder
  days_of_week INTEGER[], -- array of days (0=Sunday, 1=Monday, etc.)
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wellness scores table (for tracking overall wellness)
CREATE TABLE IF NOT EXISTS wellness_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
  date DATE NOT NULL,
  activity_score INTEGER DEFAULT 0, -- 0-100
  nutrition_score INTEGER DEFAULT 0, -- 0-100
  sleep_score INTEGER DEFAULT 0, -- 0-100
  hydration_score INTEGER DEFAULT 0, -- 0-100
  overall_score INTEGER DEFAULT 0, -- 0-100
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_email, date)
);

-- Social sharing table (for activity cards)
CREATE TABLE IF NOT EXISTS social_shares (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- twitter, facebook, instagram, etc.
  share_text TEXT,
  image_url TEXT,
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activities_user_email ON activities(user_email);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
CREATE INDEX IF NOT EXISTS idx_goals_user_email ON goals(user_email);
CREATE INDEX IF NOT EXISTS idx_goals_active ON goals(is_active);
CREATE INDEX IF NOT EXISTS idx_reminders_user_email ON reminders(user_email);
CREATE INDEX IF NOT EXISTS idx_reminders_active ON reminders(is_active);
CREATE INDEX IF NOT EXISTS idx_wellness_scores_user_email ON wellness_scores(user_email);
CREATE INDEX IF NOT EXISTS idx_wellness_scores_date ON wellness_scores(date);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_shares ENABLE ROW LEVEL SECURITY;

-- Users can only see and modify their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = email);

-- Activities policies
CREATE POLICY "Users can view own activities" ON activities
  FOR SELECT USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can insert own activities" ON activities
  FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can update own activities" ON activities
  FOR UPDATE USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can delete own activities" ON activities
  FOR DELETE USING (auth.jwt() ->> 'email' = user_email);

-- Goals policies
CREATE POLICY "Users can view own goals" ON goals
  FOR SELECT USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can insert own goals" ON goals
  FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can update own goals" ON goals
  FOR UPDATE USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can delete own goals" ON goals
  FOR DELETE USING (auth.jwt() ->> 'email' = user_email);

-- Reminders policies
CREATE POLICY "Users can view own reminders" ON reminders
  FOR SELECT USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can insert own reminders" ON reminders
  FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can update own reminders" ON reminders
  FOR UPDATE USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can delete own reminders" ON reminders
  FOR DELETE USING (auth.jwt() ->> 'email' = user_email);

-- Wellness scores policies
CREATE POLICY "Users can view own wellness scores" ON wellness_scores
  FOR SELECT USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can insert own wellness scores" ON wellness_scores
  FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can update own wellness scores" ON wellness_scores
  FOR UPDATE USING (auth.jwt() ->> 'email' = user_email);

-- Social shares policies
CREATE POLICY "Users can view own social shares" ON social_shares
  FOR SELECT USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can insert own social shares" ON social_shares
  FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can update own social shares" ON social_shares
  FOR UPDATE USING (auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users can delete own social shares" ON social_shares
  FOR DELETE USING (auth.jwt() ->> 'email' = user_email);

-- Functions for automatic goal progress updates
CREATE OR REPLACE FUNCTION update_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update current_value in goals table when new activity is added
  UPDATE goals 
  SET 
    current_value = (
      SELECT COALESCE(SUM(value), 0)
      FROM activities 
      WHERE user_email = NEW.user_email 
        AND type = NEW.type 
        AND date >= CURRENT_DATE
    ),
    updated_at = NOW()
  WHERE user_email = NEW.user_email 
    AND type = NEW.type 
    AND is_active = TRUE;
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update goal progress
CREATE TRIGGER trigger_update_goal_progress
  AFTER INSERT OR UPDATE OR DELETE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_goal_progress();

-- Function to calculate wellness score
CREATE OR REPLACE FUNCTION calculate_wellness_score(user_email_param VARCHAR, date_param DATE)
RETURNS INTEGER AS $$
DECLARE
  activity_score INTEGER := 0;
  nutrition_score INTEGER := 0;
  sleep_score INTEGER := 0;
  hydration_score INTEGER := 0;
  overall_score INTEGER := 0;
BEGIN
  -- Calculate activity score (based on exercise and movement)
  SELECT 
    LEAST(100, 
      COALESCE(SUM(CASE WHEN type IN ('exercise', 'walking', 'cycling') THEN value ELSE 0 END), 0) / 60 * 100
    ) INTO activity_score
  FROM activities 
  WHERE user_email = user_email_param AND date = date_param;
  
  -- Calculate hydration score (based on water intake)
  SELECT 
    LEAST(100, 
      COALESCE(SUM(CASE WHEN type = 'water' THEN value ELSE 0 END), 0) / 8 * 100
    ) INTO hydration_score
  FROM activities 
  WHERE user_email = user_email_param AND date = date_param;
  
  -- Calculate sleep score (based on sleep hours)
  SELECT 
    LEAST(100, 
      COALESCE(SUM(CASE WHEN type = 'sleep' THEN value ELSE 0 END), 0) / 8 * 100
    ) INTO sleep_score
  FROM activities 
  WHERE user_email = user_email_param AND date = date_param;
  
  -- Calculate nutrition score (based on meal logging)
  SELECT 
    LEAST(100, 
      COALESCE(SUM(CASE WHEN type = 'nutrition' THEN value ELSE 0 END), 0) / 3 * 100
    ) INTO nutrition_score
  FROM activities 
  WHERE user_email = user_email_param AND date = date_param;
  
  -- Calculate overall score (weighted average)
  overall_score := (activity_score * 0.3 + hydration_score * 0.2 + sleep_score * 0.3 + nutrition_score * 0.2)::INTEGER;
  
  -- Insert or update wellness score
  INSERT INTO wellness_scores (user_email, date, activity_score, nutrition_score, sleep_score, hydration_score, overall_score)
  VALUES (user_email_param, date_param, activity_score, nutrition_score, sleep_score, hydration_score, overall_score)
  ON CONFLICT (user_email, date) 
  DO UPDATE SET 
    activity_score = EXCLUDED.activity_score,
    nutrition_score = EXCLUDED.nutrition_score,
    sleep_score = EXCLUDED.sleep_score,
    hydration_score = EXCLUDED.hydration_score,
    overall_score = EXCLUDED.overall_score,
    updated_at = NOW();
    
  RETURN overall_score;
END;
$$ LANGUAGE plpgsql;