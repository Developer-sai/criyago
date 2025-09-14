'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Activity, 
  Droplets, 
  Moon, 
  Footprints, 
  Bike, 
  Target, 
  Bell,
  GamepadIcon,
  Share2,
  Plus
} from 'lucide-react'
import { getUserProfile, createActivity } from '@/lib/supabase'
import type { User, Activity as ActivityType } from '@/lib/supabase'
import { ActivityTracker, QuickActivityButtons } from '@/components/activity-tracker'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [todayActivities, setTodayActivities] = useState<ActivityType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }

    const loadUserData = async () => {
      try {
        const userProfile = await getUserProfile(session.user.email!)
        setUser(userProfile)
        // TODO: Load today's activities
        setTodayActivities([])
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [session, status, router])

  const quickActions = [
    { icon: Footprints, label: 'Log Walk', color: 'bg-green-500' },
    { icon: Bike, label: 'Log Cycling', color: 'bg-blue-500' },
    { icon: Activity, label: 'Log Exercise', color: 'bg-red-500' },
    { icon: Droplets, label: 'Log Water', color: 'bg-cyan-500' },
    { icon: Moon, label: 'Log Sleep', color: 'bg-purple-500' },
  ]

  const todayStats = {
    steps: 7500,
    water: 6,
    exercise: 30,
    sleep: 7.5
  }

  const goals = {
    steps: 10000,
    water: 8,
    exercise: 60,
    sleep: 8
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900/10 dark:via-pink-900/10 dark:to-orange-900/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your wellness dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-900/10 dark:via-pink-900/10 dark:to-orange-900/10">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={session?.user?.image || ''} />
              <AvatarFallback>{session?.user?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {session?.user?.name?.split(' ')[0]}!</h1>
              <p className="text-muted-foreground">Let's maintain your wellness journey today</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <ActivityTracker onActivityAdded={() => window.location.reload()} />
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Reminders
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share Progress
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm font-medium">{action.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Today's Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Footprints className="w-4 h-4 mr-2 text-green-500" />
                Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.steps.toLocaleString()}</div>
              <Progress value={(todayStats.steps / goals.steps) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {goals.steps - todayStats.steps} more to goal
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Droplets className="w-4 h-4 mr-2 text-cyan-500" />
                Water (glasses)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.water}</div>
              <Progress value={(todayStats.water / goals.water) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {goals.water - todayStats.water} more to goal
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Activity className="w-4 h-4 mr-2 text-red-500" />
                Exercise (min)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.exercise}</div>
              <Progress value={(todayStats.exercise / goals.exercise) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {goals.exercise - todayStats.exercise} more to goal
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <Moon className="w-4 h-4 mr-2 text-purple-500" />
                Sleep (hours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayStats.sleep}</div>
              <Progress value={(todayStats.sleep / goals.sleep) * 100} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {(goals.sleep - todayStats.sleep).toFixed(1)} more to goal
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities & Games Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Activities
                <ActivityTracker onActivityAdded={() => window.location.reload()} />
              </CardTitle>
              <div className="mt-4">
                <QuickActivityButtons onActivityAdded={() => window.location.reload()} />
              </div>
            </CardHeader>
            <CardContent>
              {todayActivities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No activities logged today</p>
                  <p className="text-sm">Start tracking your wellness journey!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{activity.type}</p>
                        <p className="text-sm text-muted-foreground">{activity.duration} minutes</p>
                      </div>
                      <Badge variant="secondary">{activity.value}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GamepadIcon className="w-5 h-5 mr-2" />
                Wellness Games
              </CardTitle>
              <CardDescription>
                Take a fun break and boost your mood
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/#games')}>
                  <GamepadIcon className="w-4 h-4 mr-2" />
                  Play Mini Games
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/goals')}>
                  <Target className="w-4 h-4 mr-2" />
                  Manage Goals
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Achievement
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}