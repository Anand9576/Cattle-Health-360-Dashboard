"use client"

import { useState } from 'react'
import { Bell, Check, Info, AlertTriangle, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface NotificationItem {
  id: string
  title: string
  time: string
  type: 'critical' | 'system' | 'success' | 'info'
  read: boolean
  tabRedirect?: string
}

export function NotificationCenter({ onTabChange }: { onTabChange: (tab: string) => void }) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: '⚠️ Critical: Cow BW-452 Fever Spike detected.',
      time: '2 mins ago',
      type: 'critical',
      read: false,
      tabRedirect: 'alerts'
    },
    {
      id: '2',
      title: 'System: Network Gateway reconnected.',
      time: '15 mins ago',
      type: 'system',
      read: false,
      tabRedirect: 'sensors'
    },
    {
      id: '3',
      title: '✅ Vet Visit confirmed for tomorrow.',
      time: '2 hours ago',
      type: 'success',
      read: true,
      tabRedirect: 'staff'
    },
    {
      id: '4',
      title: 'Report: Weekly Yield Summary available.',
      time: '5 hours ago',
      type: 'info',
      read: true,
      tabRedirect: 'kpis'
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleNotificationClick = (n: NotificationItem) => {
    setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item))
    setOpen(false)
    if (n.tabRedirect) {
      onTabChange(n.tabRedirect)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-white/5 transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-in zoom-in">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 sm:w-96 p-0 glass-card border-white/10" align="end">
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-background/40">
          <h2 className="text-sm font-bold tracking-tight">Notifications</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-auto p-0 text-[10px] font-bold text-primary uppercase tracking-widest hover:bg-transparent"
            onClick={markAllAsRead}
          >
            Mark all as read
          </Button>
        </div>
        <ScrollArea className="h-[400px]">
          <div className="py-2">
            {/* New Section */}
            <div className="px-4 py-2 text-[10px] font-bold text-primary uppercase tracking-widest">
              New
            </div>
            {notifications.filter(n => !n.read).map(n => (
              <NotificationCard 
                key={n.id} 
                item={n} 
                onClick={() => handleNotificationClick(n)} 
              />
            ))}

            {/* Earlier Section */}
            <div className="px-4 py-2 mt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-t border-white/5">
              Earlier
            </div>
            {notifications.filter(n => n.read).map(n => (
              <NotificationCard 
                key={n.id} 
                item={n} 
                onClick={() => handleNotificationClick(n)} 
              />
            ))}

            {notifications.length === 0 && (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No notifications found.
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

function NotificationCard({ item, onClick }: { item: NotificationItem, onClick: () => void }) {
  const getIcon = () => {
    switch (item.type) {
      case 'critical': return <ShieldAlert className="h-4 w-4 text-destructive" />
      case 'system': return <Info className="h-4 w-4 text-secondary" />
      case 'success': return <Check className="h-4 w-4 text-primary" />
      default: return <AlertTriangle className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <button
      className={cn(
        "w-full text-left px-4 py-3 flex items-start gap-4 transition-all duration-200 hover:bg-white/5 group",
        !item.read && item.type === 'critical' ? 'bg-destructive/5' : '',
        !item.read ? 'opacity-100' : 'opacity-60'
      )}
      onClick={onClick}
    >
      <div className={cn(
        "mt-1 p-2 rounded-lg border",
        item.type === 'critical' ? 'bg-destructive/10 border-destructive/20' : 'bg-muted/50 border-white/5'
      )}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-xs leading-snug font-medium mb-1",
          !item.read ? 'text-foreground' : 'text-muted-foreground'
        )}>
          {item.title}
        </p>
        <p className="text-[10px] text-muted-foreground">{item.time}</p>
      </div>
      {!item.read && (
        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
      )}
    </button>
  )
}
