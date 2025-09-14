'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Target, 
  Edit3, 
  Trophy, 
  Calendar,
  TrendingUp,
  CheckCircle2
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface Goal {
  id: string
  type: string
  target_value: number
  current_value: number
  unit: string
  deadline?: string
  created_at: string
}

interface GoalSettingProps {
  onGoalUpdated?: () => void
}

const goalTypes = [
  { value: 'steps', label: 'Daily Steps', unit: 'steps', defaultTarget: 10000, icon: '👟' },
  { value: 'water', label: 'Water Intake', unit: 'glasses', defaultTarget: 8, icon: '💧' },
  { value: 'exercise', label: 'Exercise Time', unit: 'minutes', defaultTarget: 60, icon: '💪' },
  { value: 'sleep', label: 'Sleep Hours', unit: 'hours', defaultTarget: 8, icon: '😴' },
  { value: 'cycling', label: 'Cycling Time', unit: 'minutes', defaultTarget: 30, icon: '🚴' },
  { value: 'walking', label: 'Walking Time', unit: 'minutes', defaultTarget: 30, icon: '🚶' },
]

export function GoalSetting({ onGoalUpdated }: GoalSettingProps) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [goals, setGoals] = useState<Goal[]>([])
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [selectedType, setSelectedType] = useState('')
  const [targetValue, setTargetValue] = useState('')
  const [deadline, setDeadline] = useState('')
  const [loading, setLoading] = useState(false)

  // Mock data for now - will be replaced with Supabase integration
  useEffect(() => {
    // Load user goals from Supabase
    const mockGoals: Goal[] = [
      {
        id: '1',
        type: 'steps',
        target_value: 10000,
        current_value: 7500,
        unit: 'steps',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        type: 'water',
        target_value: 8,
        current_value: 6,
        unit: 'glasses',
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        type: 'exercise',
        target_value: 60,
        current_value: 30,
        unit: 'minutes',
        created_at: new Date().toISOString()
      }
    ]
    setGoals(mockGoals)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.email || !selectedType || !targetValue) return

    setLoading(true)
    try {
      // TODO: Implement Supabase goal creation/update
      const goalType = goalTypes.find(type => type.value === selectedType)
      
      if (editingGoal) {
        // Update existing goal
        const updatedGoals = goals.map(goal => 
          goal.id === editingGoal.id 
            ? { ...goal, target_value: parseFloat(targetValue), deadline }
            : goal
        )
        setGoals(updatedGoals)
        toast.success(`${goalType?.label} goal updated successfully!`)
      } else {
        // Create new goal
        const newGoal: Goal = {
          id: Date.now().toString(),
          type: selectedType,
          target_value: parseFloat(targetValue),
          current_value: 0,
          unit: goalType?.unit || '',
          deadline: deadline || undefined,
          created_at: new Date().toISOString()
        }
        setGoals([...goals, newGoal])
        toast.success(`${goalType?.label} goal created successfully!`)
      }

      setOpen(false)
      resetForm()
      onGoalUpdated?.()
    } catch (error) {
      console.error('Error saving goal:', error)
      toast.error('Failed to save goal. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedType('')
    setTargetValue('')
    setDeadline('')
    setEditingGoal(null)
  }

  const openEditDialog = (goal: Goal) => {
    setEditingGoal(goal)
    setSelectedType(goal.type)
    setTargetValue(goal.target_value.toString())
    setDeadline(goal.deadline || '')
    setOpen(true)
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getProgressStatus = (current: number, target: number) => {
    const percentage = getProgressPercentage(current, target)
    if (percentage >= 100) return { status: 'completed', color: 'bg-green-500' }
    if (percentage >= 75) return { status: 'on-track', color: 'bg-blue-500' }
    if (percentage >= 50) return { status: 'progress', color: 'bg-yellow-500' }
    return { status: 'behind', color: 'bg-red-500' }
  }

  return (
    <div className="space-y-6">
      {/* Goals Overview */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Goals</h2>
          <p className="text-muted-foreground">Track your progress towards a healthier lifestyle</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Target className="w-4 h-4 mr-2" />
              {editingGoal ? 'Edit Goal' : 'Set New Goal'}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingGoal ? 'Edit Goal' : 'Set New Goal'}</DialogTitle>
              <DialogDescription>
                {editingGoal ? 'Update your wellness goal' : 'Create a new wellness goal to track your progress'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingGoal && (
                <div className="space-y-2">
                  <Label>Goal Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {goalTypes.map((type) => (
                      <Card 
                        key={type.value}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedType === type.value ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => {
                          setSelectedType(type.value)
                          setTargetValue(type.defaultTarget.toString())
                        }}
                      >
                        <CardContent className="p-3 text-center">
                          <div className="text-2xl mb-2">{type.icon}</div>
                          <p className="text-sm font-medium">{type.label}</p>
                          <p className="text-xs text-muted-foreground">{type.unit}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {selectedType && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="target">
                      Target ({goalTypes.find(t => t.value === selectedType)?.unit})
                    </Label>
                    <Input
                      id="target"
                      type="number"
                      step={selectedType === 'sleep' ? '0.5' : '1'}
                      placeholder="Enter target value"
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline" className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Deadline (Optional)
                    </Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : (editingGoal ? 'Update Goal' : 'Create Goal')}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const goalType = goalTypes.find(type => type.value === goal.type)
          const progress = getProgressPercentage(goal.current_value, goal.target_value)
          const status = getProgressStatus(goal.current_value, goal.target_value)
          
          return (
            <Card key={goal.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center">
                    <span className="text-2xl mr-2">{goalType?.icon}</span>
                    {goalType?.label}
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditDialog(goal)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={status.status === 'completed' ? 'default' : 'secondary'}>
                    {status.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                    {status.status === 'completed' ? 'Completed' : 
                     status.status === 'on-track' ? 'On Track' :
                     status.status === 'progress' ? 'In Progress' : 'Behind'}
                  </Badge>
                  {goal.deadline && (
                    <Badge variant="outline">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(goal.deadline).toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">
                      {goal.current_value.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      / {goal.target_value.toLocaleString()} {goal.unit}
                    </span>
                  </div>
                  
                  <Progress value={progress} className="h-2" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {progress.toFixed(0)}% complete
                    </span>
                    <span className="flex items-center text-muted-foreground">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {goal.target_value - goal.current_value > 0 
                        ? `${(goal.target_value - goal.current_value).toLocaleString()} to go`
                        : 'Goal achieved!'}
                    </span>
                  </div>
                </div>
              </CardContent>
              
              {status.status === 'completed' && (
                <div className="absolute top-2 right-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {goals.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Goals Set Yet</h3>
            <p className="text-muted-foreground mb-4">
              Start your wellness journey by setting your first goal!
            </p>
            <Button onClick={() => setOpen(true)}>
              <Target className="w-4 h-4 mr-2" />
              Set Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}