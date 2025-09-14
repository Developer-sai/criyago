'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Activity, 
  Droplets, 
  Moon, 
  Footprints, 
  Bike, 
  Utensils,
  Plus,
  Clock,
  Target
} from 'lucide-react'
import { createActivity } from '@/lib/supabase'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface ActivityTrackerProps {
  onActivityAdded?: () => void
}

const activityTypes = [
  { value: 'walking', label: 'Walking', icon: Footprints, unit: 'steps', color: 'bg-green-500' },
  { value: 'cycling', label: 'Cycling', icon: Bike, unit: 'minutes', color: 'bg-blue-500' },
  { value: 'exercise', label: 'Exercise/Running', icon: Activity, unit: 'minutes', color: 'bg-red-500' },
  { value: 'water', label: 'Water Intake', icon: Droplets, unit: 'glasses', color: 'bg-cyan-500' },
  { value: 'sleep', label: 'Sleep', icon: Moon, unit: 'hours', color: 'bg-purple-500' },
  { value: 'nutrition', label: 'Nutrition', icon: Utensils, unit: 'meals', color: 'bg-orange-500' },
]

export function ActivityTracker({ onActivityAdded }: ActivityTrackerProps) {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)
  const [selectedType, setSelectedType] = useState('')
  const [value, setValue] = useState('')
  const [duration, setDuration] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedActivity = activityTypes.find(type => type.value === selectedType)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.email || !selectedType || !value) return

    setLoading(true)
    try {
      await createActivity({
        user_email: session.user.email,
        type: selectedType,
        value: parseFloat(value),
        duration: duration ? parseInt(duration) : null,
        notes: notes || null,
        date: new Date().toISOString().split('T')[0]
      })

      toast.success(`${selectedActivity?.label} logged successfully!`)
      setOpen(false)
      resetForm()
      onActivityAdded?.()
    } catch (error) {
      console.error('Error creating activity:', error)
      toast.error('Failed to log activity. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedType('')
    setValue('')
    setDuration('')
    setNotes('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Log Activity
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Log New Activity</DialogTitle>
          <DialogDescription>
            Track your daily wellness activities and maintain your healthy habits.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Activity Type Selection */}
          <div className="space-y-2">
            <Label>Activity Type</Label>
            <div className="grid grid-cols-2 gap-3">
              {activityTypes.map((type) => {
                const Icon = type.icon
                return (
                  <Card 
                    key={type.value}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedType === type.value ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedType(type.value)}
                  >
                    <CardContent className="p-3 text-center">
                      <div className={`w-8 h-8 ${type.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-sm font-medium">{type.label}</p>
                      <p className="text-xs text-muted-foreground">{type.unit}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {selectedActivity && (
            <>
              {/* Value Input */}
              <div className="space-y-2">
                <Label htmlFor="value">
                  {selectedActivity.label} ({selectedActivity.unit})
                </Label>
                <Input
                  id="value"
                  type="number"
                  step={selectedActivity.value === 'sleep' ? '0.5' : '1'}
                  placeholder={`Enter ${selectedActivity.unit}`}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                />
              </div>

              {/* Duration Input (optional for some activities) */}
              {!['water', 'nutrition'].includes(selectedActivity.value) && (
                <div className="space-y-2">
                  <Label htmlFor="duration" className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Duration (minutes) - Optional
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="How long did this take?"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes about this activity..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Logging...' : `Log ${selectedActivity.label}`}
                </Button>
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Quick Activity Buttons Component
export function QuickActivityButtons({ onActivityAdded }: ActivityTrackerProps) {
  const { data: session } = useSession()
  const [loading, setLoading] = useState<string | null>(null)

  const quickLog = async (type: string, value: number) => {
    if (!session?.user?.email) return
    
    setLoading(type)
    try {
      await createActivity({
        user_email: session.user.email,
        type,
        value,
        duration: null,
        notes: null,
        date: new Date().toISOString().split('T')[0]
      })

      const activity = activityTypes.find(a => a.value === type)
      toast.success(`${activity?.label} logged: ${value} ${activity?.unit}`)
      onActivityAdded?.()
    } catch (error) {
      console.error('Error logging quick activity:', error)
      toast.error('Failed to log activity')
    } finally {
      setLoading(null)
    }
  }

  const quickActions = [
    { type: 'water', value: 1, label: '+1 Glass Water' },
    { type: 'walking', value: 1000, label: '+1K Steps' },
    { type: 'exercise', value: 15, label: '+15min Exercise' },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {quickActions.map((action) => (
        <Button
          key={action.type}
          size="sm"
          variant="outline"
          onClick={() => quickLog(action.type, action.value)}
          disabled={loading === action.type}
        >
          {loading === action.type ? 'Logging...' : action.label}
        </Button>
      ))}
    </div>
  )
}