import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Beef, Zap } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1547005327-ef75a6961556?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
      
      <Card className="w-full max-w-md glass-card relative z-10 border-primary/20">
        <CardHeader className="text-center space-y-1">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10 border border-primary/20 neon-border-emerald">
              <Beef className="h-12 w-12 text-primary animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight font-headline neon-text-emerald">
            Cattle Health 360
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your Farm ID to access the IoT Dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="farm-id">Farm ID</Label>
            <Input 
              id="farm-id" 
              placeholder="e.g. GREEN-VALLEY-001" 
              className="bg-background/50 border-white/10 focus:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••"
              className="bg-background/50 border-white/10 focus:border-primary/50"
            />
          </div>
          <Link href="/dashboard" className="block w-full">
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 group">
              Login to Dashboard
              <Zap className="ml-2 h-4 w-4 group-hover:animate-bounce" />
            </Button>
          </Link>
          <div className="text-center text-xs text-muted-foreground mt-4">
            Authorized Personnel Only • Secure 256-bit Encryption
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
