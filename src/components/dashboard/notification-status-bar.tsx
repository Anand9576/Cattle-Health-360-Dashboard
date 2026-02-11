"use client"

import { useState, useEffect } from 'react'
import { Settings, Bell, BellOff, AlertTriangle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'

export function NotificationStatusBar({ criticalAlert }: { criticalAlert?: string | null }) {
  const [settings, setSettings] = useState({
    routineUpdates: true,
    interval: '1 Hour',
    silentMode: false
  })
  const [lastCheck, setLastCheck] = useState('')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Initialize time on client side to avoid hydration mismatch
  useEffect(() => {
    setLastCheck(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    
    const timer = setInterval(() => {
      setLastCheck(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }, 60000)
    
    return () => clearInterval(timer)
  }, [])

  const isCritical = !!criticalAlert

  return (
    <>
      <div className={`w-full py-2 px-6 flex items-center justify-between transition-all duration-500 backdrop-blur-md sticky top-[73px] z-30 border-b ${
        isCritical 
          ? 'bg-destructive/10 border-destructive/20' 
          : 'bg-emerald-500/5 border-emerald-500/10'
      }`}>
        <div className="flex items-center gap-3">
          {isCritical ? (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
              <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-destructive uppercase tracking-tight">
                ⚠️ ALERT: {criticalAlert}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-widest">
                System Status: <span className="text-primary font-bold">All Systems Operational</span> (Last Check: {lastCheck || '--:--'})
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
             {settings.silentMode ? (
              <BellOff className="h-4 w-4 text-muted-foreground opacity-50" />
            ) : (
              <Bell className="h-4 w-4 text-primary opacity-80" />
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-white/5"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Notification Settings</span>
          </Button>
        </div>
      </div>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="glass-modal border-white/10 sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Notification Preferences
            </DialogTitle>
            <DialogDescription>
              Configure how you receive routine status updates and health alerts.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-white/5">
              <div className="space-y-0.5">
                <Label className="text-sm">Routine Status Updates</Label>
                <p className="text-[10px] text-muted-foreground">Receive periodic "All Systems Clear" pings.</p>
              </div>
              <Switch 
                checked={settings.routineUpdates} 
                onCheckedChange={(val) => setSettings(prev => ({ ...prev, routineUpdates: val }))} 
              />
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Update Interval</Label>
              <Select 
                value={settings.interval} 
                onValueChange={(val) => setSettings(prev => ({ ...prev, interval: val }))}
              >
                <SelectTrigger className="bg-background/50 border-white/10">
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="30 mins">Every 30 mins</SelectItem>
                  <SelectItem value="1 Hour">Every 1 Hour</SelectItem>
                  <SelectItem value="4 Hours">Every 4 Hours</SelectItem>
                  <SelectItem value="Daily Summary">Daily Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-white/5">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Silent Mode</Label>
                  {settings.silentMode ? <BellOff className="h-3 w-3 text-muted-foreground" /> : <Bell className="h-3 w-3 text-primary" />}
                </div>
                <p className="text-[10px] text-muted-foreground">Mute audio for non-critical notifications.</p>
              </div>
              <Switch 
                checked={settings.silentMode} 
                onCheckedChange={(val) => setSettings(prev => ({ ...prev, silentMode: val }))} 
              />
            </div>
          </div>

          <DialogFooter>
            <Button className="w-full bg-primary text-primary-foreground font-bold" onClick={() => setIsSettingsOpen(false)}>
              Save Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
