"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkles, X, MessageCircle, Send, Loader2 } from 'lucide-react'
import { aiHelpForAlerts } from '@/ai/flows/ai-help-for-alerts'

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: 'Hello! I am your Cattle Health Assistant. How can I help you with current alerts?' }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await aiHelpForAlerts({ alertEvent: userMessage })
      setMessages(prev => [...prev, { role: 'ai', content: response.advice }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I am having trouble connecting to the sensor network advice system.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <Button 
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg neon-border-emerald animate-bounce"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <Card className="w-80 sm:w-96 glass-card border-primary/20 animate-in slide-in-from-bottom-5">
          <CardHeader className="p-4 border-b border-white/10 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className="text-sm font-bold">AI Health Assistant</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-80 p-4">
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      msg.role === 'user' 
                        ? 'bg-secondary text-secondary-foreground' 
                        : 'bg-muted text-foreground border border-white/5'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-3 rounded-lg flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-xs">Analyzing telemetry...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-white/10 flex gap-2">
              <Input 
                placeholder="Ask about an alert..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="bg-background/50"
              />
              <Button size="icon" onClick={handleSend} disabled={isLoading || !inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
